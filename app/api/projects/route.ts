import { NextRequest } from "next/server";
import { ok, err, unauthorized, serverError, requireAuth, paginate, sanitize } from "@/lib/api";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";

// GET /api/projects — public feed with filtering, sorting, pagination
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const sp = req.nextUrl.searchParams;
    const { page, limit, skip } = paginate(sp);
    const lang    = sp.get("language");
    const q       = sp.get("q")?.trim();
    const sort    = sp.get("sort") || "new"; // new | hot | top
    const authorId = sp.get("author");

    // Base filter: only public projects
    const filter: any = { visibility: "Public" };
    if (lang)     filter.language = lang;
    if (authorId) filter.author   = authorId;
    if (q) {
      // Full-text search if index available, else regex
      filter.$or = [
        { title:       { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags:        { $regex: q, $options: "i" } },
      ];
    }

    // Sort strategy
    const sortMap: Record<string, any> = {
      new:  { createdAt: -1 },
      hot:  { views: -1, createdAt: -1 },
      top:  { "likes": -1, createdAt: -1 }, // sort by array length approximation
    };
    const sortObj = sortMap[sort] ?? { createdAt: -1 };

    const [docs, total] = await Promise.all([
      Project.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate("author", "name avatar xp tier role")
        .lean(),
      Project.countDocuments(filter),
    ]);

    return ok({
      projects: sanitize(docs),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/projects — create new snippet (auth required)
export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  try {
    await dbConnect();
    const body = await req.json();
    const { title, description, codeSnippet, language, tags, visibility } = body;

    // Validation
    if (!title?.trim())       return err("Title is required");
    if (!codeSnippet?.trim()) return err("Code is required");
    if (!language?.trim())    return err("Language is required");
    if (title.trim().length > 120) return err("Title too long (max 120 chars)");

    // Check user exists and not banned
    const userId = (session.user as any).id;
    const user   = await User.findById(userId);
    if (!user)           return err("User not found", 404);
    if (user.isBanned)   return err("Account suspended", 403);

    // Parse tags
    const parsedTags = tags
      ? String(tags).split(",").map((t: string) => t.trim().toLowerCase()).filter(Boolean).slice(0, 10)
      : [];

    const project = await Project.create({
      title:       title.trim(),
      description: description?.trim() || "",
      codeSnippet: codeSnippet.trim(),
      language:    language.trim(),
      tags:        parsedTags,
      visibility:  visibility === "Private" ? "Private" : "Public",
      author:      user._id,
    });

    // Award XP (+50) and update streak
    const today = new Date();
    const last  = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    const isNewDay = !last || today.toDateString() !== last.toDateString();
    const streakIncrement = isNewDay ? 1 : 0;

    await User.findByIdAndUpdate(user._id, {
      $inc: { xp: 50, streak: streakIncrement },
      lastActiveDate: today,
    });

    await project.populate("author", "name avatar xp tier");
    return ok(sanitize(project), 201);
  } catch (e) {
    return serverError(e);
  }
}
