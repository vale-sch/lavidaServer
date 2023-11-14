import { WebSocket } from "ws";

export default createWebSocketStream(
  // Establish a WebSocket connection with Supabase
  new WebSocket(process.env.NEXT_PUBLIC_SUPABASE_URL.replace("http", "ws"))
);
