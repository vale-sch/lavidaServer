// send_msg.js
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

      // Fetch existing chat
      const { data: existingChat, error: existingChatError } = await supabase
        .from("chat_history")
        .select()
        .eq("chat_id", chat_id);

      if (existingChatError) {
        throw existingChatError;
      }

      // Update chat
      const updatedChat =
        existingChat.length === 0
          ? await supabase.from("chat_history").insert([{ chat_id, messages }])
          : await supabase
              .from("chat_history")
              .update({ messages: [...existingChat[0].messages, ...messages] })
              .eq("chat_id", chat_id);

      res.status(201).json(updatedChat);
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
