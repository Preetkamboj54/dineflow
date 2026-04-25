import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
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
      <section className="text-center py-12">
        <h1 className="text-5xl font-extrabold mb-4">Discover Local Flavors</h1>
        <p className="text-xl text-[var(--text-muted)] mb-8">Order from the best restaurants in town</p>
        
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Cuisine, dish, or restaurant..." 
              className="flex-1 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>
      </section>

      <div className="restaurants-grid">
        {restaurants.length > 0 ? (
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
