import React, { useState, useEffect } from 'react'; 
import { 
  ClipboardList, 
  BarChart2, 
  Award, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = ({ activePage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Navigation items for admin panel
  const navItems = [
    { id: 'players', label: 'Players', icon: <ClipboardList size={20} />, path: '/admin/players' },
    { id: 'player-stats', label: 'Player Stats', icon: <BarChart2 size={20} />, path: '/admin/player-stats-view' },
    { id: 'tournament-summary', label: 'Tournament Summary', icon: <Award size={20} />, path: '/admin/cricket-tournament-dashboard' },
    { id: 'role-managemend', label: 'Role-Management', icon: <Settings size={20} />, path: '/admin/role-management' },
  ];

  const admin = {
    name: "Admin",
    role: "Administrator"
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user')); // Assuming username is saved under 'user' key in localStorage
    if (userData) {
      setUsername(userData.username); // Set the username from localStorage
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleLogout = () => {
    console.log("Admin logout");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <nav className="bg-gray-900 text-white shadow-md hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="font-bold text-xl mr-2">Spirit11</div>
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                ADMIN PANEL
              </span>
            </div>
            
            {/* Main Navigation */}
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${activePage === item.id 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Admin Profile & Logout */}
            <div className="flex items-center">
              <div className="mr-4">
                <div className="text-sm font-medium">{username || admin.name}</div> {/* Display username if available */}
                <div className="text-xs text-gray-400">{admin.role}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                <Shield size={18} />
              </div>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded flex items-center"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <nav className="bg-gray-900 text-white shadow-md md:hidden">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="font-bold text-lg">Spirit11</div>
              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full ml-1">
                ADMIN
              </span>
            </div>
            
            {/* Menu Toggle */}
            <div className="flex items-center space-x-2">
              <div className="text-sm mr-2">{username || admin.name}</div> {/* Display username if available */}
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
          <div className="absolute top-14 left-0 right-0 bg-gray-800 shadow-lg z-50">
            <div className="py-2 px-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center w-full px-3 py-3 text-sm font-medium rounded-md transition-colors mb-1
                    ${activePage === item.id 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'}`}
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
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default AdminNavbar;
