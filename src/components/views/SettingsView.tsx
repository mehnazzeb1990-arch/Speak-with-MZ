import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Settings, Moon, Sun, Volume2, Mic, Shield } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div id="settings-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
            <Settings className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">App Settings</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Configure interface theme, voice output parameters, and audio inputs.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Appearance */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Interface Theme</h3>
            <p className="text-xs text-slate-500">Switch between Light canvas and Twilight Dark theme</p>
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

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Microphone Auto-Gain Control</h3>
            <p className="text-xs text-slate-500">Automatically adjust input volume for optimal speech recognition</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-500 rounded" />
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Live Grammar Suggestions</h3>
            <p className="text-xs text-slate-500">Show instant corrections during speaking sessions</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-500 rounded" />
        </div>

      </div>
    </div>
  );
};
