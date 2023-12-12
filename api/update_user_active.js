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
    const { name, isActive } = req.body;
    console.log(req.body);
    if (!name || isActive === undefined) {
      return res.status(400).json({ error: "Name and isActive are required" });
    }

    try {
      const result = await pool.query(
        "UPDATE users SET isActive = $1 WHERE name = $2",
        [isActive, name]
      );
      if (result.rowCount > 0) {
        res
          .status(200)
          .json({ message: `User's isActive updated successfully` });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error executing the query:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
