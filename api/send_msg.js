// send_msg.js
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
  } else if (req.method === "POST") {
    const msg = new ChatHistory(req.body.chat_id, req.body.messages || []);

    try {
      const msg = new ChatHistory(req.body.chat_id, req.body.messages || []);

      // Fetch existing chat entry
      const { data: existingChat, error: existingChatError } = await supabase
        .from("chat_history")
        .select()
        .eq("chat_id", msg.chat_id);

      // Handle errors fetching existing chat
      if (existingChatError) {
        res.status(500).json({
          error: "An error occurred while fetching the existing chat",
        });
        return;
      }

      // If the chat exists, update the messages array
      const updatedMessages = [...existingChat[0]?.messages, ...msg.messages];

      const { data: updatedChat, error: updateChatError } = await supabase
        .from("chat_history")
        .update({ messages: updatedMessages })
        .eq("chat_id", msg.chat_id);

      // Handle errors updating chat messages
      if (updateChatError) {
        res.status(500).json({
          error: "An error occurred while updating the chat messages",
          msg,
        });
      } else {
        res.status(201).json(msg);
      }
    } catch (error) {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
