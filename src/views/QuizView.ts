import { router } from '../router'
import { getSelectedKana } from '../utils/kana'
import { QuizSession } from '../quiz/QuizSession'

export function createQuizView(): HTMLElement {
  const container = document.createElement('div')
  container.className = 'min-h-screen bg-slate-50 flex flex-col'

  const kanaList = getSelectedKana()
  
  // Check if we have enough kana for a quiz
  if (kanaList.length === 0) {
    return createNoKanaView(container)
  }

  // Create new quiz session
  const quizSession = new QuizSession(kanaList, 5)
  
  return createQuizInterface(container, quizSession)
}

function createNoKanaView(container: HTMLElement): HTMLElement {
  container.innerHTML = `
    <div class="min-h-screen flex flex-col items-center justify-center px-4">
      <div class="text-center space-y-6 max-w-sm">
        <div class="text-6xl mb-4">🪿</div>
        <h1 class="text-2xl font-bold text-slate-800">No Kana Selected</h1>
        <p class="text-slate-600">
          Please select some kana in the settings to start a quiz!
        </p>
        
        <button 
          id="home-btn"
          class="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  `

  const homeBtn = container.querySelector('#home-btn') as HTMLButtonElement
  homeBtn.addEventListener('click', () => router.navigate('#/home'))

  return container
}

function createQuizInterface(container: HTMLElement, quizSession: QuizSession): HTMLElement {
  let hasAnswered = false

  function renderQuizContent() {
    const currentKana = quizSession.current()
    const score = quizSession.getScore()
    
    if (!currentKana || quizSession.isFinished()) {
      return renderQuizComplete(container, quizSession)
    }

    container.innerHTML = `
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-slate-200 px-4 py-3">
        <div class="flex items-center justify-between max-w-2xl mx-auto">
          <button 
            id="home-btn"
            class="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
          >
            <span class="text-xl">←</span>
            <span class="ml-2 font-medium">Home</span>
          </button>
          
          <h1 class="text-xl font-bold text-slate-800">Quiz</h1>
          
          <div class="text-sm text-slate-600">
            ${quizSession.getCurrentQuestionNumber()}/${quizSession.getTotalQuestions()}
          </div>
        </div>
      </header>

      <!-- Quiz Content -->
      <main class="flex-1 flex items-center justify-center px-4 py-8">
        <div class="text-center space-y-8 max-w-md w-full">
          <!-- Score Display -->
          <div class="text-sm text-slate-600">
            Score: ${score.correct}/${score.total}
          </div>

          <!-- Current Kana -->
          <div class="space-y-6">
            <div class="text-8xl font-bold text-slate-800 select-none">
              ${currentKana.char}
            </div>
            
            <p class="text-lg text-slate-600">
              What is the romaji for this character?
            </p>
          </div>

          <!-- Answer Input -->
          <div class="space-y-4">
            <input 
              type="text" 
              id="answer-input"
              class="w-full px-4 py-3 text-lg text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Type your answer..."
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
            
            <button 
              id="submit-btn"
              class="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
              disabled
            >
              Submit Answer
            </button>
          </div>

          <!-- Feedback Area -->
          <div id="feedback" class="min-h-[60px] flex items-center justify-center">
            <!-- Feedback will be shown here -->
          </div>

          <!-- Next Button (hidden initially) -->
          <button 
            id="next-btn"
            class="hidden w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Next Question
          </button>
        </div>
      </main>
    `

    // Event listeners
    const homeBtn = container.querySelector('#home-btn') as HTMLButtonElement
    const answerInput = container.querySelector('#answer-input') as HTMLInputElement
    const submitBtn = container.querySelector('#submit-btn') as HTMLButtonElement
    const nextBtn = container.querySelector('#next-btn') as HTMLButtonElement
    const feedback = container.querySelector('#feedback') as HTMLElement

    homeBtn.addEventListener('click', () => router.navigate('#/home'))

    // Enable submit button when input has content
    answerInput.addEventListener('input', () => {
      const hasInput = answerInput.value.trim().length > 0
      submitBtn.disabled = !hasInput || hasAnswered
    })

    // Submit on Enter key
    answerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !submitBtn.disabled) {
        submitBtn.click()
      }
    })

    // Handle answer submission
    submitBtn.addEventListener('click', () => {
      if (hasAnswered) return

      const userAnswer = answerInput.value.trim().toLowerCase()
      const correctAnswer = currentKana.romaji.toLowerCase()
      const isCorrect = userAnswer === correctAnswer

      // Record result
      quizSession.recordResult(isCorrect, userAnswer)
      hasAnswered = true

      // Show feedback
      if (isCorrect) {
        feedback.innerHTML = `
          <div class="text-green-600 text-lg font-semibold">
            ✅ Correct! "${currentKana.romaji}"
          </div>
        `
      } else {
        feedback.innerHTML = `
          <div class="text-red-600 text-lg font-semibold">
            ❌ Incorrect. The answer is "${currentKana.romaji}"
          </div>
        `
      }

      // Hide submit button, show next button
      submitBtn.classList.add('hidden')
      nextBtn.classList.remove('hidden')
      answerInput.disabled = true
    })

    // Handle next question
    nextBtn.addEventListener('click', () => {
      const hasMore = quizSession.next()
      if (hasMore) {
        hasAnswered = false
        renderQuizContent()
      } else {
        renderQuizComplete(container, quizSession)
      }
    })

    // Focus on input
    setTimeout(() => answerInput.focus(), 100)
  }

  // Start the quiz
  renderQuizContent()
  return container
}

function renderQuizComplete(container: HTMLElement, quizSession: QuizSession): HTMLElement {
  const score = quizSession.getScore()
  const missedKana = quizSession.getMissedKana()

  container.innerHTML = `
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-slate-200 px-4 py-3">
      <div class="flex items-center justify-center max-w-2xl mx-auto">
        <h1 class="text-xl font-bold text-slate-800">Quiz Complete!</h1>
      </div>
    </header>

    <!-- Results -->
    <main class="flex-1 flex items-center justify-center px-4 py-8">
      <div class="text-center space-y-8 max-w-md w-full">
        <!-- Score Badge -->
        <div class="space-y-4">
          <div class="text-6xl font-bold text-slate-800">
            ${score.percentage}%
          </div>
          <div class="text-xl text-slate-600">
            ${score.correct} out of ${score.total} correct
          </div>
        </div>

        <!-- Performance Message -->
        <div class="text-lg">
          ${score.percentage >= 80 
            ? '🎉 Excellent work!' 
            : score.percentage >= 60 
            ? '👍 Good job!' 
            : '💪 Keep practicing!'}
        </div>

        <!-- Missed Kana (if any) -->
        ${missedKana.length > 0 ? `
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-slate-800">Review These:</h3>
            <div class="grid grid-cols-3 gap-3">
              ${missedKana.map(kana => `
                <div class="bg-white rounded-lg p-3 shadow-sm border border-red-200">
                  <div class="text-2xl font-bold text-slate-800">${kana.char}</div>
                  <div class="text-sm text-red-600">${kana.romaji}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="space-y-3">
          <button 
            id="play-again-btn"
            class="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Play Again
          </button>
          
          <button 
            id="home-btn"
            class="w-full py-3 px-6 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  `

  // Event listeners
  const playAgainBtn = container.querySelector('#play-again-btn') as HTMLButtonElement
  const homeBtn = container.querySelector('#home-btn') as HTMLButtonElement

  playAgainBtn.addEventListener('click', () => {
    router.navigate('#/quiz')
  })

  homeBtn.addEventListener('click', () => {
    router.navigate('#/home')
  })

  return container
}