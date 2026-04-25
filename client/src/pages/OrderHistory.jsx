import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import ReviewModal from '../components/ReviewModal';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch order history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const fetchOrderDetails = async (id) => {
    try {
      const response = await api.get(`/api/orders/${id}`);
      setSelectedOrder(response.data);
    } catch (error) {
      alert('Failed to fetch order details');
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto my-8 px-6 p-8 text-center">Loading your history...</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 px-6">
      <header className="mb-8">
        <h2 className="text-4xl font-extrabold mb-2">Order History</h2>
        <p className="text-[var(--text-muted)]">Track and reorder your favorite meals</p>
      </header>

      <div className="flex flex-col gap-4">
        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[var(--text-muted)] text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="card flex justify-between items-center cursor-pointer" onClick={() => fetchOrderDetails(order._id)}>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-[var(--primary)] mb-1">{order.restaurantId?.name || 'Restaurant'}</h3>
                <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest">#{order._id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xl font-bold">₹{order.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-[var(--text-muted)]">Total Paid</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-[var(--primary)]'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedOrder && !showReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
            
            <header className="border-b pb-4 mb-6">
              <h3 className="text-2xl font-bold mb-1">{selectedOrder.restaurantId?.name}</h3>
              <p className="text-sm text-[var(--text-muted)]">Ordered on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </header>

            <div className="space-y-4 mb-8">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex gap-3">
                    <span className="font-bold text-[var(--primary)]">{item.quantity}x</span>
                    <span>{item.menuItemId?.name}</span>
                  </div>
                  <span className="font-medium">₹{(item.priceAtTimeOfOrder * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-2 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Payment Method</span>
                <span className="font-medium capitalize">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-[var(--primary)]">₹{selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="btn-secondary flex-1"
              >
                Close
              </button>
              {selectedOrder.status === 'Completed' && (
                <button 
                  onClick={() => setShowReview(true)} 
                  className="btn-primary flex-1"
                >
                  Rate Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showReview && selectedOrder && (
        <ReviewModal 
          order={selectedOrder} 
          onClose={() => {
            setShowReview(false);
            setSelectedOrder(null);
          }} 
        />
      )}
    </div>
  );
};

export default OrderHistory;
