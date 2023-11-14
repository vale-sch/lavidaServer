import { Server } from "http";
import { WebSocketServer } from "ws";
import supabase from "../utils/supabase";

// Create an HTTP server
const server = new Server();

// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocketServer({ noServer: true });
wss.on("connection", (ws) => {
  // Handle WebSocket connection
  ws.on("message", (message) => {
    // Handle incoming messages
    console.log(`Received message: ${message}`);
  });

  // Send a welcome message
  ws.send("Welcome to the WebSocket server!");
});

// Attach the WebSocket server to the HTTP server
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Start the HTTP server on a specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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

      // Return the array of messages
      res
        .status(201)
        .send(
          `Subscription was successful! Listen on wss://lavida-server.vercel.app/ws?chatID=${chatID}`
        );
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
