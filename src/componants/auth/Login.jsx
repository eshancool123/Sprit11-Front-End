import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, password } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await axios.post(
        'http://localhost:6001/auth/login',
        { UserName: formData.username, Password: formData.password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // Required for cookies to be sent from backend
        }
      );
  
      // Save token and user details in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.team));
  
      // Redirect based on user role
      const userRole = response.data.team.Role; // Role from response
      if (userRole === 'User') {
           navigate('/')
      } else if (userRole === 'Admin') {
        navigate('/admin/players')
      } else {
        navigate('/'); // Default fallback
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Login to Your Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;