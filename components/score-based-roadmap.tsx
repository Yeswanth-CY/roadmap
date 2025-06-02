"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, ChevronRight, RefreshCw, Trash2 } from "lucide-react"
import { calculateProficiencyLevel } from "@/lib/db"
import { getHighestSkillScores, clearQuizScores } from "@/lib/quiz-service"
import { RoadmapResults } from "@/components/roadmap-results"
import { useToast } from "@/hooks/use-toast"

export function ScoreBasedRoadmap() {
  const router = useRouter()
  const [quizScores, setQuizScores] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roadmapData, setRoadmapData] = useState<any>(null)
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false)
  const { toast } = useToast()

  // Load quiz scores on component mount
  useEffect(() => {
    loadQuizScores()
  }, [])

  async function loadQuizScores() {
    try {
      setIsLoading(true)
      const scores = getHighestSkillScores()
      setQuizScores(scores)

      // If we're using mock data, show a message
      if (scores.every((score) => score.id === "1" || score.id === "2" || score.id === "3")) {
        setError("No quiz scores found. Take some quizzes to see your results here.")
      } else {
        setError(null)
      }
    } catch (err) {
      console.error("Error loading quiz scores:", err)
      setError("Failed to load quiz scores.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshScores = () => {
    loadQuizScores()
  }

  const handleClearScores = () => {
    clearQuizScores()
    loadQuizScores()
    toast({
      title: "Scores cleared",
      description: "All quiz scores have been cleared.",
    })
  }

  const handleGenerateRoadmap = async () => {
    try {
      setIsGeneratingRoadmap(true)

      // Convert quiz scores to skill levels for roadmap generation
      const skillLevels: Record<string, string> = {}

      quizScores.forEach((score) => {
        const level = calculateProficiencyLevel(score.score, score.max_score)
        skillLevels[score.skill_name] = level
      })

      // Call the API to generate the roadmap
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: Object.keys(skillLevels),
          skillLevels,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate roadmap")
      }

      const data = await response.json()
      setRoadmapData(data)
    } catch (err) {
      setError("Failed to generate roadmap. Please try again.")
      console.error(err)
    } finally {
      setIsGeneratingRoadmap(false)
    }
  }

  const handleTakeMoreQuizzes = () => {
    // Navigate to your quiz module
    router.push("/quizzes")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your quiz scores...</p>
      </div>
    )
  }

  if (roadmapData) {
    return <RoadmapResults data={roadmapData} />
  }

  const hasRealScores = !quizScores.every((score) => score.id === "1" || score.id === "2" || score.id === "3")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Quiz Scores</h2>
        <div className="flex gap-2">
          {hasRealScores && (
            <Button variant="outline" size="sm" onClick={handleClearScores}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleRefreshScores} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">{error}</div>}

      {!hasRealScores ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">You haven't completed any quizzes yet.</p>
              <Button onClick={handleTakeMoreQuizzes}>
                Take Quizzes
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {quizScores.map((score) => (
              <Card key={score.id}>
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-lg">{score.skill_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          Score: {score.score}/{score.max_score}
                        </span>
                        <Badge>{calculateProficiencyLevel(score.score, score.max_score)}</Badge>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{Math.round((score.score / score.max_score) * 100)}%</span>
                      </div>
                      <Progress value={(score.score / score.max_score) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={handleGenerateRoadmap} disabled={isGeneratingRoadmap || quizScores.length === 0} size="lg">
              {isGeneratingRoadmap ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Roadmap...
                </>
              ) : (
                "Generate Learning Roadmap"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
