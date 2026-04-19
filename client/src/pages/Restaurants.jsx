import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchRestaurants = async (query = '') => {
    try {
      const url = query 
        ? `http://localhost:5000/api/restaurants?q=${query}` 
        : 'http://localhost:5000/api/restaurants';
      const response = await axios.get(url);
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
    <div className="restaurants-page">
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search by name or cuisine..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="restaurants-grid">
        {restaurants.length > 0 ? (
          restaurants.map(res => (
            <div key={res._id} className="restaurant-card" onClick={() => navigate(`/restaurant/${res._id}`)}>
              <img src={res.image} alt={res.name} />
              <h3>{res.name}</h3>
              <p>{res.cuisine}</p>
              <div className="restaurant-info">
                <span>⭐ {res.rating}</span>
                <span>{res.isOpen ? '🟢 Open' : '🔴 Closed'}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
