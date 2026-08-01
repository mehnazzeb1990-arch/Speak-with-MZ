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
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onToggleMobileSidebar }) => {
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
    <header id="app-main-header" className="sticky top-0 z-50 backdrop-blur-md bg-[#E6F1EF]/90 border-b border-[#CBDED9] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Area: Mobile Sidebar Toggle + Brand Logo */}
        <div className="flex items-center space-x-3">
          {onToggleMobileSidebar && (
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-[#0F766E] hover:bg-[#DCEDE9] border border-[#CBDED9] transition-colors"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
            id="brand-logo-button"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-[#0F766E] via-[#14B8A6] to-[#F59E0B] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-teal-700/20 group-hover:scale-105 transition-transform duration-200">
              MZ
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xl tracking-tight text-[#134E4A] dark:text-white">Speak with</span>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#0F766E] to-[#14B8A6] dark:from-teal-400 dark:to-teal-200 bg-clip-text text-transparent">MZ</span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#0F766E] dark:text-teal-300 block -mt-1">
                AI English Coach
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links Removed - Moved to Left Sidebar */}
        <div className="hidden md:flex flex-1" />

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
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#E6F1EF] shadow-xl border border-[#CBDED9] py-2 z-50 text-[#134E4A]"
                  >
                    <div className="px-4 py-3 border-b border-[#CBDED9]">
                      <p className="text-sm font-bold text-[#134E4A] truncate">{user.name}</p>
                      <p className="text-xs text-teal-800/70 truncate font-medium">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]">
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
                className="px-4 py-2 rounded-xl text-sm font-bold text-[#0F766E] hover:bg-[#DCEDE9] transition-colors"
              >
                Login
              </button>
              <button
                id="header-register-button"
                onClick={() => handleNavClick('register')}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-ai-gradient shadow-md shadow-teal-700/20 hover:opacity-95 transition-all"
              >
                Create Account
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
        <div id="mobile-menu-drawer" className="md:hidden bg-[#E6F1EF] border-b border-[#CBDED9] px-4 pt-2 pb-6 space-y-2">
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

          {isAuthenticated ? (
            <div className="pt-4 flex flex-col space-y-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-center font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 flex flex-col space-y-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 rounded-xl text-center font-bold text-[#312E81] bg-[#EEEAF8] border border-[#D6CCE9]"
              >
                Login
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="w-full py-2.5 rounded-xl text-center font-bold text-white bg-ai-gradient shadow-sm"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
