import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get('/api/reservations');
        setReservations(res.data);
      } catch (err) {
        console.error('Failed to fetch reservations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-pulse">
      <header className="mb-10">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card bg-white p-6 rounded-2xl border shadow-sm h-48">
             <div className="flex justify-between items-start mb-4">
               <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
               <div className="space-y-2">
                 <div className="w-16 h-4 bg-gray-200 rounded ml-auto"></div>
                 <div className="w-12 h-6 bg-gray-200 rounded ml-auto"></div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="h-6 bg-gray-200 rounded w-1/2"></div>
               <div className="flex gap-4">
                 <div className="w-20 h-4 bg-gray-200 rounded"></div>
                 <div className="w-20 h-4 bg-gray-200 rounded"></div>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">My Reservations</h1>
        <p className="text-[var(--text-muted)] font-medium">Track your upcoming table bookings</p>
      </header>

      {reservations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed shadow-sm">
          <p className="text-[var(--text-muted)] text-lg">You haven't made any reservations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map(res => (
            <div key={res._id} className="card bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  res.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                  res.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {res.status}
                </span>
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--primary)]">{new Date(res.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <p className="text-2xl font-black">{res.time}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h3 className="text-xl font-bold">{res.restaurantId?.name}</h3>
                <div className="flex gap-4 text-sm text-[var(--text-muted)] font-medium">
                  <span>👥 {res.partySize} People</span>
                  <span>🪑 {res.seatingPreference} Seating</span>
                </div>
              </div>

              {res.status === 'Confirmed' && (
                <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                  <p className="text-xs text-green-700 font-bold">✓ Your table is confirmed! See you then.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
