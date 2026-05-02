import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, restRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/restaurants')
      ]);
      setStats(statsRes.data.stats);
      setRestaurants(restRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, field, value) => {
    try {
      await api.put(`/api/admin/restaurants/${id}`, { [field]: value });
      fetchData(); // Refresh list
    } catch (err) {
      alert('Failed to update restaurant status');
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-8 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
      <div className="h-96 bg-gray-200 rounded-xl"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-8">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Oversight</h1>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="stats-card">
          <p>Total Revenue</p>
          <h3 className="text-2xl font-bold">₹{stats?.totalRevenue.toFixed(2)}</h3>
        </div>
        <div className="stats-card">
          <p>Total Users</p>
          <h3 className="text-2xl font-bold">{stats?.totalUsers}</h3>
        </div>
        <div className="stats-card">
          <p>Active Orders</p>
          <h3 className="text-2xl font-bold">{stats?.totalOrders}</h3>
        </div>
        <div className="stats-card">
          <p>Top Restaurant</p>
          <h3 className="text-xl font-bold">{stats?.topRestaurant}</h3>
        </div>
      </div>

      {/* Restaurant Management */}
      <section className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Restaurant Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Cuisine</th>
                <th className="p-4">Status</th>
                <th className="p-4">Approval</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {restaurants.map(res => (
                <tr key={res._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">{res.name}</td>
                  <td className="p-4">{res.cuisine}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${res.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {res.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${res.isApproved ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {res.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    <button 
                      onClick={() => handleToggle(res._id, 'isApproved', !res.isApproved)}
                      className={`btn-sm ${res.isApproved ? 'btn-danger' : 'btn-primarys'}`}
                    >
                      {res.isApproved ? 'Revoke' : 'Approve'}
                    </button>
                    <button 
                      onClick={() => handleToggle(res._id, 'isOpen', !res.isOpen)}
                      className="btn-sm btn-secondary"
                    >
                      {res.isOpen ? 'Close' : 'Open'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
