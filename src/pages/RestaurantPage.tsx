import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Restaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string;
}

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('');

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const LIST_URL = 'http://localhost:3001/api/restaurants';
  const SUBMIT_URL = 'http://localhost:3001/api/reviews';

  const fetchRestaurants = async (): Promise<void> => {
    try {
      const response = await axios.get<Restaurant[]>(LIST_URL);
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const addEntry = async (): Promise<void> => {
    try {
      const newReviewEntry = {
        restaurantName: name,
        location,
        cuisine,
        rating,
        comment
      };

      await axios.post(SUBMIT_URL, newReviewEntry);

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

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Restaurant & Reviews App</h1>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h2>Add a Restaurant & Review</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
          <input
            placeholder="Restaurant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            placeholder="Cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
          <label>
            Rating (1-5):
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              style={{ marginLeft: '10px', width: '50px' }}
            />
          </label>
          <textarea
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ height: '80px' }}
          />
          <button onClick={addEntry} style={{ padding: '10px', cursor: 'pointer' }}>
            Submit Review
          </button>
        </div>
      </div>

      <hr style={{ margin: '30px 0' }} />

      <h2>Reviewed Restaurants</h2>
      <ul>
        {restaurants.map((r) => (
          <li key={r.id} style={{ marginBottom: '10px' }}>
            **{r.name}** — {r.location} <small>({r.cuisine})</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;