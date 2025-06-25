import { normalizeTranscript } from './speech'

describe('normalizeTranscript', () => {
  test('converts to lowercase and removes spaces', () => {
    expect(normalizeTranscript('Hello World')).toBe('helloworld')
    expect(normalizeTranscript('A B C')).toBe('abc')
  })

  test('handles Japanese romanization variations', () => {
    // shi/si variations
    expect(normalizeTranscript('shi')).toBe('si')
    expect(normalizeTranscript('SHISHI')).toBe('sisi')
    
    // chi/ti variations
    expect(normalizeTranscript('chi')).toBe('ti')
    expect(normalizeTranscript('chichi')).toBe('titi')
    
    // tsu/tu variations
    expect(normalizeTranscript('tsu')).toBe('tu')
    expect(normalizeTranscript('tsutsu')).toBe('tutu')
    
    // fu/hu variations
    expect(normalizeTranscript('fu')).toBe('hu')
    expect(normalizeTranscript('fufu')).toBe('huhu')
  })

  test('handles complex combinations', () => {
    expect(normalizeTranscript('Shi Chi Tsu Fu')).toBe('sitituhu')
    expect(normalizeTranscript('  shi  chi  ')).toBe('siti')
  })

  test('preserves other characters', () => {
    expect(normalizeTranscript('ka')).toBe('ka')
    expect(normalizeTranscript('na')).toBe('na')
    expect(normalizeTranscript('ra')).toBe('ra')
  })

  test('handles empty and whitespace strings', () => {
    expect(normalizeTranscript('')).toBe('')
    expect(normalizeTranscript('   ')).toBe('')
    expect(normalizeTranscript('\t\n')).toBe('')
  })
})