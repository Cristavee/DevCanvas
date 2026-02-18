import { NextRequest } from "next/server";
import { ok, err, unauthorized, notFound, serverError, requireAuth, sanitize } from "@/lib/api";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

// GET /api/projects/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const project = await Project.findById(params.id)
      .populate("author", "name avatar xp tier bio")
      .lean();
    if (!project) return notFound("Project");

    // Increment view count (fire and forget)
    Project.findByIdAndUpdate(params.id, { $inc: { views: 1 } }).exec();

    return ok(sanitize(project));
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/projects/:id — owner only
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  try {
    await dbConnect();
    const project = await Project.findById(params.id);
    if (!project) return notFound("Project");

    const userId = (session.user as any).id;
    const role   = (session.user as any).role;
    if (project.author.toString() !== userId && role !== "admin") {
      return err("Forbidden", 403);
    }

    await project.deleteOne();
    return ok({ deleted: true });
  } catch (e) {
    return serverError(e);
  }
}

// PATCH /api/projects/:id — update (owner only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  try {
    await dbConnect();
    const project = await Project.findById(params.id);
    if (!project) return notFound("Project");

    const userId = (session.user as any).id;
    if (project.author.toString() !== userId) return err("Forbidden", 403);

    const body = await req.json();
    const allowed = ["title", "description", "codeSnippet", "language", "tags", "visibility"];
    const updates: any = {};
    for (const k of allowed) {
      if (body[k] !== undefined) updates[k] = body[k];
    }

    const updated = await Project.findByIdAndUpdate(params.id, updates, { new: true })
      .populate("author", "name avatar xp tier");
    return ok(sanitize(updated));
  } catch (e) {
    return serverError(e);
  }
}
