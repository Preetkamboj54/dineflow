import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('dineflow_cart');
    const savedRestaurantId = localStorage.getItem('dineflow_restaurant_id');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dineflow_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (restaurantId) {
      localStorage.setItem('dineflow_restaurant_id', restaurantId);
    }
  }, [restaurantId]);

  const addToCart = (menuItem, rid, quantity = 1) => {
    if (rid && rid !== restaurantId) {
      setCartItems([]);
      setRestaurantId(rid);
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.menuItemId === menuItem._id);
      if (existingItem) {
        return prevItems.map(item =>
          item.menuItemId === menuItem._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { menuItemId: menuItem._id, name: menuItem.name, price: menuItem.price, quantity, dietaryPreference: menuItem.dietaryPreference }];
    });
    
    if (rid) {
      setRestaurantId(rid);
    }
  };

  const removeFromCart = (menuItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, restaurantId, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
