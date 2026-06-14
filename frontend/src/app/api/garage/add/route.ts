import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import GarageItem from "@/models/GarageItem";

export async function POST(req: Request) {
  try {
    console.log("--- API START: Adding to Garage ---");
    await connectToDatabase();
    
    const data = await req.json();
    console.log("Received Data:", data);

    // FIX: Map the 'name' from frontend to 'productName' for the Schema
    // FIX: Ensure userId is a valid placeholder if not using real Auth yet
    const newItem = await GarageItem.create({
      userId: "666c5d1e2f3a4b5c6d7e8f90", // Must be a valid 24-character hex string for MongoDB
      productName: data.name, // Mapped from 'name'
      brand: data.brand,
      category: data.category,
      serialNumber: data.serialNumber,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
      lastServiceDate: data.lastServiceDate ? new Date(data.lastServiceDate) : null,
      usageReading: Number(data.usage),
      status: "optimal",
      healthScore: 100
    });

    console.log("✅ Successfully saved to MongoDB:", newItem._id);
    return NextResponse.json({ success: true, item: newItem }, { status: 201 });

  } catch (error: any) {
    // THIS WILL SHOW YOU THE ERROR IN YOUR TERMINAL
    console.error("❌ MONGODB ERROR:", error.message);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}