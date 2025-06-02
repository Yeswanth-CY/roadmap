"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { saveQuizResult } from "@/lib/quiz-service"
import { useToast } from "@/hooks/use-toast"

interface Question {
  id: string
  text: string
  options: {
    id: string
    text: string
    isCorrect: boolean
  }[]
}

interface QuizFormProps {
  skillName: string
  questions: Question[]
  onComplete?: (score: number, maxScore: number) => void
}

export function QuizForm({ skillName, questions, onComplete }: QuizFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const { toast } = useToast()

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion.id]: optionId,
    })
  }

  const handleNext = () => {
    if (!selectedOptions[currentQuestion.id]) return

    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Calculate score
      let correctAnswers = 0
      questions.forEach((question) => {
        const selectedOptionId = selectedOptions[question.id]
        const selectedOption = question.options.find((option) => option.id === selectedOptionId)
        if (selectedOption?.isCorrect) {
          correctAnswers++
        }
      })

      const finalScore = correctAnswers
      const maxScore = questions.length

      setScore(finalScore)

      // Save to in-memory storage
      const result = saveQuizResult({
        skillName,
        score: finalScore,
        maxScore,
      })

      if (result.success) {
        toast({
          title: "Quiz completed!",
          description: `Your score: ${finalScore}/${maxScore}`,
        })
        setQuizCompleted(true)

        if (onComplete) {
          onComplete(finalScore, maxScore)
        }
      } else {
        toast({
          title: "Error saving quiz result",
          description: "Please try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
      toast({
        title: "Error submitting quiz",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (quizCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Completed!</CardTitle>
          <CardDescription>
            You scored {score} out of {questions.length} on the {skillName} quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-4xl font-bold mb-2">{Math.round((score / questions.length) * 100)}%</div>
            <p className="text-muted-foreground">
              {score === questions.length
                ? "Perfect score! Excellent work!"
                : score > questions.length / 2
                  ? "Good job! Keep practicing to improve."
                  : "Keep learning and try again soon."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{skillName} Quiz</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-medium text-lg">{currentQuestion.text}</h3>
          <RadioGroup value={selectedOptions[currentQuestion.id] || ""} onValueChange={handleOptionSelect}>
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} disabled={!selectedOptions[currentQuestion.id] || isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isLastQuestion ? (
            "Submit Quiz"
          ) : (
            "Next Question"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
