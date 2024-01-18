// api/removeChat.js
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

    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(204).end(); // Respond with a 204 No Content status for preflight
  } else if (req.method === "POST") {
    const { chatId, userID } = req.body; // Retrieve chatId and userID
    if (!chatId || !userID) {
      return res.status(400).json({ error: "chatId and userID are required" });
    }

    try {
      let result = await pool.query(
        "UPDATE users SET Chats = Chats - $1 WHERE Id = $2",
        [chatId, userID]
      );

      if (result.rowCount > 0) {
        res.status(200).json({ message: "Chat removed successfully" });
      } else {
        res.status(404).json({ error: "No user found for the given ID" });
      }
    } catch (error) {
      console.error("Error executing the query:", error);
      res
        .status(500)
        .json({ error: "An error occurred while removing the chat" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
