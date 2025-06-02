export interface QuizResult {
  skillName: string
  score: number
  maxScore: number
}

// In-memory storage for the current browser session only
let currentSessionScores: any[] = []

/**
 * Generates a simple session ID if one doesn't exist
 */
export function getSessionId(): string {
  // Check if we already have a session ID in localStorage
  let sessionId = localStorage.getItem("quiz_session_id")

  // If not, create a new one
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substring(2, 15)
    localStorage.setItem("quiz_session_id", sessionId)
  }

  return sessionId
}

/**
 * Saves a quiz result to in-memory storage
 */
export function saveQuizResult(result: QuizResult): { success: boolean; id?: string } {
  try {
    // Generate a simple ID
    const id = Math.random().toString(36).substring(2, 15)

    // Save to in-memory storage
    const scoreRecord = {
      id,
      skill_name: result.skillName,
      score: result.score,
      max_score: result.maxScore,
      completed_at: new Date().toISOString(),
    }

    // Add to current session scores
    currentSessionScores.push(scoreRecord)

    return { success: true, id }
  } catch (err) {
    console.error("Error saving quiz result:", err)
    return { success: false }
  }
}

/**
 * Gets all quiz scores for the current session
 */
export function getSessionQuizScores() {
  return [...currentSessionScores]
}

/**
 * Gets the highest score for each skill
 */
export function getHighestSkillScores() {
  try {
    // If no scores, return mock data
    if (currentSessionScores.length === 0) {
      return getMockQuizScores()
    }

    // Process to get only the highest score per skill
    const highestScores: Record<string, any> = {}
    currentSessionScores.forEach((score) => {
      if (!highestScores[score.skill_name] || score.score > highestScores[score.skill_name].score) {
        highestScores[score.skill_name] = score
      }
    })

    return Object.values(highestScores)
  } catch (error) {
    console.error("Exception fetching highest skill scores:", error)
    return getMockQuizScores()
  }
}

/**
 * Clears all quiz scores for the current session
 */
export function clearQuizScores() {
  currentSessionScores = []
  return true
}

// Mock data for when no scores are available
function getMockQuizScores() {
  return [
    {
      id: "1",
      skill_name: "JavaScript",
      score: 80,
      max_score: 100,
      completed_at: new Date().toISOString(),
    },
    {
      id: "2",
      skill_name: "React",
      score: 65,
      max_score: 100,
      completed_at: new Date().toISOString(),
    },
    {
      id: "3",
      skill_name: "Python",
      score: 90,
      max_score: 100,
      completed_at: new Date().toISOString(),
    },
  ]
}
