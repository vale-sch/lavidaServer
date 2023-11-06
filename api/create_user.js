// api/createUser.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

export default async (req, res) => {
   // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'POST') {
    const { id, name, password } = req.body;

    if (!id || !name || !password) {
      return res.status(400).json({ error: 'ID, name, and password are required' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO users (id, name, password) VALUES ($1, $2, $3)',
        [id, name, password]
      );
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'An error occurred while creating the user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
