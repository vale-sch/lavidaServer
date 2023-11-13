// create_chat.js
import supabase from "../utils/supabase";
import { ChatHistory } from "../utils/chat_history.js";

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
      console.log("hi kevin", req.body);

      const chatHistory = ChatHistory.fromDatabase(req.body);
      // Fetch existing chat entry
      const { data: existingChat, error: existingChatError } = await supabase
        .from("chat_history")
        .select()
        .eq("chat_id", chatHistory.chat_id);

      // Handle errors fetching existing chat
      if (existingChatError) {
        res.status(500).json({
          error: "An error occurred while fetching the existing chat",
        });
        return;
      }

      // If the chat doesn't exist, create a new one
      if (existingChat.length === 0) {
        const { data: newChat, error: newChatError } = await supabase
          .from("chat_history")
          .insert([chatHistory.toDatabase()]);

        // Handle errors creating new chat
        if (newChatError) {
          res.status(500).json({
            error: "An error occurred while creating the new chat",
          });
        } else {
          res.status(201).json(chatHistory);
        }
      } else {
        res.status(200).json(existingChat[0]);
      }
    } catch (error) {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
