import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [resResponse, menuResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${id}`),
          axios.get(`http://localhost:5000/api/restaurants/${id}/menu`)
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
    <div className="menu-page">
      <div className="restaurant-header">
        <img src={restaurant.image} alt={restaurant.name} />
        <h1>{restaurant.name}</h1>
        <p>{restaurant.cuisine} | {restaurant.address}</p>
        <p>{restaurant.phone}</p>
      </div>

      <div className="menu-content">
        {categories.map(category => (
          <div key={category} className="menu-category">
            <h2>{category}</h2>
            <div className="menu-items">
              {menu
                .filter(item => item.category === category)
                .map(item => (
                  <div key={item._id} className="menu-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <span className="price">${item.price}</span>
                    </div>
                    <img src={item.image} alt={item.name} />
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
