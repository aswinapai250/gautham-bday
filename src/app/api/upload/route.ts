import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to prevent overwriting
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, ""); // Sanitize filename
    const filename = `${uniqueSuffix}-${originalName}`;
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(filePath, buffer);
    console.log(`Uploaded file saved to: ${filePath}`);

    // Return the URL path to access the file
    const urlPath = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: urlPath });
  } catch (error: any) {
    console.error("Error saving file:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
