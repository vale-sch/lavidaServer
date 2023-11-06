// api/createUser.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

export default async (req, res) => {
  if (req.method === 'OPTIONS') {
    // Set the necessary CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.status(204).end(); // Respond with a 204 No Content status for preflight
  } else if (req.method === 'POST') {// Ensure the server function only responds to POST requests
    const { id, name, password } = req.body;
    console.log(req.body);

    if (!id || !name || !password) {
      return res.status(400).json({ error: 'ID, name, and password are required' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO users (Id, Name, Password) VALUES ($1, $2, $3)',
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
