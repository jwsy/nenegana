import { QuizSession } from './QuizSession'
import { type Kana } from '../types/kana'

const mockKana: Kana[] = [
  { char: 'あ', romaji: 'a', type: 'hiragana', group: 'a' },
  { char: 'い', romaji: 'i', type: 'hiragana', group: 'a' },
  { char: 'う', romaji: 'u', type: 'hiragana', group: 'a' },
  { char: 'え', romaji: 'e', type: 'hiragana', group: 'a' },
  { char: 'お', romaji: 'o', type: 'hiragana', group: 'a' },
  { char: 'か', romaji: 'ka', type: 'hiragana', group: 'ka' },
  { char: 'き', romaji: 'ki', type: 'hiragana', group: 'ka' },
]

describe('QuizSession', () => {
  test('creates quiz with default 5 questions', () => {
    const quiz = new QuizSession(mockKana)
    
    expect(quiz.getTotalQuestions()).toBe(5)
    expect(quiz.getCurrentQuestionNumber()).toBe(1)
    expect(quiz.isFinished()).toBe(false)
    expect(quiz.current()).toBeTruthy()
  })

  test('creates quiz with custom question count', () => {
    const quiz = new QuizSession(mockKana, 3)
    
    expect(quiz.getTotalQuestions()).toBe(3)
  })

  test('limits questions to available kana', () => {
    const limitedKana = mockKana.slice(0, 2)
    const quiz = new QuizSession(limitedKana, 5)
    
    expect(quiz.getTotalQuestions()).toBe(2)
  })

  test('tracks current question correctly', () => {
    const quiz = new QuizSession(mockKana, 3)
    
    expect(quiz.getCurrentQuestionNumber()).toBe(1)
    expect(quiz.current()).toBeTruthy()
    
    quiz.recordResult(true)
    quiz.next()
    
    expect(quiz.getCurrentQuestionNumber()).toBe(2)
    expect(quiz.current()).toBeTruthy()
  })

  test('records results correctly', () => {
    const quiz = new QuizSession(mockKana, 2)
    const firstKana = quiz.current()!
    
    quiz.recordResult(true, 'correct-answer')
    quiz.next()
    
    const secondKana = quiz.current()!
    quiz.recordResult(false, 'wrong-answer')
    quiz.next()
    
    const results = quiz.getResults()
    expect(results).toHaveLength(2)
    expect(results[0]).toEqual({
      kana: firstKana,
      isCorrect: true,
      userAnswer: 'correct-answer',
    })
    expect(results[1]).toEqual({
      kana: secondKana,
      isCorrect: false,
      userAnswer: 'wrong-answer',
    })
  })

  test('calculates score correctly', () => {
    const quiz = new QuizSession(mockKana, 4)
    
    // Answer 3 out of 4 correctly
    quiz.recordResult(true)
    quiz.next()
    quiz.recordResult(true)
    quiz.next()
    quiz.recordResult(false)
    quiz.next()
    quiz.recordResult(true)
    quiz.next()
    
    const score = quiz.getScore()
    expect(score.correct).toBe(3)
    expect(score.total).toBe(4)
    expect(score.percentage).toBe(75)
  })

  test('identifies missed kana', () => {
    const quiz = new QuizSession(mockKana, 3)
    const firstKana = quiz.current()!
    
    quiz.recordResult(false)
    quiz.next()
    
    quiz.recordResult(true)
    quiz.next()
    
    const thirdKana = quiz.current()!
    quiz.recordResult(false)
    quiz.next()
    
    const missedKana = quiz.getMissedKana()
    expect(missedKana).toHaveLength(2)
    expect(missedKana).toContain(firstKana)
    expect(missedKana).toContain(thirdKana)
  })

  test('finishes quiz correctly', () => {
    const quiz = new QuizSession(mockKana, 2)
    
    expect(quiz.isFinished()).toBe(false)
    
    quiz.recordResult(true)
    expect(quiz.next()).toBe(true) // Has more questions
    expect(quiz.isFinished()).toBe(false)
    
    quiz.recordResult(true)
    expect(quiz.next()).toBe(false) // No more questions
    expect(quiz.isFinished()).toBe(true)
    expect(quiz.current()).toBe(null)
  })

  test('throws error when recording result without current question', () => {
    const quiz = new QuizSession(mockKana, 1)
    
    quiz.recordResult(true)
    quiz.next()
    
    expect(() => quiz.recordResult(true)).toThrow(
      'No current question to record result for'
    )
  })
})