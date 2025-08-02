import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, LogIn, Trophy, Shield, Users, DollarSign } from 'lucide-react';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-600 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl md:text-6xl font-bold">Spirit11</h1>
            <span className="ml-2 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
              FANTASY CRICKET
            </span>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Build your dream team, compete with friends, and win big with the ultimate fantasy cricket experience
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
            <Link to="/register" className="w-full md:w-auto">
              <button className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-lg shadow-lg transition-all w-full">
                <UserPlus className="mr-2" size={20} />
                Register Now
              </button>
            </Link>
            <Link to="/login" className="w-full md:w-auto">
              <button className="flex items-center justify-center bg-transparent hover:bg-blue-700 text-white border-2 border-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all w-full">
                <LogIn className="mr-2" size={20} />
                Login
              </button>
            </Link>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-blue-700 rounded-lg p-6 shadow-lg">
            <div className="rounded-full bg-blue-600 p-3 inline-block mb-4">
              <Trophy size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Exciting Competitions</h3>
            <p className="text-blue-100">Compete in daily, weekly, and seasonal tournaments with players from around the world.</p>
          </div>
          
          <div className="bg-blue-700 rounded-lg p-6 shadow-lg">
            <div className="rounded-full bg-blue-600 p-3 inline-block mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Team Selection</h3>
            <p className="text-blue-100">Use our AI-powered Spiriter to get insights and build the most competitive team possible.</p>
          </div>
          
          <div className="bg-blue-700 rounded-lg p-6 shadow-lg">
            <div className="rounded-full bg-blue-600 p-3 inline-block mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Global Community</h3>
            <p className="text-blue-100">Join thousands of cricket fans and test your knowledge against the best.</p>
          </div>
        </div>
        
        {/* Upcoming Matches Banner */}
        <div className="mt-16 bg-blue-900 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Upcoming Tournaments</h2>
          <div className="flex flex-wrap gap-4">


          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-blue-900 py-6 ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="font-bold text-xl">Spirit11</div>
                <span className="text-xs bg-yellow-400 text-blue-900 px-2 py-0.5 rounded-full ml-1">
                  FANTASY CRICKET
                </span>
              </div>
              <p className="text-blue-300 text-sm mt-1">© 2025 Spirit11. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-blue-300 hover:text-white">About</a>
              <a href="#" className="text-blue-300 hover:text-white">Terms</a>
              <a href="#" className="text-blue-300 hover:text-white">Privacy</a>
              <a href="#" className="text-blue-300 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;