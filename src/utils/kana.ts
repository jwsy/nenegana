import { type Kana, type AppState, defaultAppState } from '../types/kana'
import kanaData from '../data/kana.json'

const STORAGE_KEY = 'neneganaState'

export function getAppState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultAppState, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.warn('Failed to load app state from localStorage:', error)
  }
  return defaultAppState
}

export function saveAppState(state: Partial<AppState>) {
  try {
    const currentState = getAppState()
    const newState = { ...currentState, ...state }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  } catch (error) {
    console.warn('Failed to save app state to localStorage:', error)
  }
}

export function getSelectedKana(): Kana[] {
  const state = getAppState()
  return (kanaData as Kana[]).filter(
    (kana) =>
      state.selectedKanaTypes.includes(kana.type) &&
      state.selectedGroups.includes(kana.group)
  )
}