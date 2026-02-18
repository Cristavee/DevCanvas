import { NextRequest } from "next/server";
import { ok, err, unauthorized, serverError, requireAuth, sanitize } from "@/lib/api";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/user — current user profile
export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorized();
  try {
    await dbConnect();
    const user = await User.findById((session.user as any).id)
      .select("-password")
      .lean();
    return ok(sanitize(user));
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/user — update profile
export async function PATCH(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorized();
  try {
    await dbConnect();
    const body = await req.json();
    const allowed = ["name","bio","location","website","twitter","github","theme","emailNotifications","pushNotifications","avatar"];
    const updates: any = {};
    for (const k of allowed) {
      if (body[k] !== undefined) updates[k] = body[k];
    }
    // Validate name length
    if (updates.name && updates.name.trim().length < 2) return err("Name too short");
    if (updates.name) updates.name = updates.name.trim();

    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      updates,
      { new: true, runValidators: true, select: "-password" }
    ).lean();
    return ok(sanitize(user));
  } catch (e) {
    return serverError(e);
  }
}
