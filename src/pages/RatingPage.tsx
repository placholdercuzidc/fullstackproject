import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Review {
  id: number;
  rating: number;
  comment: string;
  restaurantName: string;
  location: string;
}

const RatingPage = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!name.trim()) return alert("Please enter a restaurant name to search.");

    setLoading(true);
    try {
      const response = await axios.get<Review[]>(`${API_URL}/reviews`, {
        params: { name, location }
      });
      setReviews(response.data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return b.id - a.id;
  });

  const totalRatingScore = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avg = reviews.length > 0 ? totalRatingScore / reviews.length : 0;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#333' }}>Search Restaurant Ratings</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <input
          placeholder="Restaurant Name (e.g. McDonalds)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Location (Optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleSearch} style={buttonStyle}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {reviews.length > 0 ? (
        <div>
          <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '12px', textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#1976d2' }}>
               {name} Score: {Number(avg).toFixed(1)} / 5.0
            </h2>
            <p style={{ color: '#555' }}>Based on {reviews.length} total reviews</p>
          </div>

          <div style={{ marginBottom: '15px', textAlign: 'right' }}>
            <label style={{ fontWeight: 'bold' }}>Sort reviews: </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '5px', borderRadius: '4px' }}>
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {/* Review List */}
          <ul style={{ padding: 0 }}>
            {sortedReviews.map((r) => (
              <li key={r.id} style={reviewCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={ratingBadgeStyle}>★ {r.rating}</span>
                  <small style={{ color: '#999' }}>Review #{r.id}</small>
                </div>
                <p style={{ marginTop: '10px', lineHeight: '1.5', color: '#444' }}>"{r.comment}"</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && name && <p style={{ textAlign: 'center', color: '#999' }}>No reviews found for this restaurant yet.</p>
      )}
    </div>
  );
};


const inputStyle = {
  flex: 1,
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem'
};

const buttonStyle = {
  padding: '0 25px',
  background: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const reviewCardStyle = {
  listStyle: 'none',
  padding: '20px',
  background: '#fff',
  border: '1px solid #eee',
  borderRadius: '10px',
  marginBottom: '15px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const ratingBadgeStyle = {
  background: '#fef08a',
  color: '#854d0e',
  padding: '4px 12px',
  borderRadius: '20px',
  fontWeight: 'bold',
  fontSize: '0.9rem'
};

export default RatingPage;