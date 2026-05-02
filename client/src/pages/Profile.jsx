import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressData, setAddressData] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/users/profile');
      setUser(res.data);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.put('/api/users/profile', formData);
      setUser(res.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAddressData({ ...addressData, [e.target.name]: value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingAddress) {
        res = await api.put(`/api/users/addresses/${editingAddress._id}`, addressData);
      } else {
        res = await api.post('/api/users/addresses', addressData);
      }
      setUser({ ...user, addresses: res.data });
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressData({ label: 'Home', street: '', city: '', state: '', zipCode: '', isDefault: false });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save address');
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await api.delete(`/api/users/addresses/${id}`);
      setUser({ ...user, addresses: res.data });
    } catch (err) {
      alert('Failed to delete address');
    }
  };

  const startEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressData({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      isDefault: addr.isDefault
    });
    setShowAddressForm(true);
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card glass p-6 h-96 bg-gray-200"></div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="card glass p-5 h-40 bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-8 tracking-tighter">My <span className="text-[var(--primary)]">Profile</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Details */}
        <div className="lg:col-span-1">
          <div className="card glass p-6">
            <h2 className="text-xl font-bold mb-6">Account Details</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
              
              {message && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message.text}
                </div>
              )}

              <button type="submit" disabled={saving} className="btn-primary w-full py-3">
                {saving ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>

        {/* Address Management */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Saved Addresses</h2>
            <button 
              onClick={() => {
                setEditingAddress(null);
                setAddressData({ label: 'Home', street: '', city: '', state: '', zipCode: '', isDefault: false });
                setShowAddressForm(true);
              }}
              className="btn-secondary px-4 py-2 text-sm"
            >
              + Add New
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses?.map(addr => (
              <div key={addr._id} className="card glass p-5 relative border border-gray-100 hover:border-primary/30 transition-all">
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 bg-primary/10 text-[var(--primary)] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
                <h3 className="font-bold text-lg mb-1">{addr.label}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">
                  {addr.street}<br />
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
                <div className="flex gap-4">
                  <button onClick={() => startEditAddress(addr)} className="text-xs font-bold text-[var(--primary)] hover:underline">Edit</button>
                  <button onClick={() => deleteAddress(addr._id)} className="text-xs font-bold text-[var(--danger)] hover:underline">Delete</button>
                </div>
              </div>
            ))}
            {(!user.addresses || user.addresses.length === 0) && (
              <div className="col-span-full py-12 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400">No addresses saved yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="card bg-white w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-6 tracking-tight">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="form-group">
                <label>Label (e.g. Home, Office)</label>
                <input name="label" value={addressData.label} onChange={handleAddressChange} required />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input name="street" value={addressData.street} onChange={handleAddressChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={addressData.city} onChange={handleAddressChange} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={addressData.state} onChange={handleAddressChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input name="zipCode" value={addressData.zipCode} onChange={handleAddressChange} required />
              </div>
              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="isDefault" 
                  name="isDefault" 
                  checked={addressData.isDefault} 
                  onChange={handleAddressChange} 
                />
                <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">Set as default address</label>
              </div>

              <div className="flex gap-4 mt-6">
                <button type="submit" className="btn-primary flex-1 py-3">Save Address</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddressForm(false)} 
                  className="btn-secondary flex-1 py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
