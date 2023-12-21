const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async (req, res) => {
  // Handle preflight OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    // Set the necessary CORS headers to allow requests from the specific origin without a trailing slash
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(204).end(); // Respond with a 204 No Content status for preflight
  } else if (req.method === "POST") {
    const { id: id } = req.query; // Assuming the query parameter is 'name'

    if (!id) {
      return res.status(400).json({ error: "Name parameter is required" });
    }
    console.log(id, req.query);
    try {
      const result = await pool.query("SELECT * FROM users WHERE Id = $1", [
        id,
      ]);

      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]); // Sending the first matching user found
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error executing the query:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving the user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
