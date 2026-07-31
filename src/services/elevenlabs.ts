/**
 * Modular ElevenLabs Conversational AI Service Integration
 * Prepared for high-fidelity ultra-realistic neural voice streaming.
 */

import { DEFAULT_AI_VOICE } from '../config/voice';

export interface ElevenLabsConfig {
  apiKey?: string;
  voiceId?: string;
  modelId?: string;
}

export class ElevenLabsService {
  private config: ElevenLabsConfig;
  private currentAudio: HTMLAudioElement | null = null;

  constructor(config: ElevenLabsConfig = {}) {
    this.config = {
      apiKey: process.env.ELEVENLABS_API_KEY || '',
      voiceId: DEFAULT_AI_VOICE.voice,
      modelId: 'eleven_turbo_v2_5',
      ...config,
    };
  }

  public setVoiceId(voiceId: string) {
    this.config.voiceId = voiceId;
  }

  public getVoiceId(): string {
    return this.config.voiceId || DEFAULT_AI_VOICE.voice;
  }

  public isConfigured(): boolean {
    return Boolean(this.config.apiKey && this.config.apiKey !== '');
  }

  public stopPlayback(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Synthesize speech via backend API (/api/elevenlabs/tts) or direct fetch
   */
  public async speakText(text: string, voiceId?: string, volume = 1.0, speed = 1.0): Promise<boolean> {
    this.stopPlayback();
    const targetVoiceId = voiceId || this.config.voiceId || DEFAULT_AI_VOICE.voice;

    try {
      const res = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: targetVoiceId,
          modelId: this.config.modelId,
        }),
      });

      if (!res.ok) {
        return false;
      }

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        if (json.fallback) {
          return false; // Signals caller to use Web Speech API fallback
        }
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return new Promise((resolve) => {
        const audio = new Audio(audioUrl);
        audio.volume = Math.max(0, Math.min(1, volume));
        audio.playbackRate = Math.max(0.5, Math.min(2.0, speed));
        this.currentAudio = audio;

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve(true);
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve(false);
        };

        audio.play().catch(() => resolve(false));
      });
    } catch (err) {
      console.warn('ElevenLabs TTS playback error, will use fallback:', err);
      return false;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();
