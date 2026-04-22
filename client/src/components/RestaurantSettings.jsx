import React, { useState } from 'react';
import api from '../utils/api';

const RestaurantSettings = ({ restaurant, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    address: restaurant.address,
    phone: restaurant.phone,
    image: restaurant.image,
    seatingOptions: restaurant.seatingOptions?.join(', ') || 'Indoor, Outdoor, Window',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        ...formData,
        seatingOptions: formData.seatingOptions.split(',').map(s => s.trim()).filter(s => s)
      };
      const res = await api.put(`/api/restaurants/${restaurant._id}/profile`, payload);
      onUpdate(res.data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Restaurant Profile Settings</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label>Restaurant Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Cuisine Type</label>
            <input name="cuisine" value={formData.cuisine} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" value={formData.address} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="form-group">
          <label>Image URL</label>
          <input name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
        </div>

        <div className="form-group">
          <label>Seating Options (comma separated)</label>
          <input name="seatingOptions" value={formData.seatingOptions} onChange={handleChange} placeholder="Indoor, Outdoor, Window, Rooftop" />
        </div>

        {formData.image && (
          <div className="mb-4">
            <p className="text-sm text-muted mb-2">Preview:</p>
            <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
          </div>
        )}

        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default RestaurantSettings;
