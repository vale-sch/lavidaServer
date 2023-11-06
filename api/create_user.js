// api/createUser.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

export default async (req, res) => {
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
