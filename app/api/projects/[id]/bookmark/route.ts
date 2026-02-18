import { NextRequest } from "next/server";
import { ok, unauthorized, notFound, serverError, requireAuth } from "@/lib/api";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { Types } from "mongoose";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  try {
    await dbConnect();
    const project = await Project.findById(params.id);
    if (!project) return notFound("Project");

    const userId   = new Types.ObjectId((session.user as any).id);
    const bookmarked = project.bookmarks?.some((id: any) => id.equals(userId));

    if (bookmarked) {
      project.bookmarks?.pull(userId);
      await User.findByIdAndUpdate(userId, { $pull: { savedProjects: project._id } });
    } else {
      project.bookmarks?.push(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { savedProjects: project._id } });
    }
    await project.save();

    return ok({ bookmarked: !bookmarked, bookmarkCount: project.bookmarks?.length ?? 0 });
  } catch (e) {
    return serverError(e);
  }
}
