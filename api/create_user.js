// api/createUser.js
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
    const { id, name, password, isActive, profileImgURL, chats } = req.body; // Include profileImgURL

    if (!id || !name || !password) {
      return res
        .status(400)
        .json({ error: "ID, name, and password are required" });
    }

    try {
      // Convert the chats array to a JSON string
      const chatsString = chats.length > 0 ? JSON.stringify(chats) : "{}";
      console.log(profileImgURL);
      const result = await pool.query(
        "INSERT INTO users (id, name, password, isactive, profileimageurl , chats) VALUES ($1, $2, $3, $4, $5, $6)",
        [id, name, password, isActive, profileImgURL, chatsString]
      );

      res.status(201).json({ message: result });
    } catch (error) {
      console.error("Error executing the query:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
