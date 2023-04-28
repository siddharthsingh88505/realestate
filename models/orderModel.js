import mongoose from "mongoose";

// schema design
const orderSchema = new mongoose.Schema({
    propertyId: { type: String, trim: true, required: true },
    userId: { type: String, trim: true, required: true },
    amount: { type: Number, trim: true, required: true },
    date: { type: Date, default: Date.now, trim: true, required: true },
});

// creating model / compiling schema
const orderModel = mongoose.model("orders", orderSchema);

// exporting userModel
export { orderModel };