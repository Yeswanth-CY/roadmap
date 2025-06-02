"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"

export function ServiceStatus() {
  const [serviceStatus, setServiceStatus] = useState<"checking" | "available" | "unavailable" | "preview">("checking")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    // Check if we're in a preview environment (like Vercel preview)
    const isPreviewEnvironment =
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname === "localhost" ||
      window.location.hostname.includes("preview")

    const checkServiceStatus = async () => {
      try {
        // If we're in a preview environment, don't even try to connect to the Python service
        if (isPreviewEnvironment) {
          setServiceStatus("preview")
          setMessage(
            "Running in demo mode with simplified resume parsing. Only text (.txt) files are supported for skill extraction.",
          )
          return
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        const response = await fetch("/api/python-health", {
          signal: controller.signal,
        }).finally(() => {
          clearTimeout(timeoutId)
        })

        const data = await response.json()

        if (response.ok && data.status === "ok") {
          setServiceStatus("available")
        } else {
          setServiceStatus("unavailable")
          setMessage(data.message || "Python service is unavailable. Using client-side resume parsing.")
        }
      } catch (error) {
        console.log("Service status check error:", error)
        setServiceStatus("unavailable")
        setMessage("Could not connect to Python service. Using client-side resume parsing.")
      }
    }

    checkServiceStatus()
  }, [])

  if (serviceStatus === "checking" || serviceStatus === "available") {
    return null
  }

  return (
    <Alert variant={serviceStatus === "preview" ? "default" : "warning"} className="mb-4">
      {serviceStatus === "preview" ? <Info className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
      <AlertTitle>{serviceStatus === "preview" ? "Preview Mode" : "Service Status"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
