import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Checkout = () => {
  const { cartItems, cartTotal, restaurantId, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/api/users/profile');
      setAddresses(res.data.addresses || []);
      const defaultAddr = res.data.addresses?.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
      else if (res.data.addresses?.length > 0) setSelectedAddress(res.data.addresses[0]);
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    }
  };

  const handleNewAddressChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewAddress({ ...newAddress, [e.target.name]: value });
  };

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/users/addresses', newAddress);
      const updatedAddresses = res.data;
      setAddresses(updatedAddresses);
      const added = updatedAddresses[updatedAddresses.length - 1];
      setSelectedAddress(added);
      setShowNewAddressForm(false);
      setNewAddress({ label: 'Home', street: '', city: '', state: '', zipCode: '', isDefault: false });
    } catch (err) {
      alert('Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery address');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        restaurantId: restaurantId, 
        items: cartItems.map(item => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
        paymentMethod: paymentMethod,
        deliveryAddress: {
          label: selectedAddress.label,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode
        }
      };

      await api.post('/api/orders', orderData);
      alert('Order placed successfully!');
      clearCart();
      navigate('/order-history');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-black mb-4">Your cart is empty</h2>
        <p className="text-[var(--text-muted)] mb-8">Please add items to your cart before checking out.</p>
        <button onClick={() => navigate('/')} className="btn-primary px-8 py-3">Go to Restaurants</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-8 tracking-tighter">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Delivery & Payment */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Delivery Address Section */}
          <section className="card glass p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black tracking-tight">Delivery Address</h2>
              <button 
                onClick={() => setShowNewAddressForm(true)}
              className="text-[var(--primary)] font-bold text-sm hover:underline"
              >
                + Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div 
                  key={addr._id} 
                  onClick={() => setSelectedAddress(addr)}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedAddress?._id === addr._id 
                    ? 'border-primary bg-primary/[0.03] shadow-[0_0_20px_rgba(79,70,229,0.1)] scale-[1.02]' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-black tracking-tight ${selectedAddress?._id === addr._id ? 'text-primary' : 'text-gray-900'}`}>
                        {addr.label}
                      </span>
                      {selectedAddress?._id === addr._id && (
                        <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    {selectedAddress?._id === addr._id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${selectedAddress?._id === addr._id ? 'text-gray-700' : 'text-gray-500'}`}>
                    {addr.street}<br />
                    {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border border-dashed">
                  <p className="text-[var(--text-muted)] text-sm">No saved addresses. Please add one to continue.</p>
                </div>
              )}
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="card glass p-8">
            <h2 className="text-2xl font-black tracking-tight mb-6">Payment Method</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-100'}`}>
                <input 
                  type="radio" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary"
                />
                <div>
                  <p className="font-bold">Cash on Delivery</p>
                  <p className="text-xs text-[var(--text-muted)]">Pay when your food arrives</p>
                </div>
              </label>
              <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'Pay at Restaurant' ? 'border-primary bg-primary/5' : 'border-gray-100'}`}>
                <input 
                  type="radio" 
                  value="Pay at Restaurant" 
                  checked={paymentMethod === 'Pay at Restaurant'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary"
                />
                <div>
                  <p className="font-bold">Pay at Restaurant</p>
                  <p className="text-xs text-[var(--text-muted)]">Pickup your order and pay in person</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="card glass p-8 sticky top-24">
            <h2 className="text-2xl font-black tracking-tight mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              {cartItems.map(item => (
                <div key={item.menuItemId} className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">{item.name} <span className="font-bold text-[var(--text-main)]">x{item.quantity}</span></span>
                  <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t space-y-2 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Delivery Fee</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-4">
                <span>Total</span>
                <span className="text-[var(--primary)]">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder} 
              disabled={loading || !selectedAddress} 
              className="btn-primary w-full py-4 text-lg"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            {!selectedAddress && (
              <p className="text-[10px] text-center mt-3 text-[var(--danger)] font-bold uppercase tracking-widest">
                Please select a delivery address
              </p>
            )}
          </div>
        </div>
      </div>

      {/* New Address Modal */}
      {showNewAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="card bg-white w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-6 tracking-tight">Add Delivery Address</h2>
            <form onSubmit={handleNewAddressSubmit} className="space-y-4">
              <div className="form-group">
                <label>Label (e.g. Home, Office)</label>
                <input name="label" value={newAddress.label} onChange={handleNewAddressChange} required />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input name="street" value={newAddress.street} onChange={handleNewAddressChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={newAddress.city} onChange={handleNewAddressChange} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={newAddress.state} onChange={handleNewAddressChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input name="zipCode" value={newAddress.zipCode} onChange={handleNewAddressChange} required />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button type="submit" className="btn-primary flex-1 py-3">Save & Select</button>
                <button 
                  type="button" 
                  onClick={() => setShowNewAddressForm(false)} 
                  className="btn-secondary flex-1 py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
