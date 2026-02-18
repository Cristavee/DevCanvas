import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as {
      title?: string;
      description?: string;
      codeSnippet?: string;
      language?: string;
      tags?: string[];
      thumbnailUrl?: string;
      visibility?: string;
    };

    const { title, description, codeSnippet, language, tags, thumbnailUrl, visibility } = body;

    if (!title || !codeSnippet || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const authorId = (session.user as { id?: string }).id;

    const newProject = await Project.create({
      title,
      description: description || '',
      codeSnippet,
      language,
      tags: tags || [],
      thumbnailUrl,
      author: authorId,
      visibility: visibility || 'Public',
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
