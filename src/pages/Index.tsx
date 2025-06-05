
import React from 'react';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import SignupFormSection from '../components/SignupFormSection';
import PreviewSection from '../components/PreviewSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <HeroSection />
      <HowItWorksSection />
      <PreviewSection />
      <SignupFormSection />
      <Footer />
    </div>
  );
};

export default Index;
