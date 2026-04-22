import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Checkout = () => {
  const { cartItems, cartTotal, restaurantId, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Your cart is empty</h2>
        <p>Please add items to your cart before checking out.</p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        restaurantId: restaurantId, 
        items: cartItems.map(item => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
        paymentMethod: paymentMethod
      };

      const response = await api.post('/api/orders', orderData);

      alert('Order placed successfully!');
      clearCart();
      navigate('/order-history');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.menuItemId} className="summary-item">
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-total">
          <strong>Total: ${cartTotal.toFixed(2)}</strong>
        </div>
      </div>

      <div className="payment-section">
        <h3>Payment Method</h3>
        <label>
          <input 
            type="radio" 
            value="COD" 
            checked={paymentMethod === 'COD'} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
          />
          Cash on Delivery
        </label>
        <label>
          <input 
            type="radio" 
            value="Pay at Restaurant" 
            checked={paymentMethod === 'Pay at Restaurant'} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
          />
          Pay at Restaurant
        </label>
      </div>

      <button 
        onClick={handlePlaceOrder} 
        disabled={loading} 
        className="btn-primary"
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout;
