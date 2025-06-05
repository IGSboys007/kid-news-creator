
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddChildForm from '@/components/AddChildForm';
import ChildCard from '@/components/ChildCard';

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

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchChildren();
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
      toast({
        title: "Error",
        description: "Failed to load children profiles",
        variant: "destructive",
      });
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleChildAdded = () => {
    setShowAddForm(false);
    fetchChildren();
  };

  if (loading || loadingChildren) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Kids Newsletter Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your children's personalized newsletters</p>
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="hover:bg-gray-100"
          >
            Sign Out
          </Button>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {children.map((child) => (
            <ChildCard 
              key={child.id} 
              child={child} 
              onUpdate={fetchChildren}
            />
          ))}
          
          {/* Add Child Card */}
          <Card 
            className="p-6 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors cursor-pointer"
            onClick={() => setShowAddForm(true)}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">➕</div>
              <h3 className="text-lg font-semibold text-gray-700">Add Child</h3>
              <p className="text-gray-500 text-sm">Create a new newsletter profile</p>
            </div>
          </Card>
        </div>

        {/* Add Child Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <AddChildForm 
                onSuccess={handleChildAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        )}

        {/* Welcome Message if no children */}
        {children.length === 0 && (
          <Card className="p-8 text-center bg-white/90 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Let's create your first child's newsletter profile to get started with personalized content.
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full"
            >
              Add Your First Child
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
