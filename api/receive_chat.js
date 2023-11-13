import supabase from "../utils/supabase";
import { ChatHistory } from "../utils/chat_history.js";

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    // Set CORS headers for preflight requests
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(204).end();
  } else if (req.method === "GET") {
    try {
      const { chatID } = req.query; // Assuming chatID is passed as a query parameter

      // Use the ChatHistory class to fetch messages for the specified chat ID
      const chatHistory = new ChatHistory(chatID, []);
      const messages = await chatHistory.getMessages();

      // Return the array of messages
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
