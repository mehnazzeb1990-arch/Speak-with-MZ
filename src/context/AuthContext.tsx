import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile, SubscriptionPlan, VocabularyItem, AIPersona, SpeakingScenario, NotificationItem, PaymentRecord, Currency } from '../types';
import { INITIAL_USER, INITIAL_VOCABULARY, AI_PERSONAS, SPEAKING_SCENARIOS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { INITIAL_PAYMENTS } from '../data/mockPayments';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  payments: PaymentRecord[];
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, level?: any, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('speak_mz_currency') as Currency) || 'USD';
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

  // Subscribe to Firebase Auth state
  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        unsubSnapshot = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            setUser(snapshot.data() as UserProfile);
          } else {
            const defaultProfile: UserProfile = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner',
              email: firebaseUser.email || 'user@example.com',
              avatarUrl: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
              country: 'United States',
              nativeLanguage: 'English',
              level: 'Intermediate',
              learningGoals: ['Fluency', 'Grammar'],
              dailyGoalMinutes: 15,
              currentStreak: 1,
              totalMinutesPracticed: 0,
              vocabularyLearned: 0,
              conversationsCompleted: 0,
              subscriptionPlan: 'free',
              subscriptionStatus: 'active',
              createdAt: new Date().toISOString().split('T')[0],
            };
            setDoc(userDocRef, defaultProfile).catch(console.error);
            setUser(defaultProfile);
          }
          setAuthLoading(false);
        }, (err) => {
          console.error("Firestore user snapshot error:", err);
          setUser({
            ...INITIAL_USER,
            id: firebaseUser.uid,
            email: firebaseUser.email || INITIAL_USER.email,
          });
          setAuthLoading(false);
        });
      } else {
        setUser(null);
        setAuthLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('speak_mz_currency', curr);
  };

  useEffect(() => {
    localStorage.setItem('speak_mz_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('speak_mz_vocab', JSON.stringify(savedVocabList));
  }, [savedVocabList]);

  useEffect(() => {
    localStorage.setItem('speak_mz_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const clearAuthError = () => setAuthError(null);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setAuthError(null);
    try {
      if (!password) {
        throw new Error("Password is required to sign in.");
      }
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      let message = "Failed to sign in. Please check your credentials.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        message = "Invalid email or password. Please try again.";
      } else if (err.code === 'auth/too-many-requests') {
        message = "Account temporarily locked due to failed attempts. Reset your password or try again later.";
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
      return false;
    }
  };

  const register = async (name: string, email: string, level: any = 'Intermediate', password?: string): Promise<boolean> => {
    setAuthError(null);
    try {
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const newUserProfile: UserProfile = {
        id: uid,
        name: name || 'Learner',
        email: email,
        avatarUrl: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200`,
        country: 'United States',
        nativeLanguage: 'English',
        level: level || 'Intermediate',
        learningGoals: ['Fluency', 'Grammar', 'Confidence'],
        dailyGoalMinutes: 15,
        currentStreak: 1,
        totalMinutesPracticed: 0,
        vocabularyLearned: 0,
        conversationsCompleted: 0,
        subscriptionPlan: 'free',
        subscriptionStatus: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      await setDoc(doc(db, 'users', uid), newUserProfile);
      setUser(newUserProfile);
      return true;
    } catch (err: any) {
      console.error("Firebase Register Error:", err);
      let message = "Failed to create account.";
      if (err.code === 'auth/email-already-in-use') {
        message = "An account with this email address already exists. Please sign in instead.";
      } else if (err.code === 'auth/weak-password') {
        message = "Password is too weak. Please use at least 6 characters.";
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        const newUserProfile: UserProfile = {
          id: uid,
          name: result.user.displayName || 'Google User',
          email: result.user.email || 'user@example.com',
          avatarUrl: result.user.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
          country: 'United States',
          nativeLanguage: 'English',
          level: 'Intermediate',
          learningGoals: ['Fluency', 'Grammar'],
          dailyGoalMinutes: 15,
          currentStreak: 1,
          totalMinutesPracticed: 0,
          vocabularyLearned: 0,
          conversationsCompleted: 0,
          subscriptionPlan: 'free',
          subscriptionStatus: 'active',
          createdAt: new Date().toISOString().split('T')[0],
        };
        await setDoc(userDocRef, newUserProfile);
        setUser(newUserProfile);
      }
      return true;
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setAuthError(err.message || "Failed to sign in with Google.");
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setAuthError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err: any) {
      console.error("Logout Error:", err);
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, updated);
    } catch (e) {
      console.error("Failed to update Firestore user profile:", e);
    }
  };

  const upgradePlan = (plan: SubscriptionPlan, paymentMethodName = 'Visa / Mastercard', last4Digits = '4242') => {
    if (!user) return;
    const renewal = new Date();
    renewal.setMonth(renewal.getMonth() + 1);
    const renewalStr = renewal.toISOString().split('T')[0];

    const planTitle = plan === 'advanced_premium' ? 'Advanced Premium Plan' : plan === 'intermediate_premium' ? 'Intermediate Premium Plan' : 'Beginner Free Plan';

    const updatedProfile: Partial<UserProfile> = {
      subscriptionPlan: plan,
      subscriptionStatus: 'active',
      autoRenew: true,
      renewalDate: renewalStr,
    };

    updateProfile(updatedProfile);

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
    updateProfile({
      subscriptionStatus: 'canceled',
      autoRenew: false,
    });
  };

  const toggleAutoRenew = () => {
    if (!user) return;
    updateProfile({
      autoRenew: !user.autoRenew,
    });
  };

  const requestRefund = async (paymentId: string, reason: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'refunded' as const } : p))
    );
    if (user) {
      updateProfile({
        subscriptionPlan: 'free',
        subscriptionStatus: 'inactive',
        autoRenew: false,
      });
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
    updateProfile({
      totalMinutesPracticed: (user.totalMinutesPracticed || 0) + minutes,
      conversationsCompleted: (user.conversationsCompleted || 0) + 1,
    });
  };

  const addVocabWord = (item: VocabularyItem) => {
    setSavedVocabList((prev) => {
      const exists = prev.some((w) => w.word.toLowerCase() === item.word.toLowerCase());
      if (exists) return prev;
      const updated = [item, ...prev];
      if (user) {
        updateProfile({ vocabularyLearned: updated.length });
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
        authLoading,
        authError,
        clearAuthError,
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

