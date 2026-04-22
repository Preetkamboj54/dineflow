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
            <div key={res._id} className="card bg-white p-4 rounded-xl border hover:shadow-md transition flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="bg-primary/5 text-primary w-12 h-12 rounded-xl flex items-center justify-center font-bold">
                    {res.time.split(':')[0]}
                  </div>
                  <div>
                    <div className="font-bold text-lg">
                      {new Date(res.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {res.time}
                    </div>
                    <div className="text-sm text-muted font-medium">
                      {res.partySize} People • {res.userId?.name || 'Customer'} • {res.seatingPreference} Seating
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                  res.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  res.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {res.status}
                </span>
              </div>
              
              {res.status === 'Pending' && (
                <div className="flex gap-2 mt-2 pt-4 border-t">
                  <button 
                    onClick={() => handleStatusUpdate(res._id, 'Confirmed')}
                    className="btn-primary text-xs py-2 px-4 flex-1"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(res._id, 'Cancelled')}
                    className="btn-secondary text-xs py-2 px-4 flex-1"
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
