
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';

interface ChildIntakeFormProps {
  onChildAdded: (child: any) => void;
}

const COMMON_INTERESTS = [
  'Animals', 'Science', 'Sports', 'Art', 'Music', 'Reading', 'Math', 'History',
  'Space', 'Dinosaurs', 'Cooking', 'Nature', 'Technology', 'Dancing', 'Building/Legos',
  'Cars', 'Princesses', 'Superheroes', 'Video Games', 'Movies'
];

const GRADE_LEVELS = [
  'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade',
  '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
  '11th Grade', '12th Grade'
];

export const ChildIntakeForm: React.FC<ChildIntakeFormProps> = ({ onChildAdded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    interests: [] as string[],
    customInterests: '',
    favorite_shows: '',
    hobbies: '',
    delivery_schedule: 'daily' as 'daily' | 'every-other-day' | 'weekly'
  });

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Combine selected interests with custom interests
      const allInterests = [...formData.interests];
      if (formData.customInterests.trim()) {
        const customInterestsList = formData.customInterests
          .split(',')
          .map(i => i.trim())
          .filter(i => i);
        allInterests.push(...customInterestsList);
      }

      const childData = {
        parent_id: user.id,
        name: formData.name,
        age: parseInt(formData.age),
        grade: formData.grade,
        interests: allInterests,
        favorite_shows: formData.favorite_shows,
        hobbies: formData.hobbies,
        delivery_schedule: formData.delivery_schedule,
        is_active: true
      };

      const { data, error } = await supabase
        .from('children')
        .insert([childData])
        .select()
        .single();

      if (error) throw error;

      onChildAdded(data);
      
      // Reset form
      setFormData({
        name: '',
        age: '',
        grade: '',
        interests: [],
        customInterests: '',
        favorite_shows: '',
        hobbies: '',
        delivery_schedule: 'daily'
      });

      toast({
        title: "Success!",
        description: `${formData.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding child:', error);
      toast({
        title: "Error",
        description: "Failed to add child. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Child's Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="3"
                max="18"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="grade">Grade Level</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="delivery_schedule">Newsletter Delivery</Label>
            <Select
              value={formData.delivery_schedule}
              onValueChange={(value: 'daily' | 'every-other-day' | 'weekly') => 
                setFormData(prev => ({ ...prev, delivery_schedule: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="every-other-day">Every Other Day</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interests & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Interests (choose all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {COMMON_INTERESTS.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="customInterests">Additional Interests</Label>
            <Input
              id="customInterests"
              placeholder="Enter other interests, separated by commas"
              value={formData.customInterests}
              onChange={(e) => setFormData(prev => ({ ...prev, customInterests: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="favorite_shows">Favorite TV Shows/Movies</Label>
            <Input
              id="favorite_shows"
              placeholder="e.g., Bluey, Frozen, Spider-Man"
              value={formData.favorite_shows}
              onChange={(e) => setFormData(prev => ({ ...prev, favorite_shows: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="hobbies">Hobbies & Activities</Label>
            <Textarea
              id="hobbies"
              placeholder="Tell us about your child's hobbies, activities, or anything else that makes them unique!"
              value={formData.hobbies}
              onChange={(e) => setFormData(prev => ({ ...prev, hobbies: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding Child...' : 'Add Child'}
      </Button>
    </form>
  );
};
