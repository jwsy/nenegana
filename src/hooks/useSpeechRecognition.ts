import { SpeechRecognition, type SpeechStatus, type SpeechResult, normalizeTranscript } from './speech'

export interface UseSpeechRecognitionResult {
  status: SpeechStatus
  transcript: string
  confidence: number
  isListening: boolean
  isSupported: boolean
  start: () => boolean
  stop: () => void
  compareWithAnswer: (expectedAnswer: string) => boolean
}

export function useSpeechRecognition(
  lang: string = 'ja-JP',
  onResult?: (transcript: string, isCorrect: boolean) => void
): UseSpeechRecognitionResult {
  let recognition: SpeechRecognition | null = null
  let currentStatus: SpeechStatus = 'idle'
  let currentTranscript = ''
  let currentConfidence = 0
  let statusChangeCallback: ((status: SpeechStatus) => void) | null = null

  // Initialize recognition
  const init = () => {
    if (recognition) return recognition

    recognition = new SpeechRecognition({
      lang,
      timeout: 3000,
      onResult: (result: SpeechResult) => {
        currentTranscript = result.transcript
        currentConfidence = result.confidence
        
        if (onResult) {
          // Auto-compare functionality is handled in the component
          onResult(result.transcript, false)
        }
        
        statusChangeCallback?.(recognition!.getStatus())
      },
      onStatusChange: (status: SpeechStatus) => {
        currentStatus = status
        statusChangeCallback?.(status)
      },
      onError: (error: string) => {
        // Only log unexpected errors, not network issues which are common
        if (!error.includes('unavailable') && !error.includes('not available')) {
          console.warn('Speech recognition error:', error)
        }
        
        // For common permission errors, provide user-friendly guidance
        if (error.includes('not-allowed') || error.includes('denied')) {
          console.info('Microphone access denied. Please allow microphone access in your browser settings.')
        }
        statusChangeCallback?.(recognition!.getStatus())
      },
    })

    return recognition
  }

  const start = (): boolean => {
    const rec = init()
    return rec.start()
  }

  const stop = (): void => {
    recognition?.stop()
  }

  const compareWithAnswer = (expectedAnswer: string): boolean => {
    if (!currentTranscript) return false
    
    const normalizedTranscript = normalizeTranscript(currentTranscript)
    const normalizedExpected = normalizeTranscript(expectedAnswer)
    
    return normalizedTranscript === normalizedExpected
  }

  const setStatusChangeCallback = (callback: (status: SpeechStatus) => void) => {
    statusChangeCallback = callback
  }

  // Return the interface
  return {
    get status() { return currentStatus },
    get transcript() { return currentTranscript },
    get confidence() { return currentConfidence },
    get isListening() { return currentStatus === 'listening' },
    get isSupported() { return init().isSupported() },
    start,
    stop,
    compareWithAnswer,
    // Internal method for status updates
    _setStatusChangeCallback: setStatusChangeCallback,
  } as UseSpeechRecognitionResult & { _setStatusChangeCallback: (callback: (status: SpeechStatus) => void) => void }
}