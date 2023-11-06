import { Pool } from ('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id',
        [name, password]
      );
      res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
      console.error('Error executing the query:', error);
      res.status(500).json({ error: 'An error occurred while creating the user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
