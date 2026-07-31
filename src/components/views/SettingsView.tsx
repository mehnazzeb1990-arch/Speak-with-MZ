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
          <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-sky-400">
            <Settings className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Studio & Voice Settings</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Customize ElevenLabs AI voice parameters, microphone inputs, and feedback levels.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        
        {/* ElevenLabs AI Partner Voice Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">AI Partner Neural Voice (ElevenLabs)</h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-sky-400 border border-indigo-200 dark:border-indigo-800">
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
                className={`p-4 rounded-2xl text-left border transition-all flex items-start justify-between ${
                  selectedVoice === voice.id
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{voice.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{voice.desc}</p>
                  <span className="inline-block mt-2 font-mono text-[10px] text-slate-400">{voice.id}</span>
                </div>
                {selectedVoice === voice.id && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-sky-400 shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleTestVoice}
              className="px-4 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-sky-300 hover:bg-indigo-200 font-bold text-xs flex items-center space-x-1.5"
            >
              <Play className="w-4 h-4 fill-indigo-600" />
              <span>Test Voice Sample</span>
            </button>
          </div>
        </div>

        {/* Audio Output Parameters */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-sky-500" />
            <span>Audio Speed & Volume</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Speaking Rate</span>
                <span className="text-indigo-600">{speed}x</span>
              </label>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.75x (Slower)</span>
                <span>1.0x (Normal)</span>
                <span>1.5x (Fast)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Output Volume</span>
                <span className="text-sky-500">{volume}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Microphone Device Selection */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Mic className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Microphone Input Device</h3>
          </div>

          <select
            value={selectedMic}
            onChange={(e) => setSelectedMic(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
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
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Grammar Doctor Rigor Level</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'gentle', label: 'Gentle', desc: 'Focus on flow, correct major errors only' },
              { id: 'balanced', label: 'Balanced', desc: 'Recommended balance of fluency & grammar' },
              { id: 'strict', label: 'Strict', desc: 'Highlight subtle prepositions & native phrasing' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setFeedbackLevel(lvl.id as any)}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  feedbackLevel === lvl.id
                    ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 font-bold text-indigo-600 dark:text-sky-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <p className="text-xs font-bold">{lvl.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{lvl.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Appearance & Auto-Play */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Interface Theme</h3>
              <p className="text-xs text-slate-500">Toggle between Light Canvas and Twilight Dark Mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 flex items-center space-x-2 text-xs font-bold"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Auto-Play AI Responses</h3>
              <p className="text-xs text-slate-500">Automatically speak AI reply upon receiving text</p>
            </div>
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Save Settings Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Voice settings updated successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400">Settings persist across sessions</span>
          )}

          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Save All Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
