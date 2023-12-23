// api/updateParticipants.js
const { Pool } = require("pg");
import Chat from "../utils/chat.js";

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
    const { chat, userID } = req.body; // Retrieve chat and userID
    if (!chat?.id || !chat?.participants || !userID) {
      return res
        .status(400)
        .json({ error: "ID, participants, and userID are required" });
    }

    try {
      let result = await pool.query(
        "UPDATE users SET Chats = jsonb_set(Chats, $1, $2, $3, $4) WHERE Id = $5",
        [
          `{${chat.id}}`,
          JSON.stringify(chat.participants),
          userID,
          chat.isRequested,
          chat.isAccepted,
        ]
      );
      console.log(chat); // Log the rowCount

      if (result.rowCount > 0) {
        res.status(200).json({ message: "Participants updated successfully" });
      } else {
        res.status(404).json({ error: "No user found for the given ID" });
      }
    } catch (error) {
      console.log(chat); // Log the rowCount

      console.error("Error executing the query:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the participants" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
