import mongoose from "mongoose";


const EstimateSchema = new mongoose.Schema({
    updatedChatMessages: { type: Array, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Estimate =
    mongoose.models.Estimate || mongoose.model("Estimate", EstimateSchema);