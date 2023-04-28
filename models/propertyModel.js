import mongoose from "mongoose";

// schema design
const propertySchema = new mongoose.Schema({
    ref_id: { type: String, required: true},
    name: { type: String, trim: true, required: true },
    location: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    price: { type: Number, trim: true, required: true },
    area: { type: Number, trim: true, required: true },
    bedroom: { type: Number, trim: true, required: true },
    bathroom: { type: Number, trim: true, required: true },
    owner: { type: String, trim: true, required: true },
    type: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    notic: {type: String,trim:true,required: true},
    date: { type: Date, default: Date.now, trim: true, required: true },
    images: { type: Array, required: true },
    videos: { type: Array, required: true }
}); 

// creating model / compiling schema
const propertyModel = mongoose.model("properties", propertySchema);

export { propertyModel };