import supabase from "../utils/supabase";

// Assuming you have a route or endpoint to handle fetching messages by chat ID
module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    // Set the necessary CORS headers to allow requests from the specific origin without a trailing slash
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(204).end(); // Respond with a 204 No Content status for preflight
  } else if (req.method === "GET") {
    try {
      const { chatID } = req.query.chatID; // Assuming chatID is passed as a query parameter
      console.log(chatID);

      // Fetch all messages for the specified chat ID
      const { data, error } = await supabase
        .from("chat_history")
        .select("messages")
        .eq("chat_id", chatID);

      console.log(data);
      if (error) {
        console.error("Error executing the query:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching messages" });
      } else {
        // Return the array of messages
        res.status(200).json(data);
      }
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
