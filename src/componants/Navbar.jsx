import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  UserPlus, 
  Clipboard, 
  DollarSign, 
  Award, 
  MessageCircle, 
  Menu, 
  X,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activePage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { id: 'players', label: 'Players', icon: <Users size={20} />, path: '/players-view' },
    { id: 'select-team', label: 'Select Team', icon: <UserPlus size={20} />, path: '/select-your-team-view' },
    { id: 'team', label: 'My Team', icon: <Clipboard size={20} />, path: '/team-view' },
    { id: 'budget', label: 'Budget', icon: <DollarSign size={20} />, path: '/budget-view' },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Award size={20} />, path: '/leaderboard' },
    { id: 'spiriter', label: 'Spiriter AI', icon: <MessageCircle size={20} />, path: '/spiriter-ai' },
  ];

  // Sample user data
  const user = {
    name: "cricket_fan123",
    avatar: null
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <nav className="bg-blue-700 text-white shadow-md hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="font-bold text-xl mr-2">Spirit11</div>
              <span className="text-xs bg-yellow-400 text-blue-900 px-2 py-1 rounded-full">
                FANTASY CRICKET
              </span>
            </div>
            
            {/* Main Navigation */}
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${activePage === item.id 
                      ? 'bg-blue-800 text-white' 
                      : 'text-blue-100 hover:bg-blue-600'}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* User Profile */}
            <div className="flex items-center">
              <div className="text-sm mr-2">{user.name}</div>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <User size={18} />
                )}
              </div>
              {/* Logout Button */}
              <button 
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded flex items-center"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <nav className="bg-blue-700 text-white shadow-md md:hidden">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="font-bold text-lg">Spirit11</div>
              <span className="text-xs bg-yellow-400 text-blue-900 px-1.5 py-0.5 rounded-full ml-1">
                FANTASY
              </span>
            </div>
            
            {/* User and Menu Toggle */}
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full" />
                ) : (
                  <User size={16} />
                )}
              </div>
              <button 
                className="p-1"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-blue-800 shadow-lg z-50">
            <div className="py-2 px-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center w-full px-3 py-3 text-sm font-medium rounded-md transition-colors mb-1
                    ${activePage === item.id 
                      ? 'bg-blue-900 text-white' 
                      : 'text-blue-100 hover:bg-blue-700'}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              {/* Logout in mobile menu */}
              <button
                className="flex items-center w-full px-3 py-3 text-sm font-medium text-red-400 hover:bg-red-900 hover:text-red-200 rounded-md transition-colors mt-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
