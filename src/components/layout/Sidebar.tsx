import React from 'react';
import { 
  Home, 
  Bot, 
  Mic, 
  BookOpen, 
  Globe, 
  Rocket, 
  BookMarked, 
  GraduationCap, 
  Lightbulb, 
  Book, 
  PenTool, 
  MessageSquare, 
  TrendingUp, 
  Crown, 
  Trophy, 
  Headphones, 
  Settings,
  Sparkles,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, badge: null },
  { id: 'speaking', label: 'AI Coach', icon: Bot, badge: '24/7' },
  { id: 'curriculum', label: 'Speaking Practice', icon: Mic, badge: 'Topics' },
  { id: 'vocab', label: 'Vocabulary', icon: BookOpen, badge: 'Vault' },
  { id: 'grammar-improvement', label: 'Grammar Improvement', icon: PenTool, badge: 'Doctor' },
  { id: 'pronunciation-training', label: 'Pronunciation Training', icon: MessageSquare, badge: 'Audio' },
  { id: 'progress', label: 'Progress', icon: TrendingUp, badge: null },
  { id: 'pricing', label: 'Premium Plans', icon: Crown, badge: 'PRO' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  { id: 'contact', label: 'Contact & Support', icon: Headphones, badge: null },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const { user } = useAuth();

  const handleSelect = (viewId: string) => {
    onNavigate(viewId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#E6F1EF] border-r border-[#CBDED9] text-[#134E4A] select-none">
      
      {/* Top Sidebar Header / Banner */}
      <div className="p-4 border-b border-[#CBDED9] flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] text-white flex items-center justify-center font-black text-base shadow-md">
          MZ
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-extrabold text-sm text-[#134E4A] truncate">Speak with MZ</h2>
          <p className="text-[11px] text-[#0F766E] font-bold flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#F59E0B]" />
            <span>AI English Coach</span>
          </p>
        </div>
      </div>

      {/* Navigation Links List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-[#CBDED9]">
        <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-teal-800/60">
          Navigation Hub
        </div>
        
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer group ${
                isActive
                  ? 'bg-[#0F766E] text-white shadow-md shadow-teal-800/20'
                  : 'text-[#134E4A] hover:bg-[#DCEDE9] hover:text-[#0F766E]'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <IconComponent className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-[#0F766E]'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#DCEDE9] text-[#0F766E] border border-[#CBDED9]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick AI Coach Jump Card Footer */}
      <div className="p-3 border-t border-[#CBDED9]">
        <div className="p-3 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-[#134E4A]">AI Voice Partner Ready</span>
          </div>
          <p className="text-[11px] text-teal-800/70 font-medium">
            Practice speaking instantly with 24/7 AI feedback.
          </p>
          <button
            onClick={() => handleSelect('speaking')}
            className="w-full py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Launch AI Coach</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#042F2C]/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
