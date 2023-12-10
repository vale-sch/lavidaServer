// api/updateParticipants.js
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
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(204).end(); // Respond with a 204 No Content status for preflight
  } else if (req.method === "POST") {
    const { chat: chats } = req.body;

    if (!chats?.id || !chats?.participants) {
      return res
        .status(400)
        .json({ error: "ID and participants are required" });
    }

    try {
      const result = await pool.query(
        "UPDATE users SET chat_data = jsonb_set(chat_data, $1, $2) WHERE id = $3",
        [`{${chats.id}}`, JSON.stringify(chats.participants), chats.id]
      );
      res.status(200).json({ message: "Participants updated successfully" });
    } catch (error) {
      console.error("Error executing the query:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the participants" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
