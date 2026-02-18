import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Standard API response helpers
export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized() {
  return err("Unauthorized — please sign in", 401);
}

export function notFound(resource = "Resource") {
  return err(`${resource} not found`, 404);
}

export function serverError(e?: unknown) {
  console.error("API Error:", e);
  return err("Internal server error", 500);
}

// Auth check helper
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session;
}

// Pagination helper
export function paginate(searchParams: URLSearchParams) {
  const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
}

// Sanitize a MongoDB document for JSON response
export function sanitize(doc: any): any {
  return JSON.parse(JSON.stringify(doc));
}
