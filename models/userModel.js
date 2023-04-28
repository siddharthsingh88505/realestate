import mongoose from "mongoose";

// schema design
const userSchema = new mongoose.Schema({
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    userType: { type: String, required: true },
    contact: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    tc:{ type: Boolean, required: true}
});

// creating model / compiling schema
const userModel = mongoose.model("users", userSchema);

// exporting userModel
export { userModel };