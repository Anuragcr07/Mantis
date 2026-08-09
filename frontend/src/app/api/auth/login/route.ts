import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword, generateOTP } from "@/lib/auth";
import { sendOTP } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ success: false, error: "Email, password and role are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 400 });
    }

    if (user.role !== role) {
      return NextResponse.json({ success: false, error: `Unauthorized role access. You are registered as a ${user.role}.` }, { status: 403 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ success: false, error: "This email is not verified yet. Please sign up again to verify." }, { status: 400 });
    }

    const passwordMatch = verifyPassword(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 400 });
    }

    // Generate OTP for Login verification
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTP(email, otp, 'login');

    console.log(`🔑 Login requested, verification OTP sent to: ${email}`);

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "A verification code has been sent to your email.",
      email
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Login API Error:", error.message);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
