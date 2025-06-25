import { getSelectedKana } from './kana'
import { defaultAppState } from '../types/kana'

// Mock localStorage for testing
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: function (key: string) {
    return this.store[key] || null
  },
  setItem: function (key: string, value: string) {
    this.store[key] = value
  },
  clear: function () {
    this.store = {}
  },
}

// @ts-expect-error - Mocking localStorage for testing
global.localStorage = mockLocalStorage

describe('getSelectedKana', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
  })

  test('returns hiragana characters by default', () => {
    const kana = getSelectedKana()
    
    expect(kana.length).toBeGreaterThan(0)
    expect(kana.every((k) => k.type === 'hiragana')).toBe(true)
    expect(kana.every((k) => defaultAppState.selectedGroups.includes(k.group))).toBe(true)
  })

  test('filters by selected groups', () => {
    // Set state to only include 'a' group
    mockLocalStorage.setItem(
      'neneganaState',
      JSON.stringify({ selectedGroups: ['a'] })
    )

    const kana = getSelectedKana()
    
    expect(kana.every((k) => k.group === 'a')).toBe(true)
    expect(kana.length).toBe(5) // Should have 5 'a' group hiragana characters
  })

  test('includes katakana when selected', () => {
    // Set state to include both hiragana and katakana
    mockLocalStorage.setItem(
      'neneganaState',
      JSON.stringify({ 
        selectedKanaTypes: ['hiragana', 'katakana'],
        selectedGroups: ['a'] 
      })
    )

    const kana = getSelectedKana()
    
    expect(kana.some((k) => k.type === 'hiragana')).toBe(true)
    expect(kana.some((k) => k.type === 'katakana')).toBe(true)
    expect(kana.length).toBe(10) // Should have 5 hiragana + 5 katakana 'a' group characters
  })
})