
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  
  const { signUp, signIn, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (resetMode) {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Reset email sent!",
            description: "Check your email for password reset instructions.",
          });
          setResetMode(false);
        }
      } else if (isSignUp) {
        const { error } = await signUp(email, password, parentName);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 shadow-2xl bg-white/90 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {resetMode ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {resetMode 
              ? 'Enter your email to reset your password' 
              : isSignUp 
                ? 'Sign up to create personalized newsletters for your child'
                : 'Sign in to manage your child\'s newsletters'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && !resetMode && (
            <div className="space-y-2">
              <Label htmlFor="parentName">Your Name</Label>
              <Input
                id="parentName"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required
                className="border-2 focus:border-purple-500"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 focus:border-purple-500"
            />
          </div>

          {!resetMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-2 focus:border-purple-500"
              />
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg rounded-full"
          >
            {loading ? 'Loading...' : resetMode ? 'Send Reset Email' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {!resetMode ? (
            <>
              <p className="text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-1 text-purple-600 hover:text-purple-700 font-semibold"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Forgot your password?
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => setResetMode(false)}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Auth;
