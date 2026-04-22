import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const RestaurantMenu = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [resResponse, menuResponse] = await Promise.all([
          api.get(`/api/restaurants/${id}`),
          api.get(`/api/restaurants/${id}/menu`)
        ]);
        setRestaurant(resResponse.data);
        setMenu(menuResponse.data);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurantData();
  }, [id]);

  if (!restaurant) return <p>Loading...</p>;

  const categories = [...new Set(menu.map(item => item.category))];

  return (
    <div className="container max-w-5xl">
      {/* Restaurant Hero Section */}
      <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl bg-white border">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="p-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{restaurant.name}</h1>
            <p className="text-lg text-muted font-medium">
              <span className="text-primary">{restaurant.cuisine}</span> • {restaurant.address}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={`/reservation/${id}`} className="btn-secondary px-6">Book a Table</Link>
            <Link to="/cart" className="btn-primary px-6 shadow-lg shadow-primary/20">View Cart</Link>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="space-y-12">
        {categories.map(category => (
          <div key={category}>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">{category}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {menu
                .filter(item => item.category === category)
                .map(item => (
                  <div key={item._id} className="card flex gap-6 items-center p-4 hover:border-primary/30 group">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl shadow-md flex-shrink-0 group-hover:scale-105 transition"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-bold truncate pr-2">{item.name}</h4>
                          {item.rating > 0 && (
                            <div className="flex items-center gap-1 text-amber-500 text-xs">
                              <span>★</span>
                              <span className="font-bold">{item.rating.toFixed(1)}</span>
                              <span className="text-muted font-normal">({item.numReviews})</span>
                            </div>
                          )}
                        </div>
                        <span className="text-primary font-black whitespace-nowrap">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-muted mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
                      <button 
                        onClick={() => addToCart(item, id)} 
                        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                          item.isAvailable 
                            ? 'bg-gray-100 text-gray-900 hover:bg-primary hover:text-white' 
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!item.isAvailable}
                      >
                        {item.isAvailable ? '+ Add to Cart' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
