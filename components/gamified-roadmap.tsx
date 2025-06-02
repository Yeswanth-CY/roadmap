"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Award,
  BookOpen,
  CheckCircle2,
  Code,
  Download,
  ExternalLink,
  Flag,
  Flame,
  Gift,
  GraduationCap,
  type LucideIcon,
  Map,
  Medal,
  Share2,
  Star,
  Trophy,
  Youtube,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GamifiedRoadmapProps {
  data: any
  userScores: Array<{ skill: string; score: number; maxScore: number }>
}

export function GamifiedRoadmap({ data, userScores }: GamifiedRoadmapProps) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [completedResources, setCompletedResources] = useState<string[]>([])
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [showAchievement, setShowAchievement] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState({ title: "", description: "" })
  const { toast } = useToast()

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setActiveSkill(Object.keys(data)[0])
    }
  }, [data])

  useEffect(() => {
    // Calculate level based on earned points
    const newLevel = Math.floor(earnedPoints / 100) + 1
    if (newLevel > level) {
      setLevel(newLevel)
      setCurrentAchievement({
        title: `Level ${newLevel} Achieved!`,
        description: `You've reached level ${newLevel} on your learning journey!`,
      })
      setShowAchievement(true)
      setTimeout(() => setShowAchievement(false), 3000)
    }
  }, [earnedPoints, level])

  const handleResourceComplete = (resourceId: string, points: number) => {
    if (!completedResources.includes(resourceId)) {
      setCompletedResources([...completedResources, resourceId])
      setEarnedPoints(earnedPoints + points)

      toast({
        title: `+${points} XP`,
        description: "Resource marked as completed",
      })
    } else {
      setCompletedResources(completedResources.filter((id) => id !== resourceId))
      setEarnedPoints(Math.max(0, earnedPoints - points))

      toast({
        title: `-${points} XP`,
        description: "Resource marked as incomplete",
      })
    }
  }

  const handleShare = () => {
    toast({
      title: "Sharing your roadmap",
      description: "This feature would share your progress with others",
    })
  }

  const handleDownload = () => {
    try {
      // Create a text representation of the roadmap
      let roadmapText = "# YOUR PERSONALIZED LEARNING ROADMAP\n\n"

      // Add user info
      roadmapText += `Level: ${level}\n`
      roadmapText += `XP: ${earnedPoints}\n`
      roadmapText += `Progress: ${Math.round(progressPercentage)}%\n\n`

      // Add skills and resources
      Object.keys(data).forEach((skill) => {
        const skillData = data[skill]
        roadmapText += `## ${skill.toUpperCase()} (${skillData["Skill Level"]})\n\n`

        // Add learning path
        roadmapText += "### Learning Path:\n"
        skillData["Learning Path"].forEach((step: string, i: number) => {
          roadmapText += `${i + 1}. ${step}\n`
        })
        roadmapText += "\n"

        // Add YouTube tutorials
        roadmapText += "### Top YouTube Tutorials:\n"
        skillData["Top YouTube Tutorials"].forEach((video: any, i: number) => {
          const resourceId = `video-${skill}-${i}`
          const isCompleted = completedResources.includes(resourceId)
          roadmapText += `${i + 1}. ${video.title} ${isCompleted ? "[COMPLETED]" : ""}\n   ${video.url}\n`
        })
        roadmapText += "\n"

        // Add learning websites
        roadmapText += "### Best Learning Websites:\n"
        skillData["Best Learning Websites"].forEach((website: any, i: number) => {
          const resourceId = `website-${skill}-${i}`
          const isCompleted = completedResources.includes(resourceId)
          roadmapText += `${i + 1}. ${website.title} ${isCompleted ? "[COMPLETED]" : ""}\n   ${website.url}\n`
        })
        roadmapText += "\n"

        // Add practice platform
        roadmapText += "### Practice Platform:\n"
        const practiceResourceId = `practice-${skill}`
        const isPracticeCompleted = completedResources.includes(practiceResourceId)
        roadmapText += `- ${skillData["Practice Platform"].title} ${isPracticeCompleted ? "[COMPLETED]" : ""}\n`
        roadmapText += `  ${skillData["Practice Platform"].url}\n\n`
      })

      // Create a blob and download link
      const blob = new Blob([roadmapText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "my-learning-roadmap.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Roadmap downloaded",
        description: "Your roadmap has been downloaded as a text file",
      })
    } catch (error) {
      console.error("Error downloading roadmap:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading your roadmap",
        variant: "destructive",
      })
    }
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>No roadmap data available. Please submit your skill scores first.</p>
        </CardContent>
      </Card>
    )
  }

  if (!activeSkill) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading your personalized roadmap...</p>
        </CardContent>
      </Card>
    )
  }

  const currentSkillData = data[activeSkill]
  const skills = Object.keys(data)

  const totalResources = skills.reduce((acc, skill) => {
    const skillData = data[skill]
    return acc + skillData["Top YouTube Tutorials"].length + skillData["Best Learning Websites"].length + 1 // Practice platform
  }, 0)

  const progressPercentage = (completedResources.length / totalResources) * 100
  const pointsToNextLevel = level * 100 - earnedPoints

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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
    <div className="space-y-6">
      {showAchievement && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg text-center animate-bounce">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <h2 className="text-xl font-bold">{currentAchievement.title}</h2>
            <p className="text-muted-foreground">{currentAchievement.description}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Your Learning Roadmap
          </h2>
          <p className="text-muted-foreground">Personalized learning path based on your skill levels</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Level {level}</span>
                    <span className="text-sm font-medium">{earnedPoints} XP</span>
                  </div>
                  <Progress value={earnedPoints % 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {pointsToNextLevel} XP to level {level + 1}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Roadmap Progress</span>
                    <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedResources.length} of {totalResources} resources completed
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Achievements</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <AchievementBadge icon={Flame} title="Starter" unlocked={true} />
                    <AchievementBadge icon={Medal} title="Consistent" unlocked={completedResources.length >= 5} />
                    <AchievementBadge icon={Award} title="Expert" unlocked={level >= 3} />
                    <AchievementBadge icon={Star} title="All-Star" unlocked={completedResources.length >= 10} />
                    <AchievementBadge icon={Flag} title="Finisher" unlocked={progressPercentage >= 80} />
                    <AchievementBadge icon={Gift} title="Collector" unlocked={skills.length >= 4} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Skills</CardTitle>
              <CardDescription>Click on a skill to see resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <Button
                    key={skill}
                    variant={activeSkill === skill ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveSkill(skill)
                      setActiveTab("overview")
                    }}
                  >
                    <span className="truncate">{skill}</span>
                    <Badge variant="outline" className={`ml-auto ${getDifficultyColor(data[skill]["Skill Level"])}`}>
                      {data[skill]["Skill Level"]}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle>{activeSkill}</CardTitle>
                  <CardDescription>
                    Recommended resources for your {currentSkillData["Skill Level"]} level
                  </CardDescription>
                </div>
                <Badge className={getDifficultyColor(currentSkillData["Skill Level"])}>
                  {currentSkillData["Skill Level"]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="websites">Websites</TabsTrigger>
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                        <Map className="h-5 w-5" />
                        Learning Path
                      </h3>
                      <ul className="space-y-2 pl-6 list-disc">
                        {currentSkillData["Learning Path"].map((step: string, index: number) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                          <Youtube className="h-5 w-5" />
                          Top Videos
                        </h3>
                        <ul className="space-y-2 pl-6">
                          {currentSkillData["Top YouTube Tutorials"].slice(0, 2).map((video: any, index: number) => {
                            const resourceId = `video-${activeSkill}-${index}`
                            const isCompleted = completedResources.includes(resourceId)

                            return (
                              <li key={index} className="flex items-start gap-2">
                                <button
                                  onClick={() => handleResourceComplete(resourceId, 20)}
                                  className={`mt-0.5 flex-shrink-0 ${isCompleted ? "text-green-500" : "text-muted-foreground"}`}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`hover:underline text-blue-600 dark:text-blue-400 ${isCompleted ? "line-through opacity-70" : ""}`}
                                >
                                  {video.title}
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                          <BookOpen className="h-5 w-5" />
                          Learning Websites
                        </h3>
                        <ul className="space-y-2 pl-6">
                          {currentSkillData["Best Learning Websites"].slice(0, 2).map((website: any, index: number) => {
                            const resourceId = `website-${activeSkill}-${index}`
                            const isCompleted = completedResources.includes(resourceId)

                            return (
                              <li key={index} className="flex items-start gap-2">
                                <button
                                  onClick={() => handleResourceComplete(resourceId, 25)}
                                  className={`mt-0.5 flex-shrink-0 ${isCompleted ? "text-green-500" : "text-muted-foreground"}`}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                                <a
                                  href={website.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`hover:underline text-blue-600 dark:text-blue-400 ${isCompleted ? "line-through opacity-70" : ""}`}
                                >
                                  {website.title}
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                        <Code className="h-5 w-5" />
                        Recommended Practice
                      </h3>
                      <div className="pl-6 flex items-start gap-2">
                        {(() => {
                          const resourceId = `practice-${activeSkill}`
                          const isCompleted = completedResources.includes(resourceId)

                          return (
                            <>
                              <button
                                onClick={() => handleResourceComplete(resourceId, 30)}
                                className={`mt-0.5 flex-shrink-0 ${isCompleted ? "text-green-500" : "text-muted-foreground"}`}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                              <div>
                                <a
                                  href={currentSkillData["Practice Platform"].url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`hover:underline text-blue-600 dark:text-blue-400 ${isCompleted ? "line-through opacity-70" : ""}`}
                                >
                                  {currentSkillData["Practice Platform"].title}
                                </a>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {currentSkillData["Practice Platform"].description}
                                </p>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="videos" className="mt-0 space-y-4">
                  {currentSkillData["Top YouTube Tutorials"].map((video: any, index: number) => {
                    const resourceId = `video-${activeSkill}-${index}`
                    const isCompleted = completedResources.includes(resourceId)

                    return (
                      <Card key={index}>
                        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                          {video.thumbnail && (
                            <div className="flex-shrink-0">
                              <img
                                src={video.thumbnail || "/placeholder.svg?height=90&width=160"}
                                alt={video.title}
                                className="w-full md:w-40 h-auto rounded-md object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => handleResourceComplete(resourceId, 20)}
                                className={`mt-0.5 flex-shrink-0 ${isCompleted ? "text-green-500" : "text-muted-foreground"}`}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                              <div>
                                <h3 className={`font-medium ${isCompleted ? "line-through opacity-70" : ""}`}>
                                  {video.title}
                                </h3>
                                {video.channelTitle && (
                                  <p className="text-sm text-muted-foreground">Channel: {video.channelTitle}</p>
                                )}
                                {video.description && <p className="text-sm mt-2 line-clamp-2">{video.description}</p>}
                                <div className="mt-2 flex items-center justify-between">
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                                      <Youtube className="mr-2 h-4 w-4" />
                                      Watch on YouTube
                                    </a>
                                  </Button>
                                  {isCompleted && (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    >
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </TabsContent>

                <TabsContent value="websites" className="mt-0 space-y-4">
                  {currentSkillData["Best Learning Websites"].map((website: any, index: number) => {
                    const resourceId = `website-${activeSkill}-${index}`
                    const isCompleted = completedResources.includes(resourceId)

                    return (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => handleResourceComplete(resourceId, 25)}
                              className={`mt-0.5 flex-shrink-0 ${isCompleted ? "text-green-500" : "text-muted-foreground"}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <div className="flex-1">
                              <h3 className={`font-medium ${isCompleted ? "line-through opacity-70" : ""}`}>
                                {website.title}
                              </h3>
                              {website.displayLink && (
                                <p className="text-sm text-muted-foreground">Source: {website.displayLink}</p>
                              )}
                              {website.description && <p className="text-sm mt-2">{website.description}</p>}
                              <div className="mt-2 flex items-center justify-between">
                                <Button size="sm" variant="outline" asChild>
                                  <a href={website.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visit Website
                                  </a>
                                </Button>
                                {isCompleted && (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  >
                                    Completed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </TabsContent>

                <TabsContent value="practice" className="mt-0">
                  <Card>
                    <CardContent className="p-4">
                      {(() => {
                        const resourceId = `practice-${activeSkill}`
                        const isCompleted = completedResources.includes(resourceId)

                        return (
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => handleResourceComplete(resourceId, 30)}
                              className={`mt-0.5 flex-shrink-0 ${isCompleted ? "text-green-500" : "text-muted-foreground"}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <div className="flex-1">
                              <h3 className={`font-medium text-lg ${isCompleted ? "line-through opacity-70" : ""}`}>
                                {currentSkillData["Practice Platform"].title}
                              </h3>
                              <p className="text-muted-foreground mt-1">
                                {currentSkillData["Practice Platform"].description}
                              </p>
                              <div className="mt-4 flex items-center justify-between">
                                <Button asChild>
                                  <a
                                    href={currentSkillData["Practice Platform"].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Code className="mr-2 h-4 w-4" />
                                    Start Practicing
                                  </a>
                                </Button>
                                {isCompleted && (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  >
                                    Completed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface AchievementBadgeProps {
  icon: LucideIcon
  title: string
  unlocked: boolean
}

function AchievementBadge({ icon: Icon, title, unlocked }: AchievementBadgeProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-2 rounded-lg border ${
        unlocked
          ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950"
          : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 opacity-50"
      }`}
      title={unlocked ? `Achievement Unlocked: ${title}` : `Locked Achievement: ${title}`}
    >
      <Icon className={`h-6 w-6 ${unlocked ? "text-yellow-500" : "text-gray-400"}`} />
      <span className="text-xs mt-1 text-center font-medium">{title}</span>
    </div>
  )
}
