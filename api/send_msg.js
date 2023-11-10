import supabase from "../utils/supabase";

module.exports = async (req, res) => {
  if (req.method === "POST") {
    // Change method to POST for inserting data
    try {
      const { chat_id, sender_id, message_text } = req.body; // Assuming you send these values in the request body

      const { data, error } = await supabase
        .from("chat_history")
        .insert([{ chat_id, sender_id, message_text, sent_at: new Date() }]);

      if (error) {
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
