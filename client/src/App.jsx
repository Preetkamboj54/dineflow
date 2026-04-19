import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Restaurants from './pages/Restaurants';
import RestaurantMenu from './pages/RestaurantMenu';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>DineFlow</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
