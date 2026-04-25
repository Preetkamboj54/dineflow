import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/auth/register', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const user = response.data;
        if (user.role === 'restaurant') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '550px' }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-[var(--text-muted)]">Join the DineFlow community today</p>
      </div>

      {error && (
        <div className="bg-red-50 text-[var(--danger)] p-3 rounded-xl text-sm mb-6 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" placeholder="+1 (555) 000-0000" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>I am a...</label>
          <select name="role" value={formData.role} onChange={handleChange} className="bg-white">
            <option value="customer">Hungry Customer</option>
            <option value="restaurant">Restaurant Owner</option>
          </select>
        </div>

        <button type="submit" className="btn-primary w-full mt-4" style={{ padding: '0.75rem' }}>
          Create Account
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-[var(--border)]">
        <p className="text-[var(--text-muted)] text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--primary)] font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
