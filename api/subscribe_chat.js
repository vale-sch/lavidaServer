import websocket from "../utils/websocket";
import supabase from "../utils/supabase";

export default async (req, res) => {
  // Set CORS headers for preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end(); // Respond with a 204 No Content status for preflight
    return;
  } else if (req.method === "GET") {
    try {
      // Get the chatID from the query parameters
      const { chatID } = req.query;

      // Handle WebSocket events
      websocket.addEventListener("open", () => {
        // Subscribe to the chat changes for the specified chatID
        const subscription = supabase
          .from("chat_history")
          .on("INSERT", (payload) => {
            // Send the new chat data to the connected clients
            socket.send(JSON.stringify(payload));
          })
          .eq("chat_id", chatID)
          .subscribe();
      });

      websocket.addEventListener("close", () => {
        // Clean up resources on socket close
        // For example, close the Supabase subscription
        subscription.close();
      });

      // Return the array of messages
      res.status(200).text("Subscription was successfull!");
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
