
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddChildFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddChildForm: React.FC<AddChildFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    interests: [] as string[],
    favoriteShows: '',
    hobbies: '',
    deliverySchedule: 'daily'
  });

  const interestOptions = [
    'Science & Nature', 'Sports', 'Art & Crafts', 'Math & Puzzles',
    'Animals', 'Space & Astronomy', 'Music', 'Cooking',
    'History', 'Technology', 'Reading & Books', 'Movies & TV'
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('children')
        .insert({
          parent_id: user.id,
          name: formData.name,
          age: parseInt(formData.age),
          grade: formData.grade,
          interests: formData.interests,
          favorite_shows: formData.favoriteShows,
          hobbies: formData.hobbies,
          delivery_schedule: formData.deliverySchedule
        });

      if (error) throw error;

      toast({
        title: "Success! 🎉",
        description: `${formData.name}'s profile has been created. Their first newsletter will be generated soon!`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add Child Profile</h2>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Child's Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="border-2 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              min="3"
              max="18"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              required
              className="border-2 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              placeholder="e.g., 3rd Grade"
              value={formData.grade}
              onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
              className="border-2 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Interests</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={interest}
                  checked={formData.interests.includes(interest)}
                  onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                />
                <Label htmlFor={interest} className="text-sm cursor-pointer">
                  {interest}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="favoriteShows">Favorite Shows/Movies</Label>
            <Textarea
              id="favoriteShows"
              placeholder="e.g., Encanto, Harry Potter..."
              value={formData.favoriteShows}
              onChange={(e) => setFormData(prev => ({ ...prev, favoriteShows: e.target.value }))}
              className="border-2 focus:border-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hobbies">Hobbies & Activities</Label>
            <Textarea
              id="hobbies"
              placeholder="e.g., soccer, drawing, coding..."
              value={formData.hobbies}
              onChange={(e) => setFormData(prev => ({ ...prev, hobbies: e.target.value }))}
              className="border-2 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Delivery Schedule</Label>
          <RadioGroup
            value={formData.deliverySchedule}
            onValueChange={(value) => setFormData(prev => ({ ...prev, deliverySchedule: value }))}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="cursor-pointer">
                <div className="font-semibold">Daily</div>
                <div className="text-sm text-gray-600">Perfect for eager readers</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="every-other-day" id="every-other-day" />
              <Label htmlFor="every-other-day" className="cursor-pointer">
                <div className="font-semibold">Every Other Day</div>
                <div className="text-sm text-gray-600">Great balance</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="cursor-pointer">
                <div className="font-semibold">Weekly</div>
                <div className="text-sm text-gray-600">Perfect for busy families</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg rounded-full"
        >
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </Button>
      </form>
    </div>
  );
};

export default AddChildForm;
