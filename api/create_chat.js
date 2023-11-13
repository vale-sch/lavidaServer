// create_chat.js
import supabase from "../utils/supabase";

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    const allowedOrigins = ["http://127.0.0.1:5500"];

    // Set CORS headers for preflight requests
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins.join(","));
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(204).end();
  } else if (req.method === "POST") {
    try {
      const { chat_id, messages = [] } = req.body;

      // Create new chat
      const { data, error } = await supabase
        .from("chat_history")
        .insert([{ chat_id, messages }]);

      if (error) {
        throw error;
      }

      res.status(201).json(data[0]);
    } catch (error) {
      console.error("Error processing the request:", error, req.body);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
