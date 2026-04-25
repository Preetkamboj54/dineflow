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
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, role } = useAuth();
  
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'restaurant') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { isLoggedIn, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRootElement = () => {
    if (!isLoggedIn) return <Restaurants />;
    if (role === 'restaurant') return <Navigate to="/dashboard" replace />;
    return <Restaurants />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/70 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 py-4">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center px-6">
          <Link
            to={role === 'restaurant' ? '/dashboard' : '/'}
            className="text-2xl font-extrabold text-[var(--primary)] no-underline font-['Outfit'] tracking-tight"
          >
            DineFlow
          </Link>
          <nav className="flex gap-8 items-center">
            {isLoggedIn ? (
              <>
                {(role === 'customer' || role === 'admin') && (
                  <>
                    <Link
                      to="/order-history"
                      className="no-underline text-[var(--text-muted)] font-medium transition-all duration-200 text-[0.95rem] hover:text-[var(--primary)]"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/my-reservations"
                      className="no-underline text-[var(--text-muted)] font-medium transition-all duration-200 text-[0.95rem] hover:text-[var(--primary)]"
                    >
                      Reservations
                    </Link>
                    <Link
                      to="/profile"
                      className="no-underline text-[var(--text-muted)] font-medium transition-all duration-200 text-[0.95rem] hover:text-[var(--primary)]"
                    >
                      Profile
                    </Link>
                  </>
                )}
                {role === 'restaurant' && (
                  <Link
                    to="/dashboard"
                    className="no-underline text-[var(--text-muted)] font-medium transition-all duration-200 text-[0.95rem] hover:text-[var(--primary)]"
                  >
                    Merchant Dashboard
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/admin-dashboard"
                    className="no-underline text-[var(--text-muted)] font-medium transition-all duration-200 text-[0.95rem] hover:text-[var(--primary)]"
                  >
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="no-underline text-[var(--text-muted)] font-medium transition-all duration-200 text-[0.95rem] hover:text-[var(--primary)]"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary" style={{ color: 'white' }}>Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={getRootElement()} />
          <Route path="/login" element={isLoggedIn ? <Navigate to={role === 'restaurant' ? '/dashboard' : '/'} replace /> : <Login />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/" replace /> : <Register />} />

          <Route path="/restaurant/:id" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}><RestaurantMenu /></ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}><Cart /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}><Checkout /></ProtectedRoute>
          } />
          <Route path="/order-history" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}><OrderHistory /></ProtectedRoute>
          } />
          <Route path="/my-reservations" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}><MyReservations /></ProtectedRoute>
          } />
          <Route path="/reservation/:id" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}><Reservation /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}><Profile /></ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['restaurant']}><RestaurantDashboard /></ProtectedRoute>
          } />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
