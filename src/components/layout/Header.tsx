import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sparkles, 
  Mic, 
  BookOpen, 
  LayoutDashboard, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Flame, 
  User, 
  LogOut, 
  Crown, 
  Settings, 
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Award,
  History,
  Bell
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, logout, notifications } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header id="app-main-header" className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3 cursor-pointer group"
          id="brand-logo-button"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-[#4F46E5] via-[#8B5CF6] to-[#EC4899] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            MZ
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Speak with</span>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-sky-500 dark:from-indigo-400 dark:to-sky-300 bg-clip-text text-transparent">MZ</span>
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 dark:text-sky-300 block -mt-1">
              AI English Coach
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1" id="desktop-main-nav">
          <button
            id="nav-link-home"
            onClick={() => handleNavClick('home')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'home'
                ? 'text-indigo-600 dark:text-sky-300 bg-indigo-50 dark:bg-indigo-950/60 font-semibold border border-indigo-100 dark:border-indigo-900/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
            }`}
          >
            Home
          </button>

          {isAuthenticated && (
            <>
              <button
                id="nav-link-speaking"
                onClick={() => handleNavClick('speaking')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-1.5 ${
                  currentView === 'speaking'
                    ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-indigo-700 dark:text-sky-300 bg-indigo-50/80 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-900/40'
                }`}
              >
                <Mic className="w-4 h-4 animate-pulse" />
                <span>Speak Now</span>
              </button>

              <button
                id="nav-link-dashboard"
                onClick={() => handleNavClick('dashboard')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  currentView === 'dashboard'
                    ? 'text-indigo-600 dark:text-sky-300 bg-indigo-50 dark:bg-indigo-950/60 font-semibold border border-indigo-100 dark:border-indigo-900/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                id="nav-link-vocab"
                onClick={() => handleNavClick('vocab')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  currentView === 'vocab'
                    ? 'text-indigo-600 dark:text-sky-300 bg-indigo-50 dark:bg-indigo-950/60 font-semibold border border-indigo-100 dark:border-indigo-900/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Vocab Vault</span>
              </button>

              <button
                id="nav-link-curriculum"
                onClick={() => handleNavClick('curriculum')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  currentView === 'curriculum'
                    ? 'text-indigo-600 dark:text-sky-300 bg-indigo-50 dark:bg-indigo-950/60 font-semibold border border-indigo-100 dark:border-indigo-900/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>400 Topics</span>
              </button>
            </>
          )}

          <button
            id="nav-link-features"
            onClick={() => handleNavClick('features')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'features'
                ? 'text-indigo-600 dark:text-sky-300 bg-indigo-50 dark:bg-indigo-950/60 font-semibold border border-indigo-100 dark:border-indigo-900/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
            }`}
          >
            Features
          </button>

          <button
            id="nav-link-pricing"
            onClick={() => handleNavClick('pricing')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'pricing'
                ? 'text-indigo-600 dark:text-sky-300 bg-indigo-50 dark:bg-indigo-950/60 font-semibold border border-indigo-100 dark:border-indigo-900/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
            }`}
          >
            Pricing
          </button>

          <button
            id="nav-link-about"
            onClick={() => handleNavClick('about')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'about'
                ? 'text-indigo-600 dark:text-sky-300 bg-indigo-50 dark:bg-indigo-950/60 font-semibold border border-indigo-100 dark:border-indigo-900/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
            }`}
          >
            About
          </button>
        </nav>

        {/* Right Section Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {isAuthenticated && user ? (
            <>
              {/* Daily Streak Counter */}
              <div 
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 text-xs font-bold"
                title="Daily Speaking Streak"
              >
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{user.currentStreak} Days</span>
              </div>

              {/* Notifications Button */}
              <button
                id="notifications-button"
                onClick={() => handleNavClick('notifications')}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  id="user-menu-button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/30"
                  />
                  <span className="hidden lg:inline text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:inline" />
                </button>

                {/* Dropdown Menu Popup */}
                {userDropdownOpen && (
                  <div 
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-slate-700 dark:text-slate-200"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {user.level} Level
                        </span>
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span className="capitalize">{user.subscriptionPlan.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('progress')}
                        className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Award className="w-4 h-4 text-slate-500" />
                        <span>Learning Progress</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('history')}
                        className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <History className="w-4 h-4 text-slate-500" />
                        <span>Conversation History</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('subscription')}
                        className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 font-medium"
                      >
                        <Crown className="w-4 h-4" />
                        <span>Subscription & Billing</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('settings')}
                        className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>App Settings</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 flex items-center space-x-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <button
                id="header-login-button"
                onClick={() => handleNavClick('login')}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Log In
              </button>
              <button
                id="header-register-button"
                onClick={() => handleNavClick('register')}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 shadow-sm shadow-indigo-500/25 transition-all"
              >
                Start Free
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          
          {isAuthenticated && (
            <>
              <button
                onClick={() => handleNavClick('speaking')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-sky-600 flex items-center space-x-2"
              >
                <Mic className="w-5 h-5" />
                <span>Start Speaking with MZ</span>
              </button>
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('vocab')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Vocabulary Vault
              </button>
            </>
          )}

          <button
            onClick={() => handleNavClick('features')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            About Us
          </button>

          {!isAuthenticated && (
            <div className="pt-4 flex flex-col space-y-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 rounded-xl text-center font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="w-full py-2.5 rounded-xl text-center font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
              >
                Start Free Trial
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
