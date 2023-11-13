import supabase from "../utils/supabase";
import { ChatHistory } from "../utils/chat_history.js";

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    // Set the necessary CORS headers to allow requests from the specific origin without a trailing slash
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(204).end(); // Respond with a 204 No Content status for preflight
  } else if (req.method === "POST") {
    try {
      let chatHistory = new ChatHistory(
        req.body.chatID,
        req.body.messages || []
      );

      // Get the current chat entry
      const { data: existingChat, error: existingChatError } = await supabase
        .from("chat_history")
        .select()
        .eq("chat_id", chatHistory.chat_id);

      if (existingChatError) {
        console.error("Error fetching existing chat:", existingChatError);
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

        if (newChatError) {
          console.error("Error creating new chat:", newChatError);
          res
            .status(500)
            .json({ error: "An error occurred while creating the new chat" });
        } else {
          res.status(201).json(chatHistory);
        }
      } else {
        // If the chat exists, update the messages array
        const updatedMessages = [
          ...existingChat[0].messages,
          ...chatHistory.messages,
        ];

        const { data: updatedChat, error: updateChatError } = await supabase
          .from("chat_history")
          .update({ messages: updatedMessages })
          .eq("chat_id", chatHistory.chat_id);

        if (updateChatError) {
          console.error("Error updating chat messages:", updateChatError);
          res.status(500).json({
            error: "An error occurred while updating the chat messages",
          });
        } else {
          res.status(201).json(chatHistory);
        }
      }
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
