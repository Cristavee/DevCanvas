import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const project = await Project.findById(params.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = (session.user as { id?: string }).id;
  const alreadyLiked = project.likes.some((id: { toString(): string }) => id.toString() === userId);

  if (alreadyLiked) {
    project.likes = project.likes.filter((id: { toString(): string }) => id.toString() !== userId);
  } else {
    project.likes.push(userId);
  }

  await project.save();
  return NextResponse.json({ likes: project.likes.length, liked: !alreadyLiked });
}
