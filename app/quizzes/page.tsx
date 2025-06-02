import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronRight } from "lucide-react"

// Available quizzes - in a real app, you would fetch this from an API
const availableQuizzes = [
  {
    id: "javascript",
    name: "JavaScript",
    description: "Test your knowledge of JavaScript fundamentals",
    questionCount: 3,
    estimatedTime: "5 minutes",
  },
  {
    id: "python",
    name: "Python",
    description: "Assess your Python programming skills",
    questionCount: 3,
    estimatedTime: "5 minutes",
  },
  {
    id: "react",
    name: "React",
    description: "Evaluate your understanding of React concepts",
    questionCount: 3,
    estimatedTime: "5 minutes",
  },
]

export default function QuizzesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Skill Assessment Quizzes</h1>
          <p className="text-muted-foreground mb-8">
            Take these quizzes to assess your skill level and get personalized learning recommendations.
          </p>

          <div className="grid gap-6">
            {availableQuizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <CardTitle>{quiz.name}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{quiz.questionCount} questions</span>
                    <span>Estimated time: {quiz.estimatedTime}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/quizzes/${quiz.id}`} className="w-full">
                    <Button className="w-full">
                      Take Quiz
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
