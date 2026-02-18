import { NextRequest, NextResponse } from "next/server";
import { ok, err, serverError } from "@/lib/api";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validation
    if (!name?.trim() || name.trim().length < 2) return err("Name must be at least 2 characters");
    if (!email?.trim() || !EMAIL_RE.test(email))  return err("Invalid email address");
    if (!password || password.length < 6)          return err("Password must be at least 6 characters");
    if (password.length > 128)                     return err("Password too long");

    await dbConnect();

    // Check duplicate
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return err("Email already registered", 409);

    // Hash password with cost factor 12
    const hash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name:    name.trim(),
      email:   email.toLowerCase().trim(),
      password: hash,
      xp:      50, // welcome bonus
    });

    return ok({ id: user._id, name: user.name, email: user.email }, 201);
  } catch (e) {
    return serverError(e);
  }
}
