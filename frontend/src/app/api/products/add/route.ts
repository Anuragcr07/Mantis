import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newProduct = await Product.create({
      name: data.name,
      brand: "Philix", // Hardcoded manufacturer name
      category: data.category,
      icon: data.category === "EV / Scooter" ? "Bike" : data.category === "Appliance" ? "Wind" : "Cpu",
      trainingUrl: data.source_url,
    });
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}