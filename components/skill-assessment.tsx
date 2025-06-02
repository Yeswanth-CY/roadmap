"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SkillAssessmentProps {
  skills: string[]
  categorizedSkills?: Record<string, string[]>
  onComplete: (levels: Record<string, string>) => void
  isGenerating: boolean
}

export function SkillAssessment({ skills, categorizedSkills, onComplete, isGenerating }: SkillAssessmentProps) {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [skillLevels, setSkillLevels] = useState<Record<string, string>>({})
  const [currentSelection, setCurrentSelection] = useState<string | null>(null)
  const [customSkills, setCustomSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState("programming_languages")
  const [isAddingSkill, setIsAddingSkill] = useState(false)

  // Combine original skills with custom skills
  const allSkills = [...skills, ...customSkills]
  const currentSkill = allSkills[currentSkillIndex]
  const isLastSkill = currentSkillIndex === allSkills.length - 1

  // Find which category the current skill belongs to
  const getCurrentSkillCategory = () => {
    if (!categorizedSkills) return null

    for (const [category, categorySkills] of Object.entries(categorizedSkills)) {
      if (categorySkills.includes(currentSkill)) {
        return category
      }
    }
    return null
  }

  const currentCategory = getCurrentSkillCategory()

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

  const handleNext = () => {
    if (!currentSelection) return

    // Save the current selection
    setSkillLevels((prev) => ({
      ...prev,
      [currentSkill]: currentSelection,
    }))

    if (isLastSkill) {
      // We're done with the assessment
      const finalLevels = {
        ...skillLevels,
        [currentSkill]: currentSelection,
      }
      onComplete(finalLevels)
    } else {
      // Move to the next skill
      setCurrentSkillIndex((prev) => prev + 1)
      setCurrentSelection(null)
    }
  }

  const handleAddSkill = () => {
    if (!newSkill.trim()) return

    // Add the new skill to our custom skills list
    setCustomSkills((prev) => [...prev, newSkill.trim()])

    // Reset the input
    setNewSkill("")
    setIsAddingSkill(false)
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setCustomSkills((prev) => prev.filter((skill) => skill !== skillToRemove))

    // If we've removed a skill that was already assessed, remove it from skillLevels
    if (skillLevels[skillToRemove]) {
      const updatedLevels = { ...skillLevels }
      delete updatedLevels[skillToRemove]
      setSkillLevels(updatedLevels)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Skill Assessment</h2>
        <p className="text-muted-foreground">Rate your proficiency in each skill to get personalized recommendations</p>
      </div>

      <div className="flex justify-between items-center text-sm mb-2">
        <span>
          Skill {currentSkillIndex + 1} of {allSkills.length}
        </span>
        <div className="flex items-center gap-2">
          <span>{Math.round(((currentSkillIndex + 1) / allSkills.length) * 100)}% complete</span>
          <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Custom Skill</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input
                    id="skill-name"
                    placeholder="Enter a skill (e.g., React, Python)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-category">Category</Label>
                  <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming_languages">Programming Languages</SelectItem>
                      <SelectItem value="web_development">Web Development</SelectItem>
                      <SelectItem value="databases">Databases</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="data_science">Data Science</SelectItem>
                      <SelectItem value="mobile_development">Mobile Development</SelectItem>
                      <SelectItem value="tools">Tools</SelectItem>
                      <SelectItem value="soft_skills">Soft Skills</SelectItem>
                      <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSkill} className="w-full">
                  Add Skill
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {allSkills.length > 0 ? (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold">How would you rate your proficiency in {currentSkill}?</h3>
                {currentCategory && (
                  <Badge className={getCategoryColor(currentCategory)}>{getCategoryLabel(currentCategory)}</Badge>
                )}
                {customSkills.includes(currentSkill) && (
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={() => handleRemoveSkill(currentSkill)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <RadioGroup value={currentSelection || ""} onValueChange={setCurrentSelection} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner" className="cursor-pointer">
                    <span className="font-medium">Beginner</span>
                    <p className="text-sm text-muted-foreground">I have little to no experience with this skill</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate" className="cursor-pointer">
                    <span className="font-medium">Intermediate</span>
                    <p className="text-sm text-muted-foreground">I have some experience but want to improve further</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced" className="cursor-pointer">
                    <span className="font-medium">Advanced</span>
                    <p className="text-sm text-muted-foreground">I'm proficient and looking for advanced resources</p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Button onClick={handleNext} disabled={!currentSelection || isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Your Roadmap...
              </>
            ) : isLastSkill ? (
              "Complete Assessment"
            ) : (
              "Next Skill"
            )}
          </Button>
        </>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">No skills have been extracted or added. Please add at least one skill to continue.</p>
            <Button onClick={() => setIsAddingSkill(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
