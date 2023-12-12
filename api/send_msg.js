// send_msg.js
import supabase from "../utils/supabase";
import ChatHistory from "../utils/chat_history.js";

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    // Set CORS headers for preflight requests
    res.setHeader(
      "Access-Control-Allow-Origin",
      "http://127.0.0.1:5500",
      "https://vale-sch.github.io"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(204).end();
  } else if (req.method === "POST") {
    try {
      const chatHistory = new ChatHistory(
        req.body.chat_id,
        req.body.messages || []
      );
      // Update the messages array
      const { data: updatedChat, error: updateChatError } = await supabase
        .from("chat_history")
        .update({ messages: [...chatHistory.messages] })
        .eq("chat_id", chatHistory.chat_id);

      // Handle errors updating chat messages
      if (updateChatError) {
        res.status(500).json({
          error: "An error occurred while updating the chat messages",
        });
      } else {
        res.status(201).json(updatedChat);
      }
    } catch (error) {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
