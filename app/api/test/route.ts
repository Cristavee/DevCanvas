import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const sample = await Project.create({
      title: "Hello DevCanvas",
      description: "Testing database connection",
      codeSnippet: "console.log('Success')",
      language: "JavaScript",
      author: "000000000000000000000000", // placeholder ObjectId
    });
    return NextResponse.json({ message: "Data saved!", data: sample });
  } catch {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
