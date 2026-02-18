import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const project = await Project.findById(params.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = (session.user as any).id;
  const alreadyLiked = project.likes.includes(userId);
  if (alreadyLiked) {
    project.likes = project.likes.filter((id: any) => id.toString() !== userId);
  } else {
    project.likes.push(userId);
  }
  await project.save();
  return NextResponse.json({ likes: project.likes.length, liked: !alreadyLiked });
}
