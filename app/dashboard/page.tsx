import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, ArrowRight } from "lucide-react"

// Mock data for the dashboard
const savedRoadmaps = [
  {
    id: "1",
    title: "Web Development Roadmap",
    createdAt: "2024-05-15",
    skills: ["JavaScript", "React", "Node.js", "CSS"],
    progress: 35,
  },
  {
    id: "2",
    title: "Data Science Roadmap",
    createdAt: "2024-05-10",
    skills: ["Python", "Machine Learning", "Data Analysis", "SQL"],
    progress: 20,
  },
]

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Your Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Roadmaps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{savedRoadmaps.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Skills Tracked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{new Set(savedRoadmaps.flatMap((r) => r.skills)).size}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.round(savedRoadmaps.reduce((acc, r) => acc + r.progress, 0) / savedRoadmaps.length)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-4">Your Roadmaps</h2>

          <div className="space-y-4">
            {savedRoadmaps.map((roadmap) => (
              <Card key={roadmap.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">{roadmap.title}</h3>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created on {roadmap.createdAt}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {roadmap.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Progress</div>
                        <div className="font-semibold">{roadmap.progress}%</div>
                      </div>
                      <Button>
                        View Roadmap
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
