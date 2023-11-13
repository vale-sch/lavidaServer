// create_msg.js
import supabase from "../utils/supabase";
import ChatHistory from "../utils/chat_history.js";

export const createChat = async (chat_id, messages = []) => {
  try {
    const chatHistory = new ChatHistory(chat_id, messages);

    // Create new chat
    const { data, error } = await supabase
      .from("chat_history")
      .insert([chatHistory.toDatabase()]);

    if (error) {
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error("Error creating new chat:", error);
    throw new Error("An error occurred while creating the new chat");
  }
};
