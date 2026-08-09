import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, generateOTP } from "@/lib/auth";
import { sendOTP } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, email, password, role } = await req.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    if (role !== "customer" && role !== "company") {
      return NextResponse.json({ success: false, error: "Invalid role specified" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 400 });
      } else {
        // Overwrite unverified user
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        existingUser.name = name;
        existingUser.password = hashPassword(password);
        existingUser.role = role;
        existingUser.otp = otp;
        existingUser.otpExpiry = otpExpiry;

        await existingUser.save();
        await sendOTP(email, otp, 'signup');

        return NextResponse.json({
          success: true,
          message: "Verification code sent to your email.",
          email
        }, { status: 200 });
      }
    }

    // Create new unverified user
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await User.create({
      name,
      email,
      password: hashPassword(password),
      role,
      isVerified: false,
      otp,
      otpExpiry
    });

    await sendOTP(email, otp, 'signup');

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email.",
      email
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Signup API Error:", error.message);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
