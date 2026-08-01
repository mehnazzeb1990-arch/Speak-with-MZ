import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { audioService } from '../../services/audio';
import { elevenLabsService } from '../../services/elevenlabs';
import { DEFAULT_AI_VOICE } from '../../config/voice';
import { Settings, Moon, Sun, Volume2, Mic, Shield, Sliders, CheckCircle2, Play, Trash2, Download, RefreshCw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [selectedVoice, setSelectedVoice] = useState<string>(
    elevenLabsService.getVoiceId() || DEFAULT_AI_VOICE.voice
  );
  const [speed, setSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(100);
  const [feedbackLevel, setFeedbackLevel] = useState<'gentle' | 'balanced' | 'strict'>('balanced');
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    audioService.getAvailableMicrophones().then((mics) => {
      setMicrophones(mics);
      if (mics.length > 0) setSelectedMic(mics[0].deviceId);
    });
  }, []);

  const handleTestVoice = async () => {
    await audioService.speak(
      "Hello! This is a test of your selected AI partner voice in Speak with MZ. How does it sound to you?",
      {
        voiceId: selectedVoice,
        rate: speed,
        volume: volume / 100,
      }
    );
  };

  const handleSaveSettings = () => {
    elevenLabsService.setVoiceId(selectedVoice);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-[#DCEDE9] text-[#0F766E]">
            <Settings className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#134E4A]">AI Studio & Voice Settings</h1>
        </div>
        <p className="text-sm text-teal-800/70 mt-1 font-medium">
          Customize ElevenLabs AI voice parameters, microphone inputs, and feedback levels.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-[#E6F1EF] border border-[#CBDED9] shadow-sm space-y-8">
        
        {/* ElevenLabs AI Partner Voice Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-[#0F766E]" />
              <h3 className="font-bold text-base text-[#134E4A]">AI Partner Neural Voice (ElevenLabs)</h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
              Default Voice (nDJIICjR9zfJExIFeSCN)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'nDJIICjR9zfJExIFeSCN', name: 'MZ Natural American', desc: 'Default warm & articulate partner' },
              { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel Conversational', desc: 'Empathetic & gentle British tone' },
              { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi Energetic', desc: 'Upbeat & encouraging speed' },
              { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella Professional', desc: 'Formal business & academic tone' },
            ].map((voice) => (
              <button
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className={`p-4 rounded-2xl text-left border transition-all flex items-start justify-between cursor-pointer ${
                  selectedVoice === voice.id
                    ? 'bg-[#DCEDE9] border-[#0F766E] ring-2 ring-[#0F766E]/30'
                    : 'bg-[#F3F7F6] border-[#CBDED9] hover:border-[#0F766E]/50'
                }`}
              >
                <div>
                  <p className="font-bold text-sm text-[#134E4A]">{voice.name}</p>
                  <p className="text-xs text-teal-800/70 mt-0.5">{voice.desc}</p>
                  <span className="inline-block mt-2 font-mono text-[10px] text-teal-800/50">{voice.id}</span>
                </div>
                {selectedVoice === voice.id && (
                  <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleTestVoice}
              className="px-4 py-2 rounded-xl bg-[#DCEDE9] text-[#0F766E] hover:bg-teal-100 font-bold text-xs flex items-center space-x-1.5 cursor-pointer border border-[#CBDED9]"
            >
              <Play className="w-4 h-4 fill-[#0F766E]" />
              <span>Test Voice Sample</span>
            </button>
          </div>
        </div>

        {/* Audio Output Parameters */}
        <div className="border-t border-[#CBDED9] pt-6 space-y-4">
          <h3 className="font-bold text-sm text-[#134E4A] flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#0F766E]" />
            <span>Audio Speed & Volume</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#134E4A] flex justify-between">
                <span>Speaking Rate</span>
                <span className="text-[#0F766E]">{speed}x</span>
              </label>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#0F766E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-teal-800/60 font-medium">
                <span>0.75x (Slower)</span>
                <span>1.0x (Normal)</span>
                <span>1.5x (Fast)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#134E4A] flex justify-between">
                <span>Output Volume</span>
                <span className="text-[#0F766E]">{volume}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full accent-[#0F766E] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Microphone Device Selection */}
        <div className="border-t border-[#CBDED9] pt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Mic className="w-5 h-5 text-[#0F766E]" />
            <h3 className="font-bold text-sm text-[#134E4A]">Microphone Input Device</h3>
          </div>

          <select
            value={selectedMic}
            onChange={(e) => setSelectedMic(e.target.value)}
            className="w-full p-3 rounded-2xl bg-[#F3F7F6] border border-[#CBDED9] text-xs font-medium text-[#134E4A] outline-none"
          >
            {microphones.length > 0 ? (
              microphones.map((mic, i) => (
                <option key={mic.deviceId || i} value={mic.deviceId}>
                  {mic.label || `Microphone ${i + 1}`}
                </option>
              ))
            ) : (
              <option value="">Default System Microphone</option>
            )}
          </select>
        </div>

        {/* Feedback Rigor Level */}
        <div className="border-t border-[#CBDED9] pt-6 space-y-4">
          <h3 className="font-bold text-sm text-[#134E4A]">Grammar Doctor Rigor Level</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'gentle', label: 'Gentle', desc: 'Focus on flow, correct major errors only' },
              { id: 'balanced', label: 'Balanced', desc: 'Recommended balance of fluency & grammar' },
              { id: 'strict', label: 'Strict', desc: 'Highlight subtle prepositions & native phrasing' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setFeedbackLevel(lvl.id as any)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  feedbackLevel === lvl.id
                    ? 'bg-[#DCEDE9] border-[#0F766E] font-bold text-[#134E4A]'
                    : 'bg-[#F3F7F6] border-[#CBDED9] text-[#134E4A]'
                }`}
              >
                <p className="text-xs font-bold">{lvl.label}</p>
                <p className="text-[10px] text-teal-800/60 font-medium mt-0.5">{lvl.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Appearance & Auto-Play */}
        <div className="border-t border-[#CBDED9] pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#134E4A]">Interface Theme</h3>
              <p className="text-xs text-teal-800/70 font-medium">Toggle between Light Canvas and Dark Mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-[#DCEDE9] text-[#134E4A] hover:bg-teal-100 border border-[#CBDED9] flex items-center space-x-2 text-xs font-bold cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[#F59E0B]" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#0F766E]" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#134E4A]">Auto-Play AI Responses</h3>
              <p className="text-xs text-teal-800/70 font-medium">Automatically speak AI reply upon receiving text</p>
            </div>
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              className="w-5 h-5 accent-[#0F766E] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Save Settings Footer */}
        <div className="border-t border-[#CBDED9] pt-6 flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs font-bold text-[#0F766E] flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Voice settings updated successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-teal-800/60 font-medium">Settings persist across sessions</span>
          )}

          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 rounded-2xl bg-ai-gradient hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            Save All Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
