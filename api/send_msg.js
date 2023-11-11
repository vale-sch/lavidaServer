import supabase from "../utils/supabase";
import { Message } from "./message";

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
      let msg = new Message(
        req.body.chatID,
        req.body.senderID,
        req.body.message
      );

      // Get the current chat entry
      const { data: existingChat, error: existingChatError } = await supabase
        .from("chat_history")
        .select()
        .eq("chat_id", msg.chatID);

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
          .insert([
            {
              chatID: msg.chatID,
              messages: [
                {
                  senderID: msg.senderID,
                  message: msg.message,
                  timeSent: new Date(),
                },
              ],
            },
          ]);

        if (newChatError) {
          console.error("Error creating new chat:", newChatError);
          res
            .status(500)
            .json({ error: "An error occurred while creating the new chat" });
        } else {
          res.status(201).json(msg.chatID);
        }
      } else {
        // If the chat exists, update the messages array
        const updatedMessages = [
          ...existingChat[0].messages,
          { sender_id: senderID, message_text: message, timeSent: new Date() },
        ];

        const { data: updatedChat, error: updateChatError } = await supabase
          .from("chat_history")
          .update({ messages: updatedMessages })
          .eq("chat_id", chatID);

        if (updateChatError) {
          console.error("Error updating chat messages:", updateChatError);
          res.status(500).json({
            error: "An error occurred while updating the chat messages",
          });
        } else {
          res.status(201).json(updatedChat);
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
