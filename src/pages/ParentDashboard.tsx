
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, Printer, Settings, User } from 'lucide-react';
import { ChildIntakeForm } from '../components/ChildIntakeForm';
import { ChildDashboardCard } from '../components/ChildDashboardCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
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
  child_id: string;
}

export const ParentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [generatingNewsletter, setGeneratingNewsletter] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchChildren();
      fetchNewsletters();
    }
  }, [user]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: "Error",
        description: "Failed to fetch children",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsletters = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .select(`
          *,
          children!inner(parent_id)
        `)
        .eq('children.parent_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsletters(data || []);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    }
  };

  const handleChildAdded = (newChild: Child) => {
    setChildren(prev => [newChild, ...prev]);
    setIsAddingChild(false);
    toast({
      title: "Success",
      description: `${newChild.name} has been added!`,
    });
  };

  const generateNewsletter = async (childId: string) => {
    setGeneratingNewsletter(childId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-newsletter', {
        body: { childId }
      });

      if (error) throw error;

      toast({
        title: "Newsletter Generated!",
        description: "The newsletter has been created successfully.",
      });

      // Refresh newsletters
      fetchNewsletters();
    } catch (error) {
      console.error('Error generating newsletter:', error);
      toast({
        title: "Error",
        description: "Failed to generate newsletter",
        variant: "destructive",
      });
    } finally {
      setGeneratingNewsletter(null);
    }
  };

  const printNewsletter = (newsletter: Newsletter) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const child = children.find(c => c.id === newsletter.child_id);
      const content = newsletter.content?.text || '';
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${newsletter.title}</title>
            <style>
              body { 
                font-family: 'Comic Sans MS', cursive, sans-serif; 
                line-height: 1.6; 
                max-width: 8.5in;
                margin: 0 auto; 
                padding: 20px;
                background: white;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px;
                padding: 20px;
                border: 3px solid #4F46E5;
                border-radius: 15px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
              }
              .content { 
                white-space: pre-wrap;
                font-size: 14px;
                color: #333;
              }
              .section { 
                margin-bottom: 25px; 
                padding: 15px;
                border-left: 4px solid #4F46E5;
                background-color: #f8f9ff;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📰 ${newsletter.title}</h1>
              <p>A personalized newsletter for ${child?.name}! 🌟</p>
            </div>
            <div class="content">
              ${content.replace(/\n/g, '<br>')}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Parent Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your children's personalized newsletters
          </p>
        </div>
        <Dialog open={isAddingChild} onOpenChange={setIsAddingChild}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Child</DialogTitle>
            </DialogHeader>
            <ChildIntakeForm onChildAdded={handleChildAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {children.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Children Added Yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your first child to start creating personalized newsletters
            </p>
            <Button onClick={() => setIsAddingChild(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Child
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children.map((child) => {
            const childNewsletters = newsletters.filter(n => n.child_id === child.id);
            const latestNewsletter = childNewsletters[0];
            
            return (
              <ChildDashboardCard
                key={child.id}
                child={child}
                latestNewsletter={latestNewsletter}
                onGenerateNewsletter={() => generateNewsletter(child.id)}
                onPrintNewsletter={latestNewsletter ? () => printNewsletter(latestNewsletter) : undefined}
                isGenerating={generatingNewsletter === child.id}
                onChildUpdated={fetchChildren}
              />
            );
          })}
        </div>
      )}

      {newsletters.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Printer className="w-5 h-5 mr-2" />
              Recent Newsletters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newsletters.slice(0, 10).map((newsletter) => {
                const child = children.find(c => c.id === newsletter.child_id);
                return (
                  <div key={newsletter.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{newsletter.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        For {child?.name} • {new Date(newsletter.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => printNewsletter(newsletter)}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
