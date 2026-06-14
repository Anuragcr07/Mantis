import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: "Cpu" }, // Store string name of lucide icon
  trainingUrl: { type: String }, // The S3 path
  isTrained: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);