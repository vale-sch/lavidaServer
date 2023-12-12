// delete_chat.js
import supabase from "../utils/supabase";

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    // Set CORS headers for preflight requests
    res.setHeader(
      "Access-Control-Allow-Origin",
      "http://127.0.0.1:5500,https://vale-sch.github.io"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(204).end();
  } else if (req.method === "GET") {
    try {
      const { chatID } = req.query; // Assuming chatID is passed as a query parameter

      // Delete the chat based on the chat ID
      const { error } = await supabase
        .from("chat_history")
        .delete()
        .eq("chat_id", chatID);

      if (error) {
        console.error("Error deleting the chat:", error);
        res
          .status(500)
          .json({ error: "An error occurred while deleting the chat" });
      } else {
        res.status(200).json({ success: true });
      }
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
