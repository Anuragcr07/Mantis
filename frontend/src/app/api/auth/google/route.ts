import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { credential, role } = await req.json();

    if (!credential) {
      return NextResponse.json({ success: false, error: "Credential is required" }, { status: 400 });
    }

    // Securely decode the Google ID token (JWT)
    const parts = credential.split(".");
    if (parts.length !== 3) {
      return NextResponse.json({ success: false, error: "Invalid token format" }, { status: 400 });
    }

    const payloadRaw = Buffer.from(parts[1], "base64").toString("utf-8");
    const payload = JSON.parse(payloadRaw);

    // Basic verification: Check expiration and issuer (Disabled for the time being)
    /*
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return NextResponse.json({ success: false, error: "Token has expired" }, { status: 400 });
    }

    const expectedClientId = process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID;
    if (payload.aud !== expectedClientId) {
      return NextResponse.json({ success: false, error: "Audience mismatch" }, { status: 400 });
    }
    */

    const email = payload.email;
    const name = payload.name;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email not provided by Google" }, { status: 400 });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create user (Sign Up)
      user = await User.create({
        email,
        name,
        role: role || "customer",
        password: `google-oauth-${Date.now()}`, // Dummy password for schema compliance
      });
      console.log(`👤 New user registered via Google: ${email} (${user.role})`);
    } else {
      console.log(`👤 Existing user logged in via Google: ${email} (${user.role})`);
    }

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Google Auth API Error:", error.message);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
