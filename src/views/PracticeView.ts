import { router } from '../router'
import { getSelectedKana, getAppState, saveAppState } from '../utils/kana'
import { type Kana } from '../types/kana'

export function createPracticeView(): HTMLElement {
  const container = document.createElement('div')
  container.className = 'min-h-screen bg-slate-50 flex flex-col'

  const state = getAppState()
  const kanaList = getSelectedKana()

  container.innerHTML = `
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-slate-200 px-4 py-3">
      <div class="flex items-center justify-between max-w-4xl mx-auto">
        <button 
          id="home-btn"
          class="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
        >
          <span class="text-xl">←</span>
          <span class="ml-2 font-medium">Home</span>
        </button>
        
        <h1 class="text-xl font-bold text-slate-800">Practice</h1>
        
        <button 
          id="romaji-toggle"
          class="px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            state.showRomaji
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }"
        >
          ${state.showRomaji ? 'Hide' : 'Show'} Romaji
        </button>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 px-4 py-6">
      <div class="max-w-4xl mx-auto">
        <!-- Info -->
        <div class="text-center mb-6">
          <p class="text-slate-600">
            Tap any kana to see details • ${kanaList.length} characters
          </p>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3" id="kana-grid">
          ${kanaList
            .map(
              (kana, index) => `
            <button 
              class="kana-card aspect-square bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col items-center justify-center text-center p-2"
              data-index="${index}"
            >
              <div class="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
                ${kana.char}
              </div>
              ${
                state.showRomaji
                  ? `<div class="text-xs text-slate-500 font-medium">${kana.romaji}</div>`
                  : ''
              }
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div id="modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 hidden">
      <div class="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
        <div id="modal-content">
          <!-- Dynamic content will be inserted here -->
        </div>
        <button 
          id="modal-close"
          class="mt-4 px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  `

  // Event listeners
  const homeBtn = container.querySelector('#home-btn') as HTMLButtonElement
  const romajiToggle = container.querySelector('#romaji-toggle') as HTMLButtonElement
  const modal = container.querySelector('#modal') as HTMLElement
  const modalContent = container.querySelector('#modal-content') as HTMLElement
  const modalClose = container.querySelector('#modal-close') as HTMLButtonElement
  const kanaGrid = container.querySelector('#kana-grid') as HTMLElement

  homeBtn.addEventListener('click', () => {
    router.navigate('#/home')
  })

  romajiToggle.addEventListener('click', () => {
    const newShowRomaji = !state.showRomaji
    saveAppState({ showRomaji: newShowRomaji })
    // Refresh the view
    router.navigate('#/practice')
  })

  kanaGrid.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const card = target.closest('.kana-card') as HTMLButtonElement
    if (card) {
      const index = parseInt(card.dataset.index || '0')
      const kana = kanaList[index]
      showKanaModal(kana, modalContent)
      modal.classList.remove('hidden')
    }
  })

  modalClose.addEventListener('click', () => {
    modal.classList.add('hidden')
  })

  // Close modal on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden')
    }
  })

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden')
    }
  })

  return container
}

function showKanaModal(kana: Kana, modalContent: HTMLElement) {
  modalContent.innerHTML = `
    <div class="space-y-4">
      <!-- Large Kana with animation -->
      <div class="text-6xl font-bold text-slate-800 goose-wink">
        ${kana.char}
      </div>
      
      <!-- Romaji -->
      <div class="text-2xl font-semibold text-blue-600">
        ${kana.romaji}
      </div>
      
      <!-- Details -->
      <div class="text-sm text-slate-600 space-y-1">
        <div>Type: <span class="font-medium capitalize">${kana.type}</span></div>
        <div>Group: <span class="font-medium">${kana.group}</span></div>
      </div>
      
      <!-- Goose -->
      <div class="text-4xl goose-wink">🪿</div>
    </div>
  `
}