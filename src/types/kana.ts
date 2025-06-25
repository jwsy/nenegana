export interface Kana {
  char: string
  romaji: string
  type: 'hiragana' | 'katakana'
  group: string
}

export interface AppState {
  route: string
  showRomaji: boolean
  selectedKanaTypes: ('hiragana' | 'katakana')[]
  selectedGroups: string[]
}

export const defaultAppState: AppState = {
  route: '#/home',
  showRomaji: true,
  selectedKanaTypes: ['hiragana'],
  selectedGroups: ['a', 'ka', 'sa', 'ta', 'na'],
}