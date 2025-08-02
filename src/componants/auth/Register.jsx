import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    teamName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, teamName, email, password, confirmPassword } = formData;

    // Basic validation
    if (!username || !teamName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        UserName: username, // Match backend case
        Team_Name: teamName,
        Email: email,
        Password: password
      };

      await axios.post('http://localhost:6001/auth/register', registerData);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Create an Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {['username', 'teamName', 'email', 'password', 'confirmPassword'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                {field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  field === 'confirmPassword' ? 'Confirm your password' : `Enter your ${field}`
                }
                required
              />
            </div>
          ))}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
