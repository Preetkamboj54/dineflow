import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-[var(--text-muted)] mb-8">Add some delicious food to your cart!</p>
        <Link to="/" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 px-6">
      <h2 className="text-3xl font-bold mb-8">Your Shopping Cart</h2>
      <div className="card divide-y divide-[var(--border)] mb-6">
        {cartItems.map(item => (
          <div key={item.menuItemId} className="flex justify-between items-center py-4 gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate flex items-center gap-2">
                {item.dietaryPreference === 'Veg' && <span className="inline-flex items-center justify-center w-3.5 h-3.5 border-2 border-green-600 rounded-sm" title="Veg"><span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span></span>}
                {item.dietaryPreference === 'Non-Veg' && <span className="inline-flex items-center justify-center w-3.5 h-3.5 border-2 border-red-600 rounded-sm" title="Non-Veg"><span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span></span>}
                {item.dietaryPreference === 'Egg' && <span className="inline-flex items-center justify-center w-3.5 h-3.5 border-2 border-orange-500 rounded-sm" title="Egg"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span></span>}
                {item.name}
              </h3>
              <p className="text-[var(--text-muted)] text-sm">₹{item.price} each</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                className="btn-sm w-8 h-8 flex items-center justify-center text-lg"
              >-</button>
              <span className="font-bold w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                className="btn-sm w-8 h-8 flex items-center justify-center text-lg"
              >+</button>
              <button
                onClick={() => removeFromCart(item.menuItemId)}
                className="btn-sm btn-danger px-3"
              >Remove</button>
            </div>
            <div className="font-bold text-right min-w-[80px]">
              ₹{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="card flex justify-between items-center">
        <h3 className="text-xl font-bold">Total: ₹{cartTotal.toFixed(2)}</h3>
        <button onClick={() => navigate('/checkout')} className="btn-primary">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
