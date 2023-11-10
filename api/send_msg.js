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
    // Change method to POST for inserting data
    try {
      // Assuming your Message class constructor takes chatID, senderID, and message as parameters
      let newMsg = new Message(
        req.body.chatID,
        req.body.senderID,
        req.body.message
      );

      const { data, error } = await supabase.from("chat_history").insert([
        {
          chat_id: newMsg.chatID,
          sender_id: newMsg.senderID,
          message_text: newMsg.message,
          sent_at: new Date(),
        },
      ]);

      if (error && error.code === "23505") {
        // If there's a duplicate key error, it means the chat_id already exists,
        // so we should just insert the message into the existing chat.
        const { data: newData, error: newError } = await supabase
          .from("chat_history")
          .insert([
            {
              chat_id: newMsg.chatID,
              sender_id: newMsg.senderID,
              message_text: newMsg.message,
              sent_at: new Date(),
            },
          ]);

        if (newError) {
          console.error("Error inserting message:", newError);
          res
            .status(500)
            .json({ error: "An error occurred while inserting the message" });
        } else {
          res.status(201).json(newData);
        }
      } else if (error) {
        console.error("Error executing the query:", error);
        res
          .status(500)
          .json({ error: "An error occurred while inserting the message" });
      } else {
        res.status(201).json(data);
      }
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
