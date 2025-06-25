import { router } from '../router'

export function createHomeView(): HTMLElement {
  const container = document.createElement('div')
  container.className = 'min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4'

  container.innerHTML = `
    <div class="text-center space-y-8 max-w-sm">
      <!-- Goose Image -->
      <div class="mb-8">
        <img 
          src="/goose.png" 
          alt="Nene the Goose - Nenegana mascot" 
          class="w-32 h-32 mx-auto rounded-full shadow-lg"
        />
      </div>
      
      <!-- Title -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-slate-800">Nenegana</h1>
        <p class="text-slate-600 text-lg">Learn Japanese kana with Nene! 🪿</p>
      </div>
      
      <!-- Navigation Buttons -->
      <div class="space-y-4 w-full">
        <button 
          id="practice-btn"
          class="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          Practice
        </button>
        
        <button 
          id="quiz-btn"
          class="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white text-xl font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          Quiz
        </button>
      </div>
    </div>
  `

  // Add event listeners
  const practiceBtn = container.querySelector('#practice-btn') as HTMLButtonElement
  const quizBtn = container.querySelector('#quiz-btn') as HTMLButtonElement

  practiceBtn.addEventListener('click', () => {
    router.navigate('#/practice')
  })

  quizBtn.addEventListener('click', () => {
    router.navigate('#/quiz')
  })

  return container
}