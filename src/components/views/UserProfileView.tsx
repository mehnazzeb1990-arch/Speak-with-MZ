import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Globe, Target, BookOpen, Check, Save } from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [country, setCountry] = useState(user?.country || 'United States');
  const [nativeLang, setNativeLang] = useState(user?.nativeLanguage || 'Spanish');
  const [level, setLevel] = useState(user?.level || 'Intermediate');
  const [dailyMins, setDailyMins] = useState(user?.dailyGoalMinutes || 15);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      country,
      nativeLanguage: nativeLang,
      level: level as any,
      dailyGoalMinutes: Number(dailyMins),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="user-profile-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Profile & Goals</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Customize your speaking goals, level targets, and personal info.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Avatar & Name */}
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatarUrl}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500"
          />
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Native Language</label>
            <input
              type="text"
              value={nativeLang}
              onChange={(e) => setNativeLang(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">English Proficiency Target</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none font-medium"
            >
              <option value="Beginner">Beginner Level</option>
              <option value="Intermediate">Intermediate Level</option>
              <option value="Advanced">Advanced Level</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Daily Speaking Goal (Minutes)</label>
            <input
              type="number"
              value={dailyMins}
              onChange={(e) => setDailyMins(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
              min={5}
              max={120}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {saved && <span className="text-xs font-bold text-emerald-600">Profile Updated Successfully!</span>}
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors ml-auto flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
};
