// src/models/GarageItem.ts
import mongoose from "mongoose";

const GarageItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productName: { type: String, required: true }, // Ensure this matches 'productName'
  brand: String,
  category: String,
  serialNumber: String,
  purchaseDate: Date,
  lastServiceDate: Date,
  usageReading: Number,
  healthScore: { type: Number, default: 100 },
  status: { type: String, default: "optimal" },
}, { timestamps: true });

export default mongoose.models.GarageItem || mongoose.model("GarageItem", GarageItemSchema);