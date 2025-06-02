import { NextResponse } from "next/server"

// This would be the URL of your Python microservice in production
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:5000"

export async function GET() {
  // Check if we're in a preview environment
  const isPreviewEnvironment = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"

  // If we're in a preview environment, return a specific response
  if (isPreviewEnvironment) {
    return NextResponse.json({
      status: "preview",
      message: "Running in preview mode. Python service connection not attempted.",
    })
  }

  try {
    // Set a timeout for the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${PYTHON_SERVICE_URL}/health`, {
      method: "GET",
      signal: controller.signal,
    }).finally(() => {
      clearTimeout(timeoutId)
    })

    if (!response.ok) {
      throw new Error(`Python service health check failed with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({
      status: "ok",
      pythonService: data,
      message: "Python service is available",
    })
  } catch (error) {
    console.error("Python service health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Python service is unavailable. Using client-side processing.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }, // Return 200 instead of 503 to avoid error in the UI
    )
  }
}
