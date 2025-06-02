"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { QuizForm } from "@/components/quiz-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock quiz data - in a real app, you would fetch this from an API
const quizData: Record<string, any> = {
  javascript: {
    skillName: "JavaScript",
    questions: [
      {
        id: "js1",
        text: "What is the correct way to declare a variable in JavaScript?",
        options: [
          { id: "js1a", text: "var x = 5;", isCorrect: false },
          { id: "js1b", text: "let x = 5;", isCorrect: true },
          { id: "js1c", text: "variable x = 5;", isCorrect: false },
          { id: "js1d", text: "int x = 5;", isCorrect: false },
        ],
      },
      {
        id: "js2",
        text: "Which of the following is a JavaScript framework?",
        options: [
          { id: "js2a", text: "Django", isCorrect: false },
          { id: "js2b", text: "Flask", isCorrect: false },
          { id: "js2c", text: "React", isCorrect: true },
          { id: "js2d", text: "Laravel", isCorrect: false },
        ],
      },
      {
        id: "js3",
        text: "What does the '===' operator do in JavaScript?",
        options: [
          { id: "js3a", text: "Assigns a value", isCorrect: false },
          { id: "js3b", text: "Compares values only", isCorrect: false },
          { id: "js3c", text: "Compares values and types", isCorrect: true },
          { id: "js3d", text: "Logical AND operation", isCorrect: false },
        ],
      },
    ],
  },
  python: {
    skillName: "Python",
    questions: [
      {
        id: "py1",
        text: "What is the correct way to declare a list in Python?",
        options: [
          { id: "py1a", text: "list = [1, 2, 3]", isCorrect: true },
          { id: "py1b", text: "list = (1, 2, 3)", isCorrect: false },
          { id: "py1c", text: "list = {1, 2, 3}", isCorrect: false },
          { id: "py1d", text: "array(1, 2, 3)", isCorrect: false },
        ],
      },
      {
        id: "py2",
        text: "Which of the following is a Python web framework?",
        options: [
          { id: "py2a", text: "Express", isCorrect: false },
          { id: "py2b", text: "Django", isCorrect: true },
          { id: "py2c", text: "React", isCorrect: false },
          { id: "py2d", text: "Angular", isCorrect: false },
        ],
      },
      {
        id: "py3",
        text: "What does the 'len()' function do in Python?",
        options: [
          { id: "py3a", text: "Returns the length of an object", isCorrect: true },
          { id: "py3b", text: "Returns the largest item in an iterable", isCorrect: false },
          { id: "py3c", text: "Returns the smallest item in an iterable", isCorrect: false },
          { id: "py3d", text: "Returns the last item in a list", isCorrect: false },
        ],
      },
    ],
  },
  react: {
    skillName: "React",
    questions: [
      {
        id: "r1",
        text: "What is JSX in React?",
        options: [
          { id: "r1a", text: "A database for React", isCorrect: false },
          { id: "r1b", text: "A syntax extension for JavaScript", isCorrect: true },
          { id: "r1c", text: "A React server", isCorrect: false },
          { id: "r1d", text: "A testing framework", isCorrect: false },
        ],
      },
      {
        id: "r2",
        text: "Which hook is used for side effects in React?",
        options: [
          { id: "r2a", text: "useState", isCorrect: false },
          { id: "r2b", text: "useContext", isCorrect: false },
          { id: "r2c", text: "useEffect", isCorrect: true },
          { id: "r2d", text: "useReducer", isCorrect: false },
        ],
      },
      {
        id: "r3",
        text: "What is the correct way to render a list in React?",
        options: [
          { id: "r3a", text: "Using a for loop inside JSX", isCorrect: false },
          { id: "r3b", text: "Using map() function", isCorrect: true },
          { id: "r3c", text: "Using a while loop", isCorrect: false },
          { id: "r3d", text: "Using document.createElement()", isCorrect: false },
        ],
      },
    ],
  },
}

export default function QuizPage() {
  const params = useParams()
  const skill = typeof params.skill === "string" ? params.skill.toLowerCase() : ""
  const [quiz, setQuiz] = useState<any>(null)

  useEffect(() => {
    if (skill && quizData[skill]) {
      setQuiz(quizData[skill])
    }
  }, [skill])

  const handleQuizComplete = (score: number, maxScore: number) => {
    console.log(`Quiz completed with score: ${score}/${maxScore}`)
    // You could redirect to the roadmap page or show additional UI here
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
          <p className="mb-4">Sorry, we couldn't find a quiz for {skill}.</p>
          <Link href="/quizzes">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quizzes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/quizzes">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quizzes
            </Button>
          </Link>
        </div>

        <QuizForm skillName={quiz.skillName} questions={quiz.questions} onComplete={handleQuizComplete} />
      </div>
    </div>
  )
}
