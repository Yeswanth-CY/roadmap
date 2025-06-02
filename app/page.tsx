import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RoadmapGenerator } from "@/components/roadmap-generator"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">AI-Powered Career Roadmap Generator</h1>
          <p className="text-xl text-muted-foreground">
            Generate personalized learning roadmaps based on your skill proficiency levels
          </p>
        </section>

        <RoadmapGenerator />
      </main>
      <Footer />
    </div>
  )
}
