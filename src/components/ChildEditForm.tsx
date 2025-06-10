
import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';

interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
  interests: string[];
  favorite_shows: string;
  hobbies: string;
  delivery_schedule: 'daily' | 'every-other-day' | 'weekly';
  is_active: boolean;
}

interface ChildEditFormProps {
  child: Child;
  onChildUpdated: () => void;
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

export const ChildEditForm: React.FC<ChildEditFormProps> = ({ child, onChildUpdated }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: child.name,
    age: child.age.toString(),
    grade: child.grade,
    interests: child.interests,
    favorite_shows: child.favorite_shows || '',
    hobbies: child.hobbies || '',
    delivery_schedule: child.delivery_schedule
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
    setLoading(true);

    try {
      const { error } = await supabase
        .from('children')
        .update({
          name: formData.name,
          age: parseInt(formData.age),
          grade: formData.grade,
          interests: formData.interests,
          favorite_shows: formData.favorite_shows,
          hobbies: formData.hobbies,
          delivery_schedule: formData.delivery_schedule
        })
        .eq('id', child.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `${formData.name}'s profile has been updated.`,
      });

      onChildUpdated();
    } catch (error) {
      console.error('Error updating child:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
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
        {loading ? 'Updating Profile...' : 'Update Profile'}
      </Button>
    </form>
  );
};
