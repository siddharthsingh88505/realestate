import mongoose from "mongoose";

// schema design
const chatSchema = new mongoose.Schema({
    users: { type: Array},
    messages: { type: Array },
    timestamp: { type: Date, default: Date.now() }
});

// creating model / compiling schema
const chatModel = mongoose.model("chats", chatSchema);

// exporting userModel
export { chatModel };