import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Views
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

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');

  // Smooth top window scroll on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={setCurrentView} />;
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} />;
      case 'speaking':
        return <SpeakingStudioView onNavigate={setCurrentView} />;
      case 'vocab':
        return <VocabVaultView onNavigate={setCurrentView} />;
      case 'curriculum':
        return <CurriculumHubView onNavigate={setCurrentView} />;
      case 'progress':
        return <LearningProgressView onNavigate={setCurrentView} />;
      case 'achievements':
        return <AchievementsView />;
      case 'history':
        return <ConversationHistoryView onNavigate={setCurrentView} />;
      case 'pricing':
        return <PricingView />;
      case 'about':
        return <AboutView />;
      case 'features':
        return <FeaturesView onNavigate={setCurrentView} />;
      case 'contact':
        return <ContactView />;
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
    <div className="min-h-screen flex flex-col bg-[#F7F5FC] dark:bg-slate-950 text-[#312E81] dark:text-slate-100 transition-colors duration-200 selection:bg-[#4F46E5] selection:text-white">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
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
