
import React from 'react';

const PreviewSection = () => {
  return (
    <section className="py-20 px-4 bg-white/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            See What Your Child Will Love
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Each newsletter is uniquely crafted with engaging content that matches your child's interests
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
              <h3 className="font-bold text-gray-800 mb-2">🔬 Fun Science Facts</h3>
              <p className="text-gray-600">Did you know butterflies taste with their feet? Cool discoveries that spark curiosity!</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
              <h3 className="font-bold text-gray-800 mb-2">🏀 Sports Highlights</h3>
              <p className="text-gray-600">Age-appropriate sports news and fun facts about your child's favorite athletes and teams.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-pink-500">
              <h3 className="font-bold text-gray-800 mb-2">🧩 Brain Teasers & Puzzles</h3>
              <p className="text-gray-600">Math challenges, word games, and logic puzzles that make learning feel like play.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
              <h3 className="font-bold text-gray-800 mb-2">🎉 Famous Birthdays & Fun Facts</h3>
              <p className="text-gray-600">Learn about amazing people who changed the world, from scientists to artists!</p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <div className="text-center border-b pb-4">
                  <h3 className="text-2xl font-bold text-gray-800">The Morning Edition</h3>
                  <p className="text-sm text-gray-600">Emma's Personal Newsletter • March 15, 2024</p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-800 text-sm">🔬 Science Corner</h4>
                    <p className="text-xs text-gray-700">Why do cats purr? It's not just happiness...</p>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-purple-800 text-sm">🏀 Sports Update</h4>
                    <p className="text-xs text-gray-700">Basketball tips from your favorite players!</p>
                  </div>
                  
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-pink-800 text-sm">🧩 Today's Puzzle</h4>
                    <p className="text-xs text-gray-700">Can you solve this math mystery?</p>
                  </div>
                </div>
                
                <div className="text-center pt-4 border-t">
                  <p className="text-xs text-gray-500">Made just for Emma ✨</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
