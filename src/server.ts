import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '***',
  database: 'restaurant_db'
});

app.post('/api/reviews', async (req: Request, res: Response) => {
  const { restaurantName, location, cuisine, rating, comment } = req.body;

  try {
    const [result]: any = await pool.query(
      'INSERT INTO reviews (restaurantName, location, cuisine, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [restaurantName, location, cuisine, rating, comment]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Review and restaurant data saved successfully!"
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save the review." });
  }
});

app.get('/api/reviews', async (req: Request, res: Response) => {
  const { name, location } = req.query;

  try {
    const query = `
      SELECT *,
        (SELECT AVG(rating) FROM reviews WHERE restaurantName = ? AND location = ?) as averageScore,
        (SELECT COUNT(*) FROM reviews WHERE restaurantName = ? AND location = ?) as totalReviews
      FROM reviews
      WHERE restaurantName = ? AND location = ?
    `;

    const [rows] = await pool.query(query, [name, location, name, location, name, location]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get('/api/restaurants', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        MIN(id) as id,
        restaurantName as name,
        location,
        cuisine
      FROM reviews
      GROUP BY restaurantName, location, cuisine
    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});


app.listen(3001, () => console.log('Backend running on http://localhost:3001'));