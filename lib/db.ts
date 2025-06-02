// Database utility for connecting to your database
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with proper error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock implementation for when Supabase is not configured
const mockQuizScores: QuizScore[] = [
  {
    id: "1",
    userId: "user123",
    skillName: "JavaScript",
    score: 80,
    maxScore: 100,
    completedAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "user123",
    skillName: "React",
    score: 65,
    maxScore: 100,
    completedAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "user123",
    skillName: "Python",
    score: 90,
    maxScore: 100,
    completedAt: new Date().toISOString(),
  },
]

// Type definitions for quiz scores
export interface QuizScore {
  id: string
  userId: string
  skillName: string
  score: number
  maxScore: number
  completedAt: string
}

// Create Supabase client only if URL and key are available
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Function to fetch quiz scores for a user
export async function getUserQuizScores(userId: string): Promise<QuizScore[]> {
  // If Supabase is not configured, return mock data
  if (!supabase) {
    console.warn("Supabase not configured. Using mock quiz scores.")
    return mockQuizScores.filter((score) => score.userId === userId)
  }

  try {
    const { data, error } = await supabase
      .from("quiz_scores")
      .select("*")
      .eq("userId", userId)
      .order("completedAt", { ascending: false })

    if (error) {
      console.error("Error fetching quiz scores:", error)
      throw new Error("Failed to fetch quiz scores")
    }

    return data || []
  } catch (error) {
    console.error("Error accessing Supabase:", error)
    // Fallback to mock data in case of any error
    return mockQuizScores.filter((score) => score.userId === userId)
  }
}

// Function to calculate proficiency level based on score percentage
export function calculateProficiencyLevel(score: number, maxScore: number): "beginner" | "intermediate" | "advanced" {
  const percentage = (score / maxScore) * 100

  if (percentage < 40) {
    return "beginner"
  } else if (percentage < 75) {
    return "intermediate"
  } else {
    return "advanced"
  }
}
