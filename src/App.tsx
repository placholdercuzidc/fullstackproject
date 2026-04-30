import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RestaurantPage from './pages/RestaurantPage';
import RatingPage from './pages/RatingPage';

function App() {
  return (
    <Router>
      <nav style={{
        padding: '20px',
        display: 'flex',
        background: 'grey',
        gap: '20px',
      }}>
        <Link to="/" style={{ fontWeight: 'bold', color: 'blue' }}>
          Home
        </Link>
        <Link to="/ratings" style={{ fontWeight: 'bold', color: 'blue' }}>
          Ratings
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<RestaurantPage />} />
        <Route path="/ratings" element={<RatingPage />} />
      </Routes>
    </Router>
  );
}

export default App;