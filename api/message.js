export class Message {
  chatID = "";
  senderID = "";

  message = "";
  time = "";

  constructor(_chatID, _senderID, _message) {
    this.chatID = _chatID;
    this.senderID = _senderID;
    this.message = _message;
  }
}
