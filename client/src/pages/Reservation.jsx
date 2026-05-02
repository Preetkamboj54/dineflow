import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';

const Reservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '19:00',
    partySize: 2,
    seatingPreference: 'Indoor'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/api/restaurants/${id}`);
        setRestaurant(res.data);
        if (res.data.seatingOptions?.length > 0) {
          setFormData(prev => ({ ...prev, seatingPreference: res.data.seatingOptions[0] }));
        }
      } catch (err) {
        console.error('Failed to fetch restaurant', err);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.post('/api/reservations', {
        restaurantId: id,
        ...formData
      });

      setStatus({ type: 'success', message: response.data.message });
      setTimeout(() => navigate('/my-reservations'), 2000);
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to request reservation' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-pulse">
      <div className="card bg-white p-8 rounded-3xl shadow-xl border">
        <header className="text-center mb-8 flex flex-col items-center">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </header>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-14 bg-gray-200 rounded-xl w-full mt-4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="card bg-white p-8 rounded-3xl shadow-xl border">
        <header className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-2">Book a Table</h2>
          <p className="text-[var(--text-muted)] font-medium">Reserve your spot at {restaurant.name}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label>Party Size</label>
              <input type="number" name="partySize" value={formData.partySize} onChange={handleChange} min="1" max="20" required />
            </div>
            <div className="form-group">
              <label>Seating Preference</label>
              <select name="seatingPreference" value={formData.seatingPreference} onChange={handleChange}>
                {restaurant.seatingOptions?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {status.message && (
            <div className={`p-4 rounded-xl text-sm font-bold text-center ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.message}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
            {loading ? 'Processing...' : 'Request Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
