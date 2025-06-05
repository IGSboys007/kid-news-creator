
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kids Newsletter
            </h3>
            <p className="text-gray-300">
              Personalized, educational, and fun content delivered right to your inbox. 
              Making reading exciting for the next generation.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-purple-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Sample Newsletter</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="text-gray-300 space-y-2">
              <p>📧 hello@kidsnewsletter.com</p>
              <p>🌟 Follow us for updates and tips</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Facebook</a>
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Twitter</a>
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Instagram</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Kids Newsletter. Made with ❤️ for curious young minds.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
