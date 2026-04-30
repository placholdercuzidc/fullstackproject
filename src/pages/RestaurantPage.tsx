import { useEffect, useState } from 'react';
import axios from 'axios';

interface Restaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  avgRating?: number;
}

function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const [sortBy, setSortBy] = useState<string>('name');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const fetchRestaurants = async () => {
    
    const response = await axios.get(`${API_URL}/restaurants`);
    setRestaurants(response.data);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const addEntry = async (): Promise<void> => {
    if (!name || !location) return alert("Please provide a name and location.");

    try {
      const newReviewEntry = {
        restaurantName: name,
        location,
        cuisine,
        rating,
        comment
      };

      await axios.post(`${API_URL}/reviews`, newReviewEntry);

      setName('');
      setLocation('');
      setCuisine('');
      setRating(5);
      setComment('');

      fetchRestaurants();
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rating') return (b.avgRating || 0) - (a.avgRating || 0);
    if (sortBy === 'location') return a.location.localeCompare(b.location);
    return 0;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Add a Restaurant & Review</h2>

      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
          <input placeholder="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} style={inputStyle} />
          <input
            type="number" min="1" max="5" value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            style={{ ...inputStyle, width: '60px' }}
          />
          <textarea
            placeholder="Review comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ ...inputStyle, width: '100%', height: '60px' }}
          />
          <button onClick={addEntry} style={buttonStyle}>Submit</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Reviewed Restaurants</h3>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '5px' }}>
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
          <option value="location">Sort by Location</option>
        </select>
      </div>

      <ul style={{ padding: 0 }}>
        {sortedRestaurants.map((r) => (
          <li key={r.id} style={listItemStyle}>
            <div>
              <strong>{r.name}</strong> ({r.cuisine})<br />
              <small>{r.location}</small>
            </div>
            <div style={{ fontWeight: 'bold', color: '#f39c12' }}>
              ★ {r.avgRating ? Number(r.avgRating).toFixed(1) : 'N/A'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '15px',
  borderBottom: '1px solid #eee',
  listStyle: 'none'
};

export default RestaurantPage;