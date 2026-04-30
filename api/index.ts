import dotenv from 'dotenv';
dotenv.config();
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';


const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    ca: process.env.DB_CA || fs.readFileSync(path.resolve(process.cwd(), 'ca.pem')),
    rejectUnauthorized: false,
  },
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

app.get('/api/restaurants', async (_req: Request, res: Response) => {
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


export default app;