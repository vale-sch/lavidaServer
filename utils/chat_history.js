import supabase from "../utils/supabase";

export default class ChatHistory {
  constructor(chat_id, messages, participants) {
    this.chat_id = chat_id;
    this.messages = messages;
    this.participants = participants;
  }

  static createNew(chat_id, sender_id, message, participants) {
    const newMessage = {
      sender_id: sender_id,
      message: message,
      time_sent: new Date().toLocaleTimeString(),
    };
    return new ChatHistory(chat_id, [newMessage], participants);
  }

  static fromClient(data) {
    return new ChatHistory(data.chat_id, data.messages, data.participants);
  }

  toDatabase() {
    return {
      chat_id: this.chat_id,
      messages: this.messages,
      participants: this.participants,
    };
  }
  async getChat() {
    try {
      const { data, error } = await supabase
        .from("chat_history")
        .select("*") // Select all fields for the specified chat ID
        .eq("chat_id", this.chat_id);

      console.log("Supabase data:", data);

      if (error) {
        console.error("Error executing the query:", error);
        throw new Error("An error occurred while fetching chat");
      }

      return data?.[0] || null; // Return the entire chat object
    } catch (error) {
      console.error("Error fetching chat:", error);
      throw new Error("An unexpected error occurred while fetching chat");
    }
  }
}
