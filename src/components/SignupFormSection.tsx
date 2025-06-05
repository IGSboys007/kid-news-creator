import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const SignupFormSection = () => {
  const { toast } = useToast();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    password: '',
    childName: '',
    childAge: '',
    childGrade: '',
    interests: [],
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
    setLoading(true);

    try {
      // Sign up the parent
      const { error: signUpError } = await signUp(
        formData.parentEmail, 
        formData.password, 
        formData.parentName
      );

      if (signUpError) {
        throw signUpError;
      }

      // Get the current user session to create child profile
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Create child profile
        const { error: childError } = await supabase
          .from('children')
          .insert({
            parent_id: session.user.id,
            name: formData.childName,
            age: parseInt(formData.childAge),
            grade: formData.childGrade,
            interests: formData.interests,
            favorite_shows: formData.favoriteShows,
            hobbies: formData.hobbies,
            delivery_schedule: formData.deliverySchedule
          });

        if (childError) {
          console.error('Child creation error:', childError);
          // Don't throw here as the user account was created successfully
        }
      }

      toast({
        title: "Welcome to the family! 🎉",
        description: `${formData.childName}'s first personalized newsletter will arrive within 24 hours! Please check your email to verify your account.`,
      });

      // Redirect to dashboard
      navigate('/dashboard');
      
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

  // If user is already logged in, redirect to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <section id="signup-form" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Create Your Child's Profile
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your little reader so we can create the perfect newsletter just for them
          </p>
        </div>

        <Card className="p-8 shadow-2xl bg-white/90 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Parent Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Your Name *</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                    required
                    className="border-2 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Your Email *</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                    required
                    className="border-2 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                    className="border-2 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Child Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">About Your Child</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Name *</Label>
                  <Input
                    id="childName"
                    value={formData.childName}
                    onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                    required
                    className="border-2 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childAge">Age *</Label>
                  <Input
                    id="childAge"
                    type="number"
                    min="3"
                    max="18"
                    value={formData.childAge}
                    onChange={(e) => setFormData(prev => ({ ...prev, childAge: e.target.value }))}
                    required
                    className="border-2 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childGrade">Grade</Label>
                  <Input
                    id="childGrade"
                    placeholder="e.g., 3rd Grade"
                    value={formData.childGrade}
                    onChange={(e) => setFormData(prev => ({ ...prev, childGrade: e.target.value }))}
                    className="border-2 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">What are they interested in?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {interestOptions.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={formData.interests.includes(interest)}
                      onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                      className="border-2"
                    />
                    <Label htmlFor={interest} className="text-sm cursor-pointer">
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Tell us more!</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="favoriteShows">Favorite Shows/Movies</Label>
                  <Textarea
                    id="favoriteShows"
                    placeholder="e.g., Encanto, Harry Potter, National Geographic Kids..."
                    value={formData.favoriteShows}
                    onChange={(e) => setFormData(prev => ({ ...prev, favoriteShows: e.target.value }))}
                    className="border-2 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hobbies">Hobbies & Activities</Label>
                  <Textarea
                    id="hobbies"
                    placeholder="e.g., soccer, drawing, coding, collecting rocks..."
                    value={formData.hobbies}
                    onChange={(e) => setFormData(prev => ({ ...prev, hobbies: e.target.value }))}
                    className="border-2 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Schedule */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">How often would you like newsletters?</h3>
              <RadioGroup
                value={formData.deliverySchedule}
                onValueChange={(value) => setFormData(prev => ({ ...prev, deliverySchedule: value }))}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:bg-purple-50 cursor-pointer">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="cursor-pointer">
                    <div className="font-semibold">Daily</div>
                    <div className="text-sm text-gray-600">Perfect for eager readers</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:bg-purple-50 cursor-pointer">
                  <RadioGroupItem value="every-other-day" id="every-other-day" />
                  <Label htmlFor="every-other-day" className="cursor-pointer">
                    <div className="font-semibold">Every Other Day</div>
                    <div className="text-sm text-gray-600">Great balance</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:bg-purple-50 cursor-pointer">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly" className="cursor-pointer">
                    <div className="font-semibold">Weekly</div>
                    <div className="text-sm text-gray-600">Perfect for busy families</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="text-center pt-8">
              <Button 
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {loading ? 'Creating Account...' : 'Start My Free Subscription 🎉'}
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                ✨ Always free • No credit card required • Cancel anytime
              </p>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default SignupFormSection;
