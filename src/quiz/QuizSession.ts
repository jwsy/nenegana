import { type Kana } from '../types/kana'

export interface QuizResult {
  kana: Kana
  isCorrect: boolean
  userAnswer?: string
}

export class QuizSession {
  private questions: Kana[]
  private currentIndex: number = 0
  private results: QuizResult[] = []
  private totalQuestions: number

  constructor(kanaList: Kana[], questionCount: number = 5) {
    // Shuffle and slice to desired length
    this.questions = this.shuffleArray([...kanaList]).slice(0, questionCount)
    this.totalQuestions = this.questions.length
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  current(): Kana | null {
    if (this.currentIndex >= this.questions.length) {
      return null
    }
    return this.questions[this.currentIndex]
  }

  recordResult(isCorrect: boolean, userAnswer?: string): void {
    const currentKana = this.current()
    if (!currentKana) {
      throw new Error('No current question to record result for')
    }

    this.results.push({
      kana: currentKana,
      isCorrect,
      userAnswer,
    })
  }

  next(): boolean {
    this.currentIndex++
    return !this.isFinished()
  }

  isFinished(): boolean {
    return this.currentIndex >= this.questions.length
  }

  getResults(): QuizResult[] {
    return [...this.results]
  }

  getScore(): { correct: number; total: number; percentage: number } {
    const correct = this.results.filter((r) => r.isCorrect).length
    const total = this.results.length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

    return { correct, total, percentage }
  }

  getCurrentQuestionNumber(): number {
    return this.currentIndex + 1
  }

  getTotalQuestions(): number {
    return this.totalQuestions
  }

  getMissedKana(): Kana[] {
    return this.results.filter((r) => !r.isCorrect).map((r) => r.kana)
  }
}