import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';

const OrderKanban = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Fetch initial orders
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders/restaurant');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    // Setup Socket.io connection
    const token = localStorage.getItem('token');
    const socket = io('http://localhost:5000', {
      auth: { token }
    });

    socket.on('new_order', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);

      // Trigger browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Order Received!', {
          body: `Order for ${newOrder.userId?.name || 'Customer'} - $${newOrder.totalAmount}`,
          icon: '/favicon.ico'
        });
      }
    });

    socket.on('order_status_update', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => {
      socket.disconnect();
    };
  }, [restaurantId]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update order status');
    }
  };

  const columns = ['Pending', 'Preparing', 'Ready', 'Completed'];

  if (loading) return <div className="text-gray-500">Loading order queue...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
      {columns.map(status => (
        <div key={status} className="bg-gray-100 rounded-lg p-3 min-w-[250px] flex flex-col max-h-[80vh]">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-semibold text-gray-700">{status}</h3>
            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
              {orders.filter(o => o.status === status).length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {orders.filter(o => o.status === status).map(order => (
              <div key={order._id} className="bg-white p-3 rounded shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm truncate">#{order._id.substring(order._id.length - 6)}</span>
                  <span className="font-bold text-green-600">₹{order.totalAmount}</span>
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <p className="font-bold text-gray-900">{order.userId?.name}</p>
                  <p className="text-[10px] text-primary font-medium">{order.userId?.phoneNumber}</p>
                  <p className="text-[10px] opacity-60 italic">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>

                {order.deliveryAddress && (
                  <div className="text-[10px] bg-indigo-50 text-indigo-700 p-2 rounded-lg mb-2 border border-indigo-100">
                    <p className="font-bold flex items-center gap-1">
                      {order.deliveryAddress.label}
                    </p>
                    <p className="truncate">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    </p>
                  </div>
                )}

                <div className="text-xs space-y-1 mb-3 bg-gray-50 p-2 rounded">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="truncate pr-2">{item.quantity}x {item.menuItemId?.name}</span>
                    </div>
                  ))}
                </div>

                {status !== 'Completed' && (
                  <div className="flex space-x-2 mt-2">
                    {status === 'Pending' && (
                      <button onClick={() => updateStatus(order._id, 'Preparing')} className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700">Accept</button>
                    )}
                    {status === 'Preparing' && (
                      <button onClick={() => updateStatus(order._id, 'Ready')} className="flex-1 bg-yellow-500 text-white text-xs py-1.5 rounded hover:bg-yellow-600">Mark Ready</button>
                    )}
                    {status === 'Ready' && (
                      <button onClick={() => updateStatus(order._id, 'Completed')} className="flex-1 bg-green-600 text-white text-xs py-1.5 rounded hover:bg-green-700">Complete</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderKanban;
