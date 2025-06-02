import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-4">About Our Platform</h1>

          <p className="text-lg text-muted-foreground mb-8">
            Our AI-powered learning roadmap generator creates personalized learning paths based on your resume and skill
            assessment. Here's how it works:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Resume Analysis</CardTitle>
                <CardDescription>We extract skills from your resume using Natural Language Processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Identifies technical skills and technologies</p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Recognizes experience levels from job descriptions</p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Securely processes your data with ISO 27001 compliance</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Assessment</CardTitle>
                <CardDescription>We determine your proficiency through targeted questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Customized questions for each identified skill</p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Self-assessment of beginner, intermediate, or advanced levels</p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Adaptive difficulty based on your responses</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Recommendations</CardTitle>
                <CardDescription>We find the best learning resources using AI and APIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>YouTube tutorials matched to your skill level</p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Online courses from top learning platforms</p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Practice exercises and projects to build experience</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personalized Roadmap</CardTitle>
                <CardDescription>We create a custom learning path just for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>ML-powered ranking of resources by relevance</p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Progression from beginner to advanced concepts</p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Downloadable roadmap for offline reference</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Technology Stack</CardTitle>
              <CardDescription>Powered by modern technologies for reliable performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Frontend</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Next.js for server-side rendering</li>
                    <li>React for interactive UI components</li>
                    <li>Tailwind CSS for responsive design</li>
                    <li>TypeScript for type safety</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Backend</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>YouTube Data API for video recommendations</li>
                    <li>Google Custom Search API for learning resources</li>
                    <li>Python for NLP and ML processing</li>
                    <li>JSON/TXT for skill storage and analytics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
              <CardDescription>Your data privacy and security are our top priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Our system is designed with ISO 27001 compliance in mind, ensuring:</p>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Secure storage of your resume data and extracted skills</p>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Encrypted API communications with external services</p>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Modular design for access control and data separation</p>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>Transparent data usage policies and user consent</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
