import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/auth/login', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.role === 'restaurant') {
          navigate('/dashboard');
        } else {
          // Both normal users and admins go to the home page (restaurants list)
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-muted">Sign in to continue to DineFlow</p>
      </div>

      {error && (
        <div className="bg-red-50 text-danger p-3 rounded-lg text-sm mb-6 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            name="email" 
            placeholder="chef@dineflow.com"
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••"
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="btn-primary w-full py-3 mt-2">Sign In</button>
      </form>
      
      <div className="mt-8 text-center pt-6 border-t">
        <p className="text-muted text-sm">
          Don't have an account? <Link to="/register" className="text-primary font-semibold">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
