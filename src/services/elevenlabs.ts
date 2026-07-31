/**
 * Modular ElevenLabs Conversational AI Service Integration
 * Prepared for high-fidelity ultra-realistic neural voice streaming.
 */

export interface ElevenLabsConfig {
  apiKey?: string;
  voiceId?: string;
  modelId?: string;
}

export class ElevenLabsService {
  private config: ElevenLabsConfig;

  constructor(config: ElevenLabsConfig = {}) {
    this.config = {
      apiKey: process.env.ELEVENLABS_API_KEY || '',
      voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel default
      modelId: 'eleven_turbo_v2_5',
      ...config,
    };
  }

  public isConfigured(): boolean {
    return Boolean(this.config.apiKey && this.config.apiKey !== '');
  }

  public async generateSpeech(text: string): Promise<ArrayBuffer | null> {
    if (!this.isConfigured()) {
      console.log('ElevenLabs API key not detected. Falling back to native browser speech synthesis.');
      return null;
    }

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.config.apiKey!,
          },
          body: JSON.stringify({
            text,
            model_id: this.config.modelId,
            voice_settings: {
              stability: 0.75,
              similarity_boost: 0.85,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs request failed: ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (err) {
      console.error('ElevenLabs synthesis error:', err);
      return null;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();
