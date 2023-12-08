export default async (req, res) => {
  // Handle preflight OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    // Set the necessary CORS headers to allow requests from the specific origin without a trailing slash
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(204).end(); // Respond with a 204 No Content status for preflight
  } else if (req.method === "POST") {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    try {
      const result = await pool.query(
        "UPDATE users SET isActive = true WHERE name = $1 AND isActive = false",
        [name]
      );
      if (result.rowCount > 0) {
        res
          .status(200)
          .json({ message: "User's isActive updated successfully" });
      } else {
        res
          .status(404)
          .json({ error: "User not found or isActive already true" });
      }
    } catch (error) {
      console.error("Error executing the query:", error);
      res.status(500).json({
        error: "An error occurred while updating the user's isActive",
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
