import { NextRequest } from "next/server";
import { ok, err, unauthorized, notFound, serverError, requireAuth, paginate, sanitize } from "@/lib/api";
import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Project from "@/models/Project";
import User from "@/models/User";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { page, limit, skip } = paginate(req.nextUrl.searchParams);
    const [comments, total] = await Promise.all([
      Comment.find({ project: params.id, parentComment: null })
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit)
        .populate("author", "name avatar xp tier")
        .lean(),
      Comment.countDocuments({ project: params.id, parentComment: null }),
    ]);
    return ok({ comments: sanitize(comments), pagination: { total, page, limit } });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  try {
    await dbConnect();
    const { content, parentComment } = await req.json();
    if (!content?.trim()) return err("Comment cannot be empty");
    if (content.length > 1000) return err("Comment too long");

    const project = await Project.findById(params.id);
    if (!project) return notFound("Project");

    const userId = (session.user as any).id;
    const comment = await Comment.create({
      project: params.id,
      author:  userId,
      content: content.trim(),
      parentComment: parentComment || null,
    });

    // Award +10 XP to commenter
    await User.findByIdAndUpdate(userId, { $inc: { xp: 10 } });

    await comment.populate("author", "name avatar xp tier");
    return ok(sanitize(comment), 201);
  } catch (e) {
    return serverError(e);
  }
}
