import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart is Empty</h2>
        <p>Add some delicious food to your cart!</p>
        <Link to="/" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.menuItemId} className="cart-item">
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>${item.price} each</p>
            </div>
            <div className="item-controls">
              <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}>+</button>
              <button onClick={() => removeFromCart(item.menuItemId)} className="btn-danger">Remove</button>
            </div>
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ${cartTotal.toFixed(2)}</h3>
        <button onClick={() => navigate('/checkout')} className="btn-primary">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
