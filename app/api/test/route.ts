import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    
    // Membuat data dummy
    const sample = await Project.create({
      title: "Hello DevCanvas",
      description: "Testing koneksi database pertama",
      codeSnippet: "console.log('Success')",
      language: "JavaScript"
    });

    return NextResponse.json({ message: "Data berhasil disimpan!", data: sample });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}
