import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, SubscriptionPlan, VocabularyItem, AIPersona, SpeakingScenario, NotificationItem, PaymentRecord, Currency } from '../types';
import { INITIAL_USER, INITIAL_VOCABULARY, AI_PERSONAS, SPEAKING_SCENARIOS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { INITIAL_PAYMENTS } from '../data/mockPayments';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  payments: PaymentRecord[];
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, level: any) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  upgradePlan: (plan: SubscriptionPlan, paymentMethod?: string, last4?: string) => void;
  cancelSubscription: () => void;
  toggleAutoRenew: () => void;
  requestRefund: (paymentId: string, reason: string) => Promise<boolean>;
  adminRefundPayment: (paymentId: string) => void;
  recordSpeakingMinutes: (minutes: number) => void;
  savedVocabList: VocabularyItem[];
  addVocabWord: (item: VocabularyItem) => void;
  toggleSaveVocab: (vocabId: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  activePersona: AIPersona;
  setActivePersona: (persona: AIPersona) => void;
  activeScenario: SpeakingScenario;
  setActiveScenario: (scenario: SpeakingScenario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('speak_mz_currency') as Currency) || 'USD';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('speak_mz_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER; // Logged in by default for frictionless demo experience
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('speak_mz_payments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PAYMENTS;
      }
    }
    return INITIAL_PAYMENTS;
  });

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('speak_mz_currency', curr);
  };

  const [savedVocabList, setSavedVocabList] = useState<VocabularyItem[]>(() => {
    const saved = localStorage.getItem('speak_mz_vocab');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_VOCABULARY;
      }
    }
    return INITIAL_VOCABULARY;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('speak_mz_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activePersona, setActivePersona] = useState<AIPersona>(AI_PERSONAS[0]);
  const [activeScenario, setActiveScenario] = useState<SpeakingScenario>(SPEAKING_SCENARIOS[0]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('speak_mz_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('speak_mz_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('speak_mz_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('speak_mz_vocab', JSON.stringify(savedVocabList));
  }, [savedVocabList]);

  useEffect(() => {
    localStorage.setItem('speak_mz_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const login = async (email: string): Promise<boolean> => {
    // Simulate auth network delay
    await new Promise((r) => setTimeout(r, 600));
    const newUser: UserProfile = {
      ...INITIAL_USER,
      email: email || INITIAL_USER.email,
      name: email ? email.split('@')[0].toUpperCase() : INITIAL_USER.name,
    };
    setUser(newUser);
    return true;
  };

  const register = async (name: string, email: string, level: any): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 600));
    const newUser: UserProfile = {
      ...INITIAL_USER,
      id: `usr_${Date.now()}`,
      name: name || 'Learner',
      email: email || 'user@speakmz.com',
      level: level || 'Intermediate',
      totalMinutesPracticed: 0,
      currentStreak: 1,
      conversationsCompleted: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 600));
    const newUser: UserProfile = {
      ...INITIAL_USER,
      name: 'Google User',
      email: 'google.user@example.com',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const upgradePlan = (plan: SubscriptionPlan, paymentMethodName = 'Visa / Mastercard', last4Digits = '4242') => {
    if (!user) return;
    const renewal = new Date();
    renewal.setMonth(renewal.getMonth() + 1);
    const renewalStr = renewal.toISOString().split('T')[0];

    const planTitle = plan === 'advanced_premium' ? 'Advanced Premium Plan' : plan === 'intermediate_premium' ? 'Intermediate Premium Plan' : 'Beginner Free Plan';

    setUser((prev) =>
      prev
        ? {
            ...prev,
            subscriptionPlan: plan,
            subscriptionStatus: 'active',
            autoRenew: true,
            renewalDate: renewalStr,
          }
        : null
    );

    if (plan !== 'free') {
      const newPayment: PaymentRecord = {
        id: `pay_${Date.now()}`,
        invoiceId: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        plan: plan,
        planName: planTitle,
        amountUSD: 10.00,
        amountPKR: 2800,
        currencyUsed: currency,
        paymentMethod: paymentMethodName as any,
        cardLast4: last4Digits,
        date: new Date().toISOString().split('T')[0],
        status: 'paid',
      };
      setPayments((prev) => [newPayment, ...prev]);
    }
  };

  const cancelSubscription = () => {
    if (!user) return;
    setUser((prev) =>
      prev
        ? {
            ...prev,
            subscriptionStatus: 'canceled',
            autoRenew: false,
          }
        : null
    );
  };

  const toggleAutoRenew = () => {
    if (!user) return;
    setUser((prev) =>
      prev
        ? {
            ...prev,
            autoRenew: !prev.autoRenew,
          }
        : null
    );
  };

  const requestRefund = async (paymentId: string, reason: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'refunded' as const } : p))
    );
    if (user) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              subscriptionPlan: 'free',
              subscriptionStatus: 'inactive',
              autoRenew: false,
            }
          : null
      );
    }
    return true;
  };

  const adminRefundPayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'refunded' as const } : p))
    );
  };

  const recordSpeakingMinutes = (minutes: number) => {
    if (!user) return;
    setUser((prev) =>
      prev
        ? {
            ...prev,
            totalMinutesPracticed: prev.totalMinutesPracticed + minutes,
            conversationsCompleted: prev.conversationsCompleted + 1,
          }
        : null
    );
  };

  const addVocabWord = (item: VocabularyItem) => {
    setSavedVocabList((prev) => {
      const exists = prev.some((w) => w.word.toLowerCase() === item.word.toLowerCase());
      if (exists) return prev;
      const updated = [item, ...prev];
      if (user) {
        setUser({ ...user, vocabularyLearned: updated.length });
      }
      return updated;
    });
  };

  const toggleSaveVocab = (vocabId: string) => {
    setSavedVocabList((prev) =>
      prev.map((item) => (item.id === vocabId ? { ...item, isSaved: !item.isSaved } : item))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        currency,
        setCurrency,
        payments,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        upgradePlan,
        cancelSubscription,
        toggleAutoRenew,
        requestRefund,
        adminRefundPayment,
        recordSpeakingMinutes,
        savedVocabList,
        addVocabWord,
        toggleSaveVocab,
        notifications,
        markNotificationRead,
        activePersona,
        setActivePersona,
        activeScenario,
        setActiveScenario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
