import { type NextRequest, NextResponse } from "next/server"

// This would be the URL of your Python microservice in production
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:5000"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { skills, skillLevels } = data

    if (!skills || !skillLevels) {
      return NextResponse.json({ error: "Skills and skill levels are required" }, { status: 400 })
    }

    // In a real implementation, we would forward the request to the Python microservice
    // For now, we'll simulate the response with mock data

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock roadmap
    const roadmap = {
      skills: Object.keys(skillLevels).map((skill) => ({
        name: skill,
        level: skillLevels[skill],
        resources: [
          {
            type: "video",
            title: `Learn ${skill} - Complete Tutorial`,
            url: "https://youtube.com/watch?v=example",
            platform: "YouTube",
            difficulty: skillLevels[skill],
          },
          {
            type: "course",
            title: `${skill} Masterclass`,
            url: "https://example.com/course",
            platform: "Udemy",
            difficulty: skillLevels[skill],
          },
          {
            type: "practice",
            title: `${skill} Practice Problems`,
            url: "https://example.com/practice",
            platform: "LeetCode",
            difficulty: skillLevels[skill],
          },
        ],
      })),
    }

    return NextResponse.json(roadmap)
  } catch (error) {
    console.error("Error generating roadmap:", error)
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 })
  }
}
