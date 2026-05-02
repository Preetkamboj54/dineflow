import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchRestaurants = async (query = '') => {
    try {
      const url = query 
        ? `/api/restaurants?q=${query}` 
        : '/api/restaurants';
      const response = await api.get(url);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(search);
  };

  return (
    <div className="max-w-[1200px] mx-auto my-8 px-6">
      <section className="relative text-center py-24 mb-12 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[400px]">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          {/* Using a high quality, free food video from Pexels (commercial use allowed) */}
          <source src="/videoplayback.mp4" type="video/mp4" />
        </video>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 w-full max-w-xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg tracking-tight">Discover Local Flavors</h1>
          <p className="text-xl text-white/90 mb-8 drop-shadow font-medium">Order from the best restaurants in town</p>
          
          <form onSubmit={handleSearch} className="flex gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20">
            <input 
              type="text" 
              placeholder="Cuisine, dish, or restaurant..." 
              className="flex-1 shadow-none border-none focus:ring-0 px-4 bg-white rounded-xl text-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-primary px-8 rounded-xl">Search</button>
          </form>
        </div>
      </section>

      <div className="restaurants-grid">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : restaurants.length > 0 ? (
          restaurants.map(res => (
            <div key={res._id} className="card restaurant-card" onClick={() => navigate(`/restaurant/${res._id}`)}>
              <img src={res.image} alt={res.name} className="mb-4" />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl mb-1">{res.name}</h3>
                  <p className="text-[var(--text-muted)] text-sm">{res.cuisine}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="font-bold">{res.rating > 0 ? res.rating.toFixed(1) : 'New'}</span>
                    <span className="text-sm">★</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">
                    {res.numReviews || 0} reviews
                  </span>
                  <span className={`text-xs mt-2 font-bold ${res.isOpen ? 'text-[var(--secondary)]' : 'text-[var(--danger)]'}`}>
                    {res.isOpen ? '● Open' : '● Closed'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-[var(--text-muted)] text-lg">No restaurants found. Try a different search!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
