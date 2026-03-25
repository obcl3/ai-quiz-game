export interface Quiz {
  id: string
  theme: string
  question: string
  options: [string, string, string]
  correctAnswer: 0 | 1 | 2
  explanation: string
  sourceUrl?: string
}

export interface UserProgress {
  [theme: string]: {
    completedQuizzes: string[]
    correctAnswers: number
    totalAttempts: number
    lastAttempt: string
  }
}

export type Theme = 'LLM' | 'Vision' | 'Agent'
