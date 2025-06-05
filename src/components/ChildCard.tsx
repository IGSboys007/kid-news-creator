
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
  interests: string[];
  favorite_shows: string;
  hobbies: string;
  delivery_schedule: string;
  is_active: boolean;
}

interface ChildCardProps {
  child: Child;
  onUpdate: () => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onUpdate }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('children')
        .update({ is_active: !child.is_active })
        .eq('id', child.id);

      if (error) throw error;

      toast({
        title: child.is_active ? "Newsletters paused" : "Newsletters resumed",
        description: `${child.name}'s newsletters have been ${child.is_active ? 'paused' : 'resumed'}.`,
      });

      onUpdate();
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

  const getScheduleText = (schedule: string) => {
    switch (schedule) {
      case 'daily': return 'Daily';
      case 'every-other-day': return 'Every Other Day';
      case 'weekly': return 'Weekly';
      default: return schedule;
    }
  };

  return (
    <Card className={`p-6 ${child.is_active ? 'bg-white' : 'bg-gray-100'} shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{child.name}</h3>
            <p className="text-gray-600">
              Age {child.age} {child.grade && `• ${child.grade}`}
            </p>
          </div>
          <Badge variant={child.is_active ? "default" : "secondary"}>
            {child.is_active ? "Active" : "Paused"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div>
            <span className="font-semibold text-sm text-gray-700">Delivery:</span>
            <span className="ml-2 text-sm text-gray-600">{getScheduleText(child.delivery_schedule)}</span>
          </div>
          
          {child.interests.length > 0 && (
            <div>
              <span className="font-semibold text-sm text-gray-700">Interests:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {child.interests.slice(0, 3).map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {child.interests.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{child.interests.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {child.favorite_shows && (
            <div>
              <span className="font-semibold text-sm text-gray-700">Favorite Shows:</span>
              <p className="text-sm text-gray-600 truncate">{child.favorite_shows}</p>
            </div>
          )}
        </div>

        <Button 
          onClick={toggleActive}
          disabled={loading}
          variant={child.is_active ? "outline" : "default"}
          className="w-full"
        >
          {loading ? 'Updating...' : child.is_active ? 'Pause Newsletters' : 'Resume Newsletters'}
        </Button>
      </div>
    </Card>
  );
};

export default ChildCard;
