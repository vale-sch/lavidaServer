import supabase from "../utils/supabase";

// Assuming you have a route or endpoint to handle fetching messages by chat ID
module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { chatID } = req.query; // Assuming chatID is passed as a query parameter

      // Fetch all messages for the specified chat ID
      const { data, error } = await supabase
        .from("chat_history")
        .select("messages")
        .eq("chat_id", chatID);

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
