import websocket from "../utils/websocket";
import supabase from "../utils/supabase";

export default async (req, res) => {
  if (req.method === "OPTIONS") {
    // Set CORS headers for preflight requests
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(204).end();
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
