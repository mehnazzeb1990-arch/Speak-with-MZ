import { elevenLabsService } from './elevenlabs';
import { DEFAULT_AI_VOICE } from '../config/voice';

/**
 * Sanitizes input text for clean TTS speech generation, stripping IPA notations, 
 * intonation symbols, and hyphens in syllable stress representations (e.g., pho-to-GRAPH-ic -> photographic).
 */
export function sanitizeTextForSpeech(text: string): string {
  if (!text) return '';
  let cleaned = text;

  // Remove IPA slashed blocks like /.../
  cleaned = cleaned.replace(/\/[^/]+\//g, '');

  // Remove pitch/intonation symbols
  cleaned = cleaned.replace(/[↗↘→]/g, ' ');

  // If text is hyphenated syllable notation like "PHO-to-graph" or "pho-to-GRAPH-ic", convert hyphens to clean words
  if (/^[A-Za-z]+(-[A-Za-z]+)+$/.test(cleaned.trim())) {
    cleaned = cleaned.replace(/-/g, '');
  }

  // Remove surrounding quotes
  cleaned = cleaned.replace(/^["'“]|["'”]$/g, '');

  // Collapse spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned || text;
}

/**
 * Integrated Speech Synthesis and Speech Recognition Service for Speak with MZ.
 * Combines ElevenLabs Conversational Voice API with Browser Speech Recognition & Web Speech API fallback.
 */

class AudioService {
  private recognition: any = null;
  private isListeningState = false;

  public async speak(
    text: string,
    options: {
      gender?: 'female' | 'male';
      rate?: number;
      pitch?: number;
      volume?: number;
      voiceId?: string;
      useElevenLabs?: boolean;
    } = {}
  ): Promise<void> {
    const volume = options.volume !== undefined ? options.volume : 1.0;
    const rate = options.rate || 1.0;

    // Sanitize text for accurate speech synthesis (removes hyphens, IPA slashes, arrows)
    const cleanSpeechText = sanitizeTextForSpeech(text);

    // Stop ongoing speech
    this.stopSpeaking();

    // Try ElevenLabs Neural Speech synthesis first if specified or available
    if (options.useElevenLabs !== false) {
      const success = await elevenLabsService.speakText(
        cleanSpeechText,
        options.voiceId || elevenLabsService.getVoiceId() || DEFAULT_AI_VOICE.voice,
        volume,
        rate
      );
      if (success) {
        return;
      }
    }

    // High quality Browser Web Speech API fallback
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis is not supported in this browser environment.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
      utterance.rate = rate;
      utterance.volume = Math.max(0, Math.min(1, volume));
      utterance.pitch = options.pitch || 1.05;

      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
      
      let selectedVoice = englishVoices.find((v) => 
        v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Victoria') || v.name.includes('Google US English') || v.name.includes('Zira')
      );

      if (!selectedVoice && englishVoices.length > 0) {
        selectedVoice = englishVoices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  public stopSpeaking(): void {
    elevenLabsService.stopPlayback();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): boolean {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      if (onError) onError('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return false;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListeningState = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript, true);
        } else if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          if (onError) onError('Microphone access was denied. Please check browser microphone permissions.');
        } else if (event.error === 'network') {
          if (onError) onError('Network error during speech recognition. Please check your connection.');
        } else if (onError && event.error !== 'no-speech') {
          onError(`Speech recognition error: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        this.isListeningState = false;
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      if (onError) onError(e.message || 'Failed to start speech recognition.');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
      this.isListeningState = false;
    }
  }

  public isListening(): boolean {
    return this.isListeningState;
  }

  public async getAvailableMicrophones(): Promise<MediaDeviceInfo[]> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return [];
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((d) => d.kind === 'audioinput');
    } catch {
      return [];
    }
  }
}

export const audioService = new AudioService();
