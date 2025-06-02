"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Trophy, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ScoreInputProps {
  onScoresSubmitted: (scores: Array<{ skill: string; score: number; maxScore: number }>) => void
}

export function ScoreInput({ onScoresSubmitted }: ScoreInputProps) {
  const [skills, setSkills] = useState<Array<{ skill: string; score: number; maxScore: number }>>([
    { skill: "JavaScript", score: 80, maxScore: 100 },
    { skill: "React", score: 65, maxScore: 100 },
  ])
  const [newSkill, setNewSkill] = useState("")
  const { toast } = useToast()

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast({
        title: "Please enter a skill name",
        variant: "destructive",
      })
      return
    }

    if (skills.some((s) => s.skill.toLowerCase() === newSkill.toLowerCase())) {
      toast({
        title: "Skill already exists",
        description: "This skill is already in your list",
        variant: "destructive",
      })
      return
    }

    setSkills([...skills, { skill: newSkill, score: 50, maxScore: 100 }])
    setNewSkill("")
  }

  const handleRemoveSkill = (index: number) => {
    const newSkills = [...skills]
    newSkills.splice(index, 1)
    setSkills(newSkills)
  }

  const handleScoreChange = (index: number, value: number[]) => {
    const newSkills = [...skills]
    newSkills[index].score = value[0]
    setSkills(newSkills)
  }

  const handleSubmit = () => {
    if (skills.length === 0) {
      toast({
        title: "No skills added",
        description: "Please add at least one skill",
        variant: "destructive",
      })
      return
    }

    onScoresSubmitted(skills)

    toast({
      title: "Scores submitted",
      description: "Your roadmap is being generated",
    })
  }

  const getSkillLevel = (score: number): "beginner" | "intermediate" | "advanced" => {
    if (score < 40) return "beginner"
    if (score < 75) return "intermediate"
    return "advanced"
  }

  const getLevelColor = (level: string): string => {
    switch (level) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Your Quiz Scores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a skill (e.g., JavaScript, Python)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddSkill}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{skill.skill}</h3>
                  <Badge className={getLevelColor(getSkillLevel(skill.score))}>{getSkillLevel(skill.score)}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveSkill(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Score: {skill.score}/{skill.maxScore}
                  </span>
                  <span>{Math.round((skill.score / skill.maxScore) * 100)}%</span>
                </div>
                <Slider
                  value={[skill.score]}
                  min={0}
                  max={skill.maxScore}
                  step={1}
                  onValueChange={(value) => handleScoreChange(index, value)}
                  className="py-2"
                />
              </div>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No skills added yet. Add your skills and scores above.
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full" size="lg" disabled={skills.length === 0}>
          <GraduationCap className="mr-2 h-5 w-5" />
          Generate My Learning Roadmap
        </Button>
      </CardContent>
    </Card>
  )
}
