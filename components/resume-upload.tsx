"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ResumeUploadProps {
  onSkillsExtracted: (skills: string[], categorizedSkills?: Record<string, string[]>, additionalData?: any) => void
}

export function ResumeUpload({ onSkillsExtracted }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [extractedSkills, setExtractedSkills] = useState<string[]>([])
  const [categorizedSkills, setCategorizedSkills] = useState<Record<string, string[]>>({})
  const [additionalData, setAdditionalData] = useState<any>(null)
  const [isComplete, setIsComplete] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check if file is TXT
      const allowedTypes = ["text/plain"]

      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setError(null)
        setWarning(null)
        setIsComplete(false)
        setExtractedSkills([])
        setCategorizedSkills({})
        setAdditionalData(null)
      } else {
        setError("Please upload a TXT file")
        setFile(null)
      }
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setError(null)
      setWarning(null)

      // First simulate the file upload
      simulateUpload()

      // Wait for upload to complete
      setTimeout(async () => {
        setIsProcessing(true)

        try {
          // Create a FormData object to send the file
          const formData = new FormData()
          formData.append("file", file)

          // Send the file to our API
          const response = await fetch("/api/parse-resume", {
            method: "POST",
            body: formData,
          })

          const data = await response.json()

          if (!response.ok || !data.success) {
            throw new Error(data.error || "Failed to extract skills from resume")
          }

          // Check if this is fallback data
          if (data.fallback) {
            setWarning(data.message || "Using fallback extraction. Some features may be limited.")
          }

          setExtractedSkills(data.skills || [])
          setCategorizedSkills(data.categorized_skills || {})

          // Store additional data like education and experience
          const additionalInfo = {
            education: data.education || [],
            experience: data.experience || [],
          }
          setAdditionalData(additionalInfo)

          setIsComplete(true)
        } catch (error) {
          console.error("Error parsing resume:", error)
          setError(
            error instanceof Error ? error.message : "Failed to extract skills from your resume. Please try again.",
          )
        } finally {
          setIsProcessing(false)
        }
      }, 1500)
    } catch (err) {
      setError("An error occurred while processing your resume")
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  const handleContinue = () => {
    onSkillsExtracted(extractedSkills, categorizedSkills, additionalData)
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      programming_languages: "Programming Languages",
      web_development: "Web Development",
      databases: "Databases",
      devops: "DevOps",
      data_science: "Data Science",
      mobile_development: "Mobile Development",
      tools: "Tools",
      soft_skills: "Soft Skills",
      cybersecurity: "Cybersecurity",
    }
    return labels[category] || category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      programming_languages: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      web_development: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      databases: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      devops: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      data_science: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      mobile_development: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      tools: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      soft_skills: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      cybersecurity: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Upload Your Resume</h2>
        <p className="text-muted-foreground">
          We'll analyze your resume in real-time to extract skills and create a personalized learning roadmap
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const droppedFile = e.dataTransfer.files[0]
              const input = document.getElementById("resume-upload") as HTMLInputElement

              // Check file type
              const allowedTypes = ["text/plain"]

              if (allowedTypes.includes(droppedFile.type)) {
                // Create a new FileList-like object
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(droppedFile)

                // Set the file input's files
                if (input) {
                  input.files = dataTransfer.files

                  // Trigger change event
                  const event = new Event("change", { bubbles: true })
                  input.dispatchEvent(event)
                }
              } else {
                setError("Please upload a TXT file")
              }
            }
          }}
        >
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".txt"
            disabled={isUploading || isProcessing}
          />
          <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <h3 className="font-medium">Click to upload or drag and drop</h3>
            <p className="text-sm text-muted-foreground">Text (.txt) files only (max 10MB)</p>
          </label>
        </div>

        {file && (
          <div className="flex items-center gap-2 p-2 border rounded bg-muted/50">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm truncate flex-1">{file.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setFile(null)
                setIsComplete(false)
                setExtractedSkills([])
                setCategorizedSkills({})
                setAdditionalData(null)
                setError(null)
                setWarning(null)
              }}
              disabled={isUploading || isProcessing}
            >
              Remove
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {warning && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}

        {!isComplete && (
          <Button type="submit" className="w-full" disabled={!file || isUploading || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              "Analyze Resume"
            )}
          </Button>
        )}
      </form>

      {isComplete && extractedSkills.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Skills successfully extracted from your resume!</span>
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Extracted Skills</h3>
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              {Object.keys(categorizedSkills).length > 0 && (
                <div className="mt-4 space-y-3">
                  <h3 className="font-medium">Skills by Category</h3>
                  <div className="space-y-2">
                    {Object.entries(categorizedSkills).map(([category, skills]) => (
                      <div key={category}>
                        <h4 className="text-sm text-muted-foreground mb-1">{getCategoryLabel(category)}</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge key={skill} className={getCategoryColor(category)}>
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {additionalData && additionalData.education && additionalData.education.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Education</h3>
                  <div className="space-y-2">
                    {additionalData.education.map((edu: any, index: number) => (
                      <div key={index} className="text-sm">
                        {edu.degree && <span className="font-medium">{edu.degree}</span>}
                        {edu.institution && <span> at {edu.institution}</span>}
                        {edu.year && <span> ({edu.year})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleContinue} className="w-full">
            Continue to Skill Assessment
          </Button>
        </div>
      )}

      {isComplete && extractedSkills.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No skills found</AlertTitle>
          <AlertDescription>
            We couldn't extract any skills from your resume. Please try uploading a different file or manually enter
            your skills in the next step.
          </AlertDescription>
          <Button onClick={() => onSkillsExtracted([])} className="w-full mt-4">
            Continue Manually
          </Button>
        </Alert>
      )}
    </div>
  )
}
