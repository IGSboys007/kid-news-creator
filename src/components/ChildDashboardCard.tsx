
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Printer, Calendar, Settings, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ChildEditForm } from './ChildEditForm';
import { supabase } from '../integrations/supabase/client';
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
  created_at: string;
}

interface Newsletter {
  id: string;
  title: string;
  content: any;
  created_at: string;
}

interface ChildDashboardCardProps {
  child: Child;
  latestNewsletter?: Newsletter;
  onGenerateNewsletter: () => void;
  onPrintNewsletter?: () => void;
  isGenerating: boolean;
  onChildUpdated: () => void;
}

export const ChildDashboardCard: React.FC<ChildDashboardCardProps> = ({
  child,
  latestNewsletter,
  onGenerateNewsletter,
  onPrintNewsletter,
  isGenerating,
  onChildUpdated
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const toggleActiveStatus = async () => {
    try {
      const { error } = await supabase
        .from('children')
        .update({ is_active: !child.is_active })
        .eq('id', child.id);

      if (error) throw error;

      toast({
        title: "Updated",
        description: `${child.name}'s newsletters are now ${!child.is_active ? 'active' : 'paused'}`,
      });

      onChildUpdated();
    } catch (error) {
      console.error('Error updating child status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getScheduleDisplay = (schedule: string) => {
    switch (schedule) {
      case 'daily': return 'Daily';
      case 'every-other-day': return 'Every Other Day';
      case 'weekly': return 'Weekly';
      default: return schedule;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {child.name}
              <Badge variant={child.is_active ? "default" : "secondary"}>
                {child.is_active ? 'Active' : 'Paused'}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Age {child.age} • {child.grade || 'Grade not specified'}
            </p>
          </div>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit {child.name}'s Profile</DialogTitle>
              </DialogHeader>
              <ChildEditForm 
                child={child} 
                onChildUpdated={() => {
                  onChildUpdated();
                  setIsEditing(false);
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Interests</h4>
          <div className="flex flex-wrap gap-1">
            {child.interests.slice(0, 6).map((interest, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
            {child.interests.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{child.interests.length - 6} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{getScheduleDisplay(child.delivery_schedule)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Active</span>
            <Switch
              checked={child.is_active}
              onCheckedChange={toggleActiveStatus}
            />
          </div>
        </div>

        {latestNewsletter && (
          <div className="p-3 bg-muted rounded-lg">
            <h5 className="font-medium text-sm mb-1">Latest Newsletter</h5>
            <p className="text-xs text-muted-foreground mb-2">
              {new Date(latestNewsletter.created_at).toLocaleDateString()}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onPrintNewsletter}
              className="w-full"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Newsletter
            </Button>
          </div>
        )}

        <Button
          onClick={onGenerateNewsletter}
          disabled={isGenerating || !child.is_active}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate New Newsletter'}
        </Button>
      </CardContent>
    </Card>
  );
};
