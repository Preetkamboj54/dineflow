import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
  const { login } = useAuth();
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
        login(response.data.token);
        if (response.data.role === 'restaurant') {
          navigate('/dashboard');
        } else {
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
        <p className="text-[var(--text-muted)]">Sign in to continue to DineFlow</p>
      </div>

      {error && (
        <div className="bg-red-50 text-[var(--danger)] p-3 rounded-xl text-sm mb-6 border border-red-100">
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
        <button type="submit" className="btn-primary w-full mt-2" style={{ padding: '0.75rem' }}>
          Sign In
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-[var(--border)]">
        <p className="text-[var(--text-muted)] text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--primary)] font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
