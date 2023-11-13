export default class ChatHistory {
  constructor(chat_id, messages) {
    this.chat_id = chat_id;
    this.messages = messages;
  }

  static createNew(chat_id, sender_id, message) {
    const newMessage = {
      sender_id: sender_id,
      message: message,
      time_sent: new Date().toLocaleTimeString(),
    };
    return new ChatHistory(chat_id, [newMessage]);
  }

  addMessage(sender_id, message) {
    const newMessage = {
      sender_id: sender_id,
      message: message,
      time_sent: new Date().toLocaleTimeString(),
    };
    this.messages.push(newMessage);
  }

  static fromDatabase(data) {
    return new ChatHistory(data.chat_id, data.messages);
  }

  toDatabase() {
    return {
      chat_id: this.chat_id,
      messages: this.messages,
    };
  }
  async getMessages() {
    try {
      // Fetch all messages for the specified chat ID
      const { data, error } = await supabase
        .from("chat_history")
        .select("messages")
        .eq("chat_id", this.chat_id);

      if (error) {
        console.error("Error executing the query:", error);
        throw new Error("An error occurred while fetching messages");
      }

      return data.messages || [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw new Error("An unexpected error occurred while fetching messages");
    }
  }
}
