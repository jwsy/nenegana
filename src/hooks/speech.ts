export type SpeechStatus = 'idle' | 'listening' | 'processing' | 'success' | 'error' | 'timeout' | 'unsupported'

export interface SpeechResult {
  transcript: string
  confidence: number
}

export interface SpeechRecognitionOptions {
  lang?: string
  timeout?: number
  onResult?: (result: SpeechResult) => void
  onStatusChange?: (status: SpeechStatus) => void
  onError?: (error: string) => void
}

// Type definitions for Web Speech API
interface SpeechRecognitionAPI {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  length: number
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent {
  error: string
}

declare global {
  interface Window {
    SpeechRecognition?: { new (): SpeechRecognitionAPI }
    webkitSpeechRecognition?: { new (): SpeechRecognitionAPI }
  }
}

export class SpeechRecognition {
  private recognition: SpeechRecognitionAPI | null = null
  private timeoutId: number | null = null
  private status: SpeechStatus = 'idle'
  private options: SpeechRecognitionOptions

  constructor(options: SpeechRecognitionOptions = {}) {
    this.options = {
      lang: 'ja-JP',
      timeout: 3000,
      ...options,
    }

    this.checkSupport()
  }

  private checkSupport(): boolean {
    const SpeechRecognitionConstructor = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition

    if (!SpeechRecognitionConstructor) {
      this.setStatus('unsupported')
      this.options.onError?.('Speech recognition not supported in this browser')
      return false
    }

    this.recognition = new SpeechRecognitionConstructor()
    this.setupRecognition()
    return true
  }

  private setupRecognition(): void {
    if (!this.recognition) return

    this.recognition.lang = this.options.lang || 'ja-JP'
    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.maxAlternatives = 1

    this.recognition.onstart = () => {
      this.setStatus('listening')
    }

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.setStatus('processing')
      
      if (event.results && event.results[0]) {
        const result = event.results[0][0]
        const transcript = result.transcript.trim()
        const confidence = result.confidence || 0

        if (transcript) {
          this.setStatus('success')
          this.options.onResult?.({
            transcript,
            confidence,
          })
          this.stop()
        }
      }
    }

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Speech recognition error'
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access and try again.'
          break
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.'
          break
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone and try again.'
          break
        case 'network':
          errorMessage = 'Network error. Please check your connection and try again.'
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }

      this.setStatus('error')
      this.options.onError?.(errorMessage)
      this.stop()
    }

    this.recognition.onend = () => {
      if (this.status === 'listening') {
        this.setStatus('timeout')
      }
      this.clearTimeout()
    }
  }

  private setStatus(status: SpeechStatus): void {
    this.status = status
    this.options.onStatusChange?.(status)
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  start(): boolean {
    if (!this.recognition) {
      this.setStatus('unsupported')
      return false
    }

    if (this.status === 'listening') {
      return true
    }

    // Stop any existing recognition first
    if (this.status !== 'idle') {
      this.stop()
    }

    try {
      this.clearTimeout()
      
      // Set timeout first, then start
      if (this.options.timeout) {
        this.timeoutId = window.setTimeout(() => {
          if (this.status === 'listening') {
            this.setStatus('timeout')
            this.stop()
          }
        }, this.options.timeout)
      }

      this.recognition.start()
      // Note: Don't set status to 'listening' here - let onstart handle it
      
      return true
    } catch (error) {
      this.clearTimeout()
      this.setStatus('error')
      
      // Provide more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to start speech recognition'
      this.options.onError?.(errorMessage)
      return false
    }
  }

  stop(): void {
    this.clearTimeout()
    
    if (this.recognition && (this.status === 'listening' || this.status === 'processing')) {
      try {
        this.recognition.stop()
      } catch (error) {
        // Ignore stop errors
      }
    }
    
    if (this.status === 'listening' || this.status === 'processing') {
      this.setStatus('idle')
    }
  }

  getStatus(): SpeechStatus {
    return this.status
  }

  isSupported(): boolean {
    return this.recognition !== null
  }
}

// Utility function to normalize transcript for comparison
export function normalizeTranscript(transcript: string): string {
  return transcript
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    // Handle common Japanese romanization variations
    .replace(/shi/g, 'si')    // Allow both shi and si
    .replace(/chi/g, 'ti')    // Allow both chi and ti  
    .replace(/tsu/g, 'tu')    // Allow both tsu and tu
    .replace(/fu/g, 'hu')     // Allow both fu and hu
}