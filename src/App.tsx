import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Mic, Sparkles } from 'lucide-react';

// Core Views
import { HomeView } from './components/views/HomeView';
import { DashboardView } from './components/views/DashboardView';
import { SpeakingStudioView } from './components/views/SpeakingStudioView';
import { VocabVaultView } from './components/views/VocabVaultView';
import { CurriculumHubView } from './components/views/CurriculumHubView';
import { LearningProgressView } from './components/views/LearningProgressView';
import { AchievementsView } from './components/views/AchievementsView';
import { ConversationHistoryView } from './components/views/ConversationHistoryView';
import { PricingView } from './components/views/PricingView';
import { AboutView } from './components/views/AboutView';
import { FeaturesView } from './components/views/FeaturesView';
import { ContactView } from './components/views/ContactView';
import { FAQsView } from './components/views/FAQsView';
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';
import { TermsConditionsView } from './components/views/TermsConditionsView';

// Educational & Guide Views
import { WhySpeakingView } from './components/views/WhySpeakingView';
import { BenefitsEnglishView } from './components/views/BenefitsEnglishView';
import { BeginnerGuideView } from './components/views/BeginnerGuideView';
import { IntermediateGuideView } from './components/views/IntermediateGuideView';
import { AdvancedGuideView } from './components/views/AdvancedGuideView';
import { DailySpeakingTipsView } from './components/views/DailySpeakingTipsView';
import { GrammarImprovementView } from './components/views/GrammarImprovementView';
import { PronunciationTrainingView } from './components/views/PronunciationTrainingView';

// Auth Views
import { LoginView } from './components/views/LoginView';
import { RegisterView } from './components/views/RegisterView';
import { ForgotPasswordView } from './components/views/ForgotPasswordView';

// User Settings Views
import { UserProfileView } from './components/views/UserProfileView';
import { SettingsView } from './components/views/SettingsView';
import { SubscriptionView } from './components/views/SubscriptionView';
import { NotificationsView } from './components/views/NotificationsView';
import { HelpCenterView } from './components/views/HelpCenterView';

const PROTECTED_ROUTES = [
  'dashboard',
  'speaking',
  'vocab',
  'curriculum',
  'progress',
  'achievements',
  'history',
  'profile',
  'settings',
  'subscription',
  'notifications',
];

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const { isAuthenticated, authLoading } = useAuth();

  // Smooth top window scroll on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F7F6] text-[#134E4A]">
        <div className="w-16 h-16 rounded-3xl bg-ai-gradient flex items-center justify-center text-white shadow-xl shadow-teal-700/30 ai-glow-pulse mb-6">
          <Mic className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div className="flex items-center space-x-2 text-sm font-extrabold text-[#0F766E] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#14B8A6] animate-spin" />
          <span>Speak with MZ AI</span>
        </div>
        <p className="text-xs text-teal-800/70 mt-1 font-medium">Initializing secure session...</p>
      </div>
    );
  }

  const renderCurrentView = () => {
    // Check protected routes
    if (PROTECTED_ROUTES.includes(currentView) && !isAuthenticated) {
      return (
        <div className="space-y-4 pt-6">
          <div className="max-w-md mx-auto px-4">
            <div className="p-4 rounded-2xl bg-teal-100/70 border border-teal-200 text-[#134E4A] text-xs font-semibold text-center">
              🔒 Please sign in to access your {currentView}
            </div>
          </div>
          <LoginView onNavigate={setCurrentView} />
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={setCurrentView} />;
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} />;
      case 'speaking':
        return <SpeakingStudioView onNavigate={setCurrentView} />;
      case 'curriculum':
        return <CurriculumHubView onNavigate={setCurrentView} />;
      case 'why-speaking':
        return <WhySpeakingView onNavigate={setCurrentView} />;
      case 'benefits-english':
        return <BenefitsEnglishView onNavigate={setCurrentView} />;
      case 'guide-beginner':
        return <BeginnerGuideView onNavigate={setCurrentView} />;
      case 'guide-intermediate':
        return <IntermediateGuideView onNavigate={setCurrentView} />;
      case 'guide-advanced':
        return <AdvancedGuideView onNavigate={setCurrentView} />;
      case 'speaking-tips':
        return <DailySpeakingTipsView onNavigate={setCurrentView} />;
      case 'vocab':
        return <VocabVaultView onNavigate={setCurrentView} />;
      case 'grammar-improvement':
        return <GrammarImprovementView onNavigate={setCurrentView} />;
      case 'pronunciation-training':
        return <PronunciationTrainingView onNavigate={setCurrentView} />;
      case 'progress':
        return <LearningProgressView onNavigate={setCurrentView} />;
      case 'pricing':
        return <PricingView onNavigate={setCurrentView} />;
      case 'achievements':
        return <AchievementsView />;
      case 'history':
        return <ConversationHistoryView onNavigate={setCurrentView} />;
      case 'about':
        return <AboutView />;
      case 'features':
        return <FeaturesView onNavigate={setCurrentView} />;
      case 'contact':
        return <ContactView onNavigate={setCurrentView} />;
      case 'faqs':
        return <FAQsView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      case 'terms':
        return <TermsConditionsView />;
      case 'login':
        return <LoginView onNavigate={setCurrentView} />;
      case 'register':
        return <RegisterView onNavigate={setCurrentView} />;
      case 'forgot-password':
        return <ForgotPasswordView onNavigate={setCurrentView} />;
      case 'profile':
        return <UserProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'subscription':
        return <SubscriptionView />;
      case 'notifications':
        return <NotificationsView />;
      case 'help':
        return <HelpCenterView onNavigate={setCurrentView} />;
      default:
        return <HomeView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F7F6] text-[#134E4A] transition-colors duration-200 selection:bg-[#0F766E] selection:text-white">
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        <Sidebar 
          currentView={currentView} 
          onNavigate={setCurrentView}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
        
        <main className="flex-1 min-w-0">
          {renderCurrentView()}
        </main>
      </div>

      <Footer onNavigate={setCurrentView} />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
