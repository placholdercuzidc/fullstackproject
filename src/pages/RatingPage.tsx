import React, { useState } from 'react';
import axios from 'axios';

const RatingPage = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'highest', 'lowest'

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/reviews`, {
        params: { name, location }
      });
      setReviews(response.data);
    } catch (err) {
      console.error(err);
    }
  };


  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return b.id - a.id;
  });

const totalRatingScore = reviews.reduce((sum, r) => sum + r.rating, 0);
const avg = reviews.length > 0 ? totalRatingScore / reviews.length : 0;
const totalReviews = reviews.length;

  return (
    <div style={{ padding: 20 }}>
      <h1>Search Ratings</h1>

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      {reviews.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '15px', background: '#f0f7ff', borderRadius: '8px' }}>
            <h2>Average rating {Number(avg).toFixed(1)} / 5.0</h2>
            <p>Based on {totalReviews} reviews</p>
          </div>

          <div style={{ margin: '20px 0' }}>
            <label>Sort by: </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          <ul>
            {sortedReviews.map((r) => (
              <li key={r.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <strong>{r.rating} / 5</strong>
                <p>{r.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RatingPage;