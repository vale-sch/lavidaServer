// create_chat.js
import supabase from "../utils/supabase";
import ChatHistory from "../utils/chat_history.js";

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    // Set CORS headers for preflight
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(204).end();
  } else if (req.method === "POST") {
    try {
      const newChat = ChatHistory.fromClient(req.body);

      // Create a new chat, assuming it doesn't exist
      const { data: test, error: newChatError } = await supabase
        .from("chat_history")
        .insert([newChat.toDatabase()]);
      console.log(newChat);
      // Handle errors creating new chat
      if (newChatError) {
        // Check if the error is due to the chat already existing
        if (newChatError.code === "23505") {
          res.status(409).json({
            error: "Chat with the specified ID already exists",
          });
        } else {
          res.status(500).json({
            error: "An error occurred while creating the new chat",
          });
        }
      } else {
        res.status(201).json(newChat);
      }
    } catch (error) {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
