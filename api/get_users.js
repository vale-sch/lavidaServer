// api/getAllUsers.js
import { Pool } from ('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM users');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'An error occurred while fetching users' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
