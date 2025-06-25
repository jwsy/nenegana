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
      console.log('Speech recognition: API not found in browser')
      this.setStatus('unsupported')
      this.options.onError?.('Speech recognition not supported in this browser')
      return false
    }

    try {
      console.log('Speech recognition: Creating recognition instance...')
      this.recognition = new SpeechRecognitionConstructor()
      this.setupRecognition()
      console.log('Speech recognition: Successfully initialized')
      return true
    } catch (error) {
      console.log('Speech recognition: Failed to create instance:', error)
      this.setStatus('unsupported')
      this.options.onError?.('Speech recognition not available')
      return false
    }
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
          errorMessage = 'No speech detected. Try speaking more clearly.'
          break
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone and try again.'
          break
        case 'network':
          errorMessage = 'Network error. Please try again.'
          break
        case 'service-not-allowed':
          errorMessage = 'Speech service unavailable. Please try again.'
          break
        case 'bad-grammar':
        case 'language-not-supported':
          errorMessage = 'Language not supported. Use text input instead.'
          this.setStatus('unsupported')
          this.options.onError?.(errorMessage)
          return
        default:
          errorMessage = `Speech error: ${event.error}. Please try again.`
          break
      }

      this.setStatus('error')
      this.options.onError?.(errorMessage)
      this.stop()
      
      // Reset to idle after showing error for 2 seconds
      setTimeout(() => {
        if (this.status === 'error') {
          this.setStatus('idle')
        }
      }, 2000)
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
    console.log('Speech recognition: start() called, status:', this.status)
    
    if (!this.recognition) {
      console.log('Speech recognition: No recognition instance available')
      this.setStatus('unsupported')
      return false
    }

    if (this.status === 'listening') {
      console.log('Speech recognition: Already listening')
      return true
    }

    // Stop any existing recognition first
    if (this.status !== 'idle') {
      console.log('Speech recognition: Stopping existing recognition, status was:', this.status)
      this.stop()
    }

    try {
      console.log('Speech recognition: Attempting to start...')
      this.clearTimeout()
      
      // Set timeout first, then start
      if (this.options.timeout) {
        this.timeoutId = window.setTimeout(() => {
          if (this.status === 'listening') {
            console.log('Speech recognition: Timeout reached')
            this.setStatus('timeout')
            this.stop()
          }
        }, this.options.timeout)
      }

      this.recognition.start()
      console.log('Speech recognition: start() called successfully')
      // Note: Don't set status to 'listening' here - let onstart handle it
      
      return true
    } catch (error) {
      console.log('Speech recognition: start() failed:', error)
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