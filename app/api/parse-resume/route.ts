import { type NextRequest, NextResponse } from "next/server"

// Import the simplified client-side skill extraction function
import { extractSkillsFromResume } from "@/lib/client-skill-extraction"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Check file type - for simplicity, we now only support text files
    const allowedTypes = ["text/plain"]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "For this demo, only text (.txt) files are supported. Please upload a TXT file.",
        },
        { status: 400 },
      )
    }

    // Use the simplified client-side extraction
    const result = await extractSkillsFromResume(file)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to extract skills from resume",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      ...result,
      message: "Skills extracted successfully.",
    })
  } catch (error) {
    console.error("Error processing resume:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process resume. Please try again or contact support.",
      },
      { status: 500 },
    )
  }
}
