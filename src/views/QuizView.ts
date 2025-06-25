import { router } from '../router'

export function createQuizView(): HTMLElement {
  const container = document.createElement('div')
  container.className = 'min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4'

  container.innerHTML = `
    <div class="text-center space-y-8 max-w-sm">
      <h1 class="text-4xl font-bold text-slate-800">Quiz Mode</h1>
      <p class="text-slate-600 text-lg">Quiz mode coming soon!</p>
      
      <button 
        id="home-btn"
        class="py-3 px-6 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
      >
        ← Back to Home
      </button>
    </div>
  `

  // Add event listener
  const homeBtn = container.querySelector('#home-btn') as HTMLButtonElement
  homeBtn.addEventListener('click', () => {
    router.navigate('#/home')
  })

  return container
}