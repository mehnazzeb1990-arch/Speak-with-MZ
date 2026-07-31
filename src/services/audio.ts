/**
 * Browser Speech Synthesis and Speech Recognition Service
 * Enables real-time human-like English voice conversation in Speak with MZ.
 */

class AudioService {
  private recognition: any = null;
  private isListeningState = false;

  public speak(text: string, options: { gender?: 'female' | 'male'; rate?: number; pitch?: number } = {}): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis is not supported in this browser environment.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // stop current audio

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || (options.gender === 'female' ? 1.1 : 0.95);

      // Select natural English voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
      
      let selectedVoice = englishVoices.find((v) => 
        options.gender === 'female' ? v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Victoria')
        : v.name.toLowerCase().includes('male') || v.name.includes('Daniel') || v.name.includes('Alex')
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
      if (onError) onError('Speech recognition is not supported in your browser. Try Chrome, Edge, or Safari.');
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
        console.warn('Speech recognition event warning:', event.error);
        if (onError && event.error !== 'no-speech') {
          onError(`Speech error: ${event.error}`);
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
}

export const audioService = new AudioService();
