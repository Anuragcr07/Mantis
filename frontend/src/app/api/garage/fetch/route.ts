import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import GarageItem from "@/models/GarageItem";

export async function GET() {
  try {
    await connectToDatabase();

    // In a real app, you would get the userId from the session/cookie.
    // For now, we fetch items for our dummy ID used in the 'add' route.
    const userId = "666c5d1e2f3a4b5c6d7e8f90";

    const items = await GarageItem.find({ userId: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      items: items 
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ FETCH ERROR:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch garage items" 
    }, { status: 500 });
  }
}