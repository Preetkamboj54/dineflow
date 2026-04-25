import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ReservationList = ({ restaurantId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await api.get(`/api/reservations/restaurant/${restaurantId}`);
      setReservations(res.data);
    } catch (err) {
      console.error('Failed to fetch reservations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [restaurantId]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/api/reservations/${id}/status`, { status });
      fetchReservations();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update reservation status');
    }
  };

  if (loading) return <div className="text-gray-500 p-4">Loading reservations...</div>;

  return (
    <div className="space-y-4">
      {reservations.length === 0 ? (
        <div className="text-gray-500 text-center py-10 border border-dashed rounded-2xl bg-gray-50">
          No reservations found for today.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reservations.map(res => (
            <div key={res._id} className="card glass p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-5">
                  <div className="bg-primary text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-lg shadow-primary/20">
                    <span className="text-[10px] uppercase tracking-tighter opacity-80">{new Date(res.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                    <span className="text-xl leading-none">{new Date(res.date).getDate()}</span>
                  </div>
                  <div>
                    <div className="font-black text-xl tracking-tight text-gray-900">
                      {res.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] font-bold mt-1">
                      <span className="flex items-center gap-1">👥 {res.partySize} Guests</span>
                      <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                      <span className="text-gray-900">{res.userId?.name || 'Customer'}</span>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {res.seatingPreference} Seating
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                  res.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  res.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                  'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {res.status}
                </span>
              </div>
              
              {res.status === 'Pending' && (
                <div className="flex gap-3 mt-2 pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => handleStatusUpdate(res._id, 'Confirmed')}
                    className="btn-primary py-3 px-6 flex-1 text-xs"
                  >
                    Confirm Table
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(res._id, 'Cancelled')}
                    className="btn-secondary py-3 px-6 flex-1 text-xs"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationList;
