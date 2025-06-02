"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, Youtube, BookOpen, Code, BookMarked, Map } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Resource {
  title: string
  url: string
  description?: string
  thumbnail?: string
  channelTitle?: string
  publishedAt?: string
  displayLink?: string
}

interface Book {
  title: string
  author: string
  url: string
}

interface SkillResources {
  "Skill Level": string
  Category?: string
  "Learning Path": string[]
  "Top YouTube Tutorials": Resource[]
  "Best Learning Websites": Resource[]
  "Practice Platform": Resource
  "Recommended Books": Book[]
}

interface RoadmapResultsProps {
  data: Record<string, SkillResources> | null
}

export function RoadmapResults({ data }: RoadmapResultsProps) {
  const [activeSkill, setActiveSkill] = useState<string | null>(data ? Object.keys(data)[0] : null)
  const [activeTab, setActiveTab] = useState("overview")

  if (!data) {
    return (
      <div className="text-center p-8">
        <p>No roadmap data available. Please complete the previous steps.</p>
      </div>
    )
  }

  const skills = Object.keys(data)
  const currentSkillData = activeSkill ? data[activeSkill] : null

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
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
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
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
    }
    return labels[category] || category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Your Personalized Learning Roadmap</h2>
        <p className="text-muted-foreground">
          Based on your resume and skill assessment, we've created a customized learning path
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Skills</CardTitle>
              <CardDescription>Click on a skill to see recommended resources</CardDescription>
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
                    <div className="ml-auto flex gap-2">
                      {data[skill]["Category"] && (
                        <Badge variant="outline" className={getCategoryColor(data[skill]["Category"] || "")}>
                          {getCategoryLabel(data[skill]["Category"] || "")}
                        </Badge>
                      )}
                      <Badge variant="outline" className={getDifficultyColor(data[skill]["Skill Level"])}>
                        {data[skill]["Skill Level"]}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {currentSkillData ? (
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle>{activeSkill}</CardTitle>
                    <CardDescription>
                      Recommended resources for your {currentSkillData["Skill Level"]} level
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {currentSkillData["Category"] && (
                      <Badge className={getCategoryColor(currentSkillData["Category"])}>
                        {getCategoryLabel(currentSkillData["Category"])}
                      </Badge>
                    )}
                    <Badge className={getDifficultyColor(currentSkillData["Skill Level"])}>
                      {currentSkillData["Skill Level"]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="youtube">Videos</TabsTrigger>
                    <TabsTrigger value="websites">Websites</TabsTrigger>
                    <TabsTrigger value="practice">Practice</TabsTrigger>
                    <TabsTrigger value="books">Books</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-0 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                          <Map className="h-5 w-5" />
                          Learning Path
                        </h3>
                        <ul className="space-y-2 pl-6 list-disc">
                          {currentSkillData["Learning Path"].map((step, index) => (
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
                          <ul className="space-y-2 pl-6 list-disc">
                            {currentSkillData["Top YouTube Tutorials"].slice(0, 2).map((video, index) => (
                              <li key={index}>
                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline text-blue-600 dark:text-blue-400"
                                >
                                  {video.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                            <BookOpen className="h-5 w-5" />
                            Learning Websites
                          </h3>
                          <ul className="space-y-2 pl-6 list-disc">
                            {currentSkillData["Best Learning Websites"].slice(0, 2).map((website, index) => (
                              <li key={index}>
                                <a
                                  href={website.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline text-blue-600 dark:text-blue-400"
                                >
                                  {website.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                          <Code className="h-5 w-5" />
                          Recommended Practice
                        </h3>
                        <div className="pl-6">
                          <a
                            href={currentSkillData["Practice Platform"].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600 dark:text-blue-400"
                          >
                            {currentSkillData["Practice Platform"].title}
                          </a>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentSkillData["Practice Platform"].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="youtube" className="mt-0 space-y-4">
                    {currentSkillData["Top YouTube Tutorials"].map((video, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                          {video.thumbnail && (
                            <div className="flex-shrink-0">
                              <img
                                src={video.thumbnail || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full md:w-40 h-auto rounded-md object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium">{video.title}</h3>
                            {video.channelTitle && (
                              <p className="text-sm text-muted-foreground">Channel: {video.channelTitle}</p>
                            )}
                            {video.description && <p className="text-sm mt-2 line-clamp-2">{video.description}</p>}
                            <div className="mt-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={video.url} target="_blank" rel="noopener noreferrer">
                                  <Youtube className="mr-2 h-4 w-4" />
                                  Watch on YouTube
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="websites" className="mt-0 space-y-4">
                    {currentSkillData["Best Learning Websites"].map((website, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{website.title}</h3>
                          {website.displayLink && (
                            <p className="text-sm text-muted-foreground">Source: {website.displayLink}</p>
                          )}
                          {website.description && <p className="text-sm mt-2">{website.description}</p>}
                          <div className="mt-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={website.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Visit Website
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="practice" className="mt-0">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg">{currentSkillData["Practice Platform"].title}</h3>
                        <p className="text-muted-foreground mt-1">
                          {currentSkillData["Practice Platform"].description}
                        </p>
                        <div className="mt-4">
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
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="books" className="mt-0 space-y-4">
                    {currentSkillData["Recommended Books"] && currentSkillData["Recommended Books"].length > 0 ? (
                      currentSkillData["Recommended Books"].map((book, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <h3 className="font-medium">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">Author: {book.author}</p>
                            <div className="mt-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={book.url} target="_blank" rel="noopener noreferrer">
                                  <BookMarked className="mr-2 h-4 w-4" />
                                  View Book
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center p-4">
                        <p>No specific book recommendations available for this skill and level.</p>
                        <Button className="mt-4" variant="outline" asChild>
                          <a
                            href={`https://www.goodreads.com/search?q=${encodeURIComponent(
                              `${activeSkill} ${currentSkillData["Skill Level"]}`,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <BookMarked className="mr-2 h-4 w-4" />
                            Search on Goodreads
                          </a>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Select a skill to see recommended resources</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download Full Roadmap
        </Button>
      </div>
    </div>
  )
}
