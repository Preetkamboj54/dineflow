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

  const [activeTab, setActiveTab] = useState('orders');

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex gap-6 items-center w-full">
          <div className="w-24 h-24 rounded-3xl bg-gray-200"></div>
          <div className="space-y-3 flex-1">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-32 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </header>
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl w-fit">
        {[...Array(4)].map((_, i) => <div key={i} className="w-32 h-12 bg-gray-200 rounded-xl"></div>)}
      </div>
      <div className="h-96 bg-gray-200 rounded-3xl w-full"></div>
    </div>
  );
  if (!restaurant) return <div className="max-w-7xl mx-auto px-4 p-8 text-center py-20 text-red-500 font-black">Restaurant details not found. Please contact support.</div>;

  const tabs = [
    { id: 'orders', label: 'Live Orders', icon: '🛍️' },
    { id: 'reservations', label: 'Reservations', icon: '📅' },
    { id: 'menu', label: 'Menu Manager', icon: '🍴' },
    { id: 'profile', label: 'Profile Settings', icon: '⚙️' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex gap-6 items-center">
          <div className="relative">
            <img src={restaurant.image} alt={restaurant.name} className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-xl" />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900">{restaurant.name}</h1>
            <p className="text-lg text-[var(--text-muted)] font-medium flex items-center gap-2">
              {restaurant.cuisine} 
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span> 
              <span className="text-sm">{restaurant.address}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${restaurant.isOpen ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {restaurant.isOpen ? 'Accepting Orders' : 'Store Closed'}
          </div>
          <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest">
            {restaurant.isApproved ? 'Verified Partner' : 'Verification Pending'}
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.id 
              ? 'bg-white text-primary shadow-sm border border-gray-100' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl">🛍️</span>
              Live Order Queue
            </h2>
            <OrderKanban restaurantId={restaurant._id} />
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="grid grid-cols-1 gap-8">
            <section className="card glass p-8">
              <h2 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl">📅</span>
                Upcoming Reservations
              </h2>
              <ReservationList restaurantId={restaurant._id} />
            </section>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 gap-8">
             <h2 className="text-2xl font-black tracking-tight mb-2 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl">🍴</span>
              Menu Management
            </h2>
            <MenuManager restaurantId={restaurant._id} />
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black tracking-tight mb-8 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl">⚙️</span>
              Restaurant Settings
            </h2>
            <RestaurantSettings restaurant={restaurant} onUpdate={setRestaurant} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
