import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import MenuManager from '../components/MenuManager';
import ReservationList from '../components/ReservationList';
import OrderKanban from '../components/OrderKanban';
import RestaurantSettings from '../components/RestaurantSettings';

const RestaurantDashboard = () => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token.split('.').length === 3) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        setUser(payload);
      } catch (e) {
        console.error('Invalid token', e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/api/restaurants/${user.id}`);
        setRestaurant(res.data);
      } catch (err) {
        console.error('Failed to fetch restaurant', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.role === 'restaurant') {
      fetchRestaurant();
    }
  }, [user]);

  if (loading) return <div className="container p-8 text-center">Loading dashboard...</div>;
  if (!restaurant) return <div className="container p-8 text-center text-red-500">Restaurant details not found. Please contact support.</div>;

  return (
    <div className="container max-w-6xl flex flex-col gap-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div className="flex gap-6 items-center">
          <img src={restaurant.image} alt={restaurant.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg" />
          <div>
            <h1 className="text-4xl font-extrabold">{restaurant.name}</h1>
            <p className="text-muted font-medium">{restaurant.cuisine} • {restaurant.address}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
            {restaurant.isApproved ? 'Approved' : 'Pending'}
          </span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-3">
          <OrderKanban restaurantId={restaurant._id} />
        </div>

        <div className="md:col-span-2 flex flex-col gap-8">
          <MenuManager restaurantId={restaurant._id} />
        </div>
        
        <div className="flex flex-col gap-8">
          <RestaurantSettings restaurant={restaurant} onUpdate={setRestaurant} />
          <section className="card bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Upcoming Reservations</h2>
            <ReservationList restaurantId={restaurant._id} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
