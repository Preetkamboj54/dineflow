import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Restaurants from './pages/Restaurants';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Reservation from './pages/Reservation';
import RestaurantDashboard from './pages/RestaurantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MyReservations from './pages/MyReservations';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, currentRole, isLoggedIn }) => {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // Redirect to their respective dashboards if they hit a forbidden route
    if (currentRole === 'restaurant') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [token]);

  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const getRole = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) { return null; }
  };

  const role = getRole();

  // Root path handling
  const getRootElement = () => {
    if (!isLoggedIn) return <Restaurants />;
    if (role === 'restaurant') return <Navigate to="/dashboard" replace />;
    return <Restaurants />;
  };

  return (
    <div className="app-container">
      <header>
        <div className="nav-container">
          <Link to={role === 'restaurant' ? '/dashboard' : '/'} className="logo">
            DineFlow
          </Link>
          <nav className="nav-links">
            {isLoggedIn ? (
              <>
                {(role === 'customer' || role === 'admin') && (
                  <>
                    <Link to="/order-history">Orders</Link>
                    <Link to="/my-reservations">Reservations</Link>
                    <Link to="/profile">Profile</Link>
                  </>
                )}
                {role === 'restaurant' && <Link to="/dashboard">Merchant Dashboard</Link>}
                {role === 'admin' && <Link to="/admin-dashboard">Admin Panel</Link>}
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="btn-primary" style={{ color: 'white' }}>Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Routes>
          {/* Public / User Routes */}
          <Route path="/" element={getRootElement()} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/restaurant/:id" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']} currentRole={role} isLoggedIn={isLoggedIn}><RestaurantMenu /></ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']} currentRole={role} isLoggedIn={isLoggedIn}><Cart /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']} currentRole={role} isLoggedIn={isLoggedIn}><Checkout /></ProtectedRoute>
          } />
          <Route path="/order-history" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']} currentRole={role} isLoggedIn={isLoggedIn}><OrderHistory /></ProtectedRoute>
          } />
          <Route path="/my-reservations" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']} currentRole={role} isLoggedIn={isLoggedIn}><MyReservations /></ProtectedRoute>
          } />
          <Route path="/reservation/:id" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']} currentRole={role} isLoggedIn={isLoggedIn}><Reservation /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']} currentRole={role} isLoggedIn={isLoggedIn}><Profile /></ProtectedRoute>
          } />

          {/* Restaurant Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['restaurant']} currentRole={role} isLoggedIn={isLoggedIn}><RestaurantDashboard /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']} currentRole={role} isLoggedIn={isLoggedIn}><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
