
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToSignup = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthNavigation = () => {
    navigate('/auth');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container mx-auto max-w-6xl text-center">
        <div className="space-y-8">
          {/* Header Navigation */}
          <div className="absolute top-8 right-8">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm"
              >
                Dashboard
              </Button>
            ) : (
              <Button 
                onClick={handleAuthNavigation}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm"
              >
                Sign In
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">
              Get Your Child 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                Excited About Reading
              </span>
              <span className="text-blue-600">– Delivered Daily!</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Personalized printable newsletters with stories, games, science, sports & fun – 
              all based on your child's unique interests and curiosity.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToSignup}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {user ? 'Go to Dashboard' : 'Create My Child\'s Free Profile'}
            </Button>
            <p className="text-sm text-gray-500">✨ Always free • No credit card required</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-gray-800 mb-2">Educational & Fun</h3>
              <p className="text-gray-600 text-sm">Science facts, math puzzles, and stories that make learning exciting</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Personalized Content</h3>
              <p className="text-gray-600 text-sm">Tailored to your child's age, interests, and favorite activities</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🖨️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Print & Enjoy</h3>
              <p className="text-gray-600 text-sm">High-quality PDFs delivered to your email, ready to print</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-gray-400" />
      </div>
    </section>
  );
};

export default HeroSection;
