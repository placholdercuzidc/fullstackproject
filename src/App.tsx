import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import RestaurantPage from './pages/RestaurantPage';
import RatingPage from './pages/RatingPage';

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} style={{
      fontWeight: 'bold',
      color: 'white',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
      transition: 'background 0.3s',
      fontFamily: 'Voltaire'
    }}>
      {children}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#fcfcfc' }}>
        <nav style={{
          padding: '10px 40px',
          display: 'flex',
          alignItems: 'center',
          background: '#506778',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          gap: '20px',
        }}>
          <h2 style={{ color: 'white', marginRight: '20px', fontFamily: "'Rubik Mono One', sans-serif", fontSize: '1.2rem' }}>🍽️ ReviewIt</h2>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px'}}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/ratings">Search Ratings</NavLink>
          </div>
        </nav>


        <main style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          <Routes>
            <Route path="/" element={<RestaurantPage />} />
            <Route path="/ratings" element={<RatingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;