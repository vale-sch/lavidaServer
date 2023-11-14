import { createServer } from "http";
import { Server } from "ws";
import supabase from "../utils/supabase";

const server = createServer();
const wss = new Server({ noServer: true });

wss.on("connection", (ws) => {
  // Handle WebSocket connection

  ws.on("message", (message) => {
    // Handle incoming messages
    console.log(`Received message: ${message}`);
  });

  // Send a welcome message
  ws.send("Welcome to the WebSocket server!");
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

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
      const websocket = new WebSocket(
        process.env.NEXT_PUBLIC_SUPABASE_URL.replace("http", "ws")
      );

      // Handle WebSocket events
      websocket.addEventListener("open", () => {
        // Subscribe to the chat changes for the specified chatID
        const subscription = supabase
          .from("chat_history")
          .on("INSERT", (payload) => {
            // Send the new chat data to the connected clients
            websocket.send(JSON.stringify(payload));
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
      res.status(200).text("Subscription was successful!");
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
