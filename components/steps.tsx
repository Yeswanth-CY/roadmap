"use client"

import { useState } from "react"
import { ResumeUpload } from "@/components/resume-upload"
import { SkillAssessment } from "@/components/skill-assessment"
import { RoadmapResults } from "@/components/roadmap-results"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Steps() {
  const [activeStep, setActiveStep] = useState("upload")
  const [extractedSkills, setExtractedSkills] = useState<string[]>([])
  const [skillLevels, setSkillLevels] = useState<Record<string, string>>({})
  const [roadmapData, setRoadmapData] = useState<any>(null)

  const handleSkillsExtracted = (skills: string[]) => {
    setExtractedSkills(skills)
    setActiveStep("assessment")
  }

  const handleAssessmentComplete = (levels: Record<string, string>) => {
    setSkillLevels(levels)
    setActiveStep("results")
    // In a real implementation, we would call the API to generate the roadmap here
    generateRoadmap(extractedSkills, levels)
  }

  const generateRoadmap = async (skills: string[], levels: Record<string, string>) => {
    // This would be a real API call in production
    // For now, we'll simulate the response
    setTimeout(() => {
      const mockRoadmap = {
        skills: skills.map((skill) => ({
          name: skill,
          level: levels[skill] || "beginner",
          resources: [
            {
              type: "video",
              title: `Learn ${skill} - Complete Tutorial`,
              url: "https://youtube.com/watch?v=example",
              platform: "YouTube",
              difficulty: levels[skill] || "beginner",
            },
            {
              type: "course",
              title: `${skill} Masterclass`,
              url: "https://example.com/course",
              platform: "Udemy",
              difficulty: levels[skill] || "beginner",
            },
            {
              type: "practice",
              title: `${skill} Practice Problems`,
              url: "https://example.com/practice",
              platform: "LeetCode",
              difficulty: levels[skill] || "beginner",
            },
          ],
        })),
      }
      setRoadmapData(mockRoadmap)
    }, 1500)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Tabs value={activeStep} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="upload"
              onClick={() => setActiveStep("upload")}
              disabled={activeStep !== "upload" && extractedSkills.length === 0}
            >
              1. Resume Upload
            </TabsTrigger>
            <TabsTrigger
              value="assessment"
              onClick={() => setActiveStep("assessment")}
              disabled={activeStep === "upload" || extractedSkills.length === 0}
            >
              2. Skill Assessment
            </TabsTrigger>
            <TabsTrigger
              value="results"
              onClick={() => setActiveStep("results")}
              disabled={activeStep !== "results" || !roadmapData}
            >
              3. Your Roadmap
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-0">
            <ResumeUpload onSkillsExtracted={handleSkillsExtracted} />
          </TabsContent>
          <TabsContent value="assessment" className="mt-0">
            <SkillAssessment skills={extractedSkills} onComplete={handleAssessmentComplete} />
          </TabsContent>
          <TabsContent value="results" className="mt-0">
            <RoadmapResults data={roadmapData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
