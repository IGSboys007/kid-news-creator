
import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Tell Us About Your Child",
      description: "Share their age, grade, hobbies, favorite subjects, and what makes them curious",
      icon: "👶",
      color: "from-blue-500 to-purple-500"
    },
    {
      number: "2",
      title: "Choose Delivery Schedule",
      description: "Pick daily, every other day, or weekly delivery based on your family's routine",
      icon: "📅",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "3",
      title: "Get Personalized PDFs",
      description: "Receive fresh, engaging content by email with reading, games, and activities",
      icon: "📧",
      color: "from-pink-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to give your child a personalized reading experience that grows with them
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto`}>
                  {step.number}
                </div>
                <div className="text-4xl mb-4 text-center">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
