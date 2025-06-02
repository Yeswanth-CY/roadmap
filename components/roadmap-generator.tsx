"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreInput } from "@/components/score-input"
import { GamifiedRoadmap } from "@/components/gamified-roadmap"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function RoadmapGenerator() {
  const [activeStep, setActiveStep] = useState("scores")
  const [roadmapData, setRoadmapData] = useState<any>(null)
  const [userScores, setUserScores] = useState<Array<{ skill: string; score: number; maxScore: number }>>([])

  const handleScoresSubmitted = async (scores: Array<{ skill: string; score: number; maxScore: number }>) => {
    try {
      setUserScores(scores)

      // Convert scores to skill levels for roadmap generation
      const skillLevels: Record<string, string> = {}

      scores.forEach((score) => {
        const percentage = (score.score / score.maxScore) * 100
        let level = "beginner"

        if (percentage >= 75) {
          level = "advanced"
        } else if (percentage >= 40) {
          level = "intermediate"
        }

        skillLevels[score.skill] = level
      })

      // Call the API to generate the roadmap
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: scores.map((s) => s.skill),
          skillLevels,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate roadmap")
      }

      const data = await response.json()

      // Log the data to ensure it's properly formatted
      console.log("Roadmap data received:", data)

      if (!data || Object.keys(data).length === 0) {
        throw new Error("Received empty roadmap data")
      }

      setRoadmapData(data)
      setActiveStep("results")
    } catch (error) {
      console.error("Error generating roadmap:", error)
      // Use fallback data instead
      const fallbackData = generateFallbackRoadmap(scores)
      setRoadmapData(fallbackData)
      setActiveStep("results")
      alert("Using offline roadmap data due to API error.")
    }
  }

  const generateFallbackRoadmap = (scores: Array<{ skill: string; score: number; maxScore: number }>) => {
    const roadmap: Record<string, any> = {}

    scores.forEach((score) => {
      const percentage = (score.score / score.maxScore) * 100
      let level = "beginner"

      if (percentage >= 75) {
        level = "advanced"
      } else if (percentage >= 40) {
        level = "intermediate"
      }

      roadmap[score.skill] = {
        "Skill Level": level,
        "Learning Path": [
          `Learn ${score.skill} fundamentals`,
          `Practice with simple ${score.skill} projects`,
          `Build more complex ${score.skill} applications`,
          `Master advanced ${score.skill} concepts`,
        ],
        "Top YouTube Tutorials": [
          {
            title: `Learn ${score.skill} - Complete Tutorial`,
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(score.skill)}+tutorial`,
            description: `Comprehensive ${score.skill} tutorial`,
            platform: "YouTube",
            thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
            channelTitle: "Programming Tutorials",
            publishedAt: "2023-01-15",
          },
          {
            title: `${score.skill} Projects for ${level}s`,
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(score.skill)}+projects`,
            description: `Build real-world ${score.skill} projects`,
            platform: "YouTube",
            thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
            channelTitle: "Coding Projects",
            publishedAt: "2023-02-20",
          },
        ],
        "Best Learning Websites": [
          {
            title: `${score.skill} Documentation and Tutorials`,
            url: `https://www.google.com/search?q=${encodeURIComponent(score.skill)}+documentation+tutorial`,
            description: `Official documentation and tutorials for ${score.skill}`,
            platform: "Various",
            displayLink: "docs.example.com",
          },
          {
            title: `${score.skill} Courses for ${level}s`,
            url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(score.skill)}`,
            description: `Online courses to master ${score.skill}`,
            platform: "Udemy",
            displayLink: "udemy.com",
          },
        ],
        "Practice Platform": {
          title: `${score.skill} Practice Exercises`,
          url: "https://exercism.org/",
          description: `Interactive coding challenges for ${score.skill}`,
          platform: "Exercism",
        },
      }
    })

    return roadmap
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardContent className="p-6">
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Gamified Learning Experience</AlertTitle>
          <AlertDescription>
            Track your progress, earn achievements, and level up as you complete learning resources. All data is stored
            locally in your browser.
          </AlertDescription>
        </Alert>

        <Tabs value={activeStep} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="scores" onClick={() => setActiveStep("scores")}>
              1. Your Skills
            </TabsTrigger>
            <TabsTrigger
              value="results"
              onClick={() => setActiveStep("results")}
              disabled={activeStep !== "results" || !roadmapData}
            >
              2. Your Roadmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="mt-0">
            <ScoreInput onScoresSubmitted={handleScoresSubmitted} />
          </TabsContent>

          <TabsContent value="results" className="mt-0">
            <GamifiedRoadmap data={roadmapData} userScores={userScores} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
