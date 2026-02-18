import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const lang = searchParams.get("language");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort") || "createdAt";

    const query: any = { visibility: "Public" };
    if (lang) query.language = lang;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const sortObj: any = sort === "likes" ? { "likes.length": -1 } : { [sort]: -1 };

    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("author", "name avatar xp tier")
        .lean(),
      Project.countDocuments(query),
    ]);

    return NextResponse.json({
      projects: JSON.parse(JSON.stringify(projects)),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized — please sign in" }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();
    const { title, description, codeSnippet, language, tags, visibility } = body;

    if (!title || !codeSnippet || !language) {
      return NextResponse.json({ error: "Title, code, and language are required" }, { status: 400 });
    }

    const user = await User.findById((session.user as any).id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.isBanned) return NextResponse.json({ error: "Account banned" }, { status: 403 });

    const project = await Project.create({
      title: title.trim(),
      description: description?.trim() || "",
      codeSnippet: codeSnippet.trim(),
      language,
      tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      visibility: visibility || "Public",
      author: user._id,
    });

    // Award XP for posting
    await User.findByIdAndUpdate(user._id, { $inc: { xp: 50 } });

    await project.populate("author", "name avatar xp tier");

    return NextResponse.json(JSON.parse(JSON.stringify(project)), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
