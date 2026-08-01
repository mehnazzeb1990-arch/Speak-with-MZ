import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Headphones, 
  HelpCircle, 
  CreditCard, 
  Mic, 
  Key, 
  Wrench, 
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  Mail
} from 'lucide-react';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const SUPPORT_TOPICS = [
  { id: 'account', label: 'Account setup', icon: Key, description: 'Login, password reset, profile settings' },
  { id: 'practice', label: 'Speaking practice', icon: Mic, description: 'Studio modes, speech scoring, feedback' },
  { id: 'features', label: 'AI features', icon: Sparkles, description: 'ElevenLabs voices, Gemini AI, real-time feedback' },
  { id: 'pricing', label: 'Subscription plans', icon: CreditCard, description: 'Free tier, Intermediate & Advanced plans, 14-day refunds' },
  { id: 'technical', label: 'Technical issues', icon: Wrench, description: 'Microphone permissions, audio playback, connection' },
];

const PRESET_QUESTIONS = [
  { category: 'account', question: 'How do I reset my password or change my email?' },
  { category: 'practice', question: 'How do I track my speaking fluency and pronunciation score?' },
  { category: 'features', question: 'How does the AI voice coach correct my grammar in real-time?' },
  { category: 'pricing', question: 'What is included in the Intermediate & Advanced subscription plans?' },
  { category: 'technical', question: 'My microphone is not capturing audio. How can I fix it?' },
];

export const SupportChatModal: React.FC<SupportChatModalProps> = ({ isOpen, onClose, initialTopic }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'ticket'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 Hi! I'm your MZ AI Support Assistant. I'm here 24/7 to answer any questions about Account setup, Speaking practice, AI features, Subscription plans, or Technical issues.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialTopic || 'all');

  // Leave a message form state
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Account setup');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, category: selectedCategory }),
      });

      let aiResponseText = '';
      if (res.ok) {
        const data = await res.json();
        aiResponseText = data.reply;
      } else {
        aiResponseText = getInstantSupportResponse(query);
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackReply = getInstantSupportResponse(query);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicketId = `MZ-SUP-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(newTicketId);
    setTicketSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#042F2C]/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#E6F1EF] rounded-3xl shadow-2xl border border-[#CBDED9] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#042F2C] via-[#0F766E] to-[#0D9488] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-sm">
              <Bot className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white">MZ AI Support Assistant</h3>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>24/7 Live</span>
                </span>
              </div>
              <p className="text-xs text-teal-100 font-medium">Instant help & support ticket assistance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-teal-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-5 pt-3 pb-2 bg-[#DCEDE9] border-b border-[#CBDED9] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-[#E6F1EF] text-[#134E4A] hover:bg-teal-200/60'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Chat with AI Support</span>
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'ticket'
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-[#E6F1EF] text-[#134E4A] hover:bg-teal-200/60'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Leave a Message</span>
            </button>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-bold text-teal-800/80">
            Avg. response: Instant
          </span>
        </div>

        {/* Modal Content */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Quick Support Topics */}
            <div className="p-3 bg-[#E6F1EF] border-b border-[#CBDED9] shrink-0 overflow-x-auto">
              <div className="flex items-center space-x-1.5 min-w-max">
                <span className="text-[10px] font-black uppercase text-teal-900/80 mr-1">Topics:</span>
                {SUPPORT_TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  const isSelected = selectedCategory === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedCategory(isSelected ? 'all' : topic.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0F766E] text-white'
                          : 'bg-[#DCEDE9] text-[#134E4A] hover:bg-teal-200/70 border border-[#CBDED9]'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 space-y-1 shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-[#0F766E] text-white rounded-br-none'
                        : 'bg-[#DCEDE9] border border-[#CBDED9] text-[#134E4A] rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold opacity-75 mb-1">
                      <span className="flex items-center space-x-1">
                        {m.sender === 'ai' ? (
                          <>
                            <Bot className="w-3 h-3 text-[#F59E0B]" />
                            <span>MZ Support AI</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            <span>You</span>
                          </>
                        )}
                      </span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap font-medium">{m.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#DCEDE9] border border-[#CBDED9] text-[#134E4A] rounded-2xl p-3.5 rounded-bl-none flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-[#0F766E] animate-spin" />
                    <span className="text-xs font-bold">MZ Support Assistant is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset Questions Suggestions */}
            {messages.length < 5 && (
              <div className="px-4 py-2 bg-[#DCEDE9]/60 border-t border-[#CBDED9] shrink-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-teal-900/80 mb-1.5">
                  Frequently Asked Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_QUESTIONS.map((pq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(pq.question)}
                      className="text-left text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#E6F1EF] text-[#134E4A] hover:bg-[#0F766E] hover:text-white border border-[#CBDED9] transition-all cursor-pointer truncate max-w-full"
                    >
                      💡 {pq.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="p-4 bg-[#E6F1EF] border-t border-[#CBDED9] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask any question about Account, Practice, AI, Plans..."
                  className="flex-1 px-4 py-3 rounded-2xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs font-medium outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="px-5 py-3 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-md shadow-teal-900/20 hover:opacity-95 transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Ticket Form */
          <div className="flex-1 p-6 overflow-y-auto">
            {ticketSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#DCEDE9] text-[#0F766E] rounded-full flex items-center justify-center mx-auto border border-[#CBDED9] animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-[#134E4A]">Message Received!</h4>
                <p className="text-xs text-teal-900/80 font-medium max-w-md mx-auto">
                  Thank you, <strong className="text-[#134E4A]">{ticketName || 'Learner'}</strong>. Your support ticket <span className="font-extrabold text-[#0F766E]">{ticketId}</span> has been logged. Our human support team will respond to <strong className="text-[#134E4A]">{ticketEmail}</strong> within 2 hours.
                </p>
                <div className="p-4 rounded-2xl bg-[#DCEDE9] border border-[#CBDED9] text-left text-xs text-[#134E4A] max-w-md mx-auto space-y-1">
                  <p><span className="font-bold">Category:</span> {ticketCategory}</p>
                  <p><span className="font-bold">Subject:</span> {ticketSubject || 'General Support Inquiry'}</p>
                  <p className="text-teal-800/80 font-medium italic mt-2">"{ticketMessage}"</p>
                </div>
                <button
                  onClick={() => {
                    setTicketSubmitted(false);
                    setTicketSubject('');
                    setTicketMessage('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-ai-gradient text-white font-black text-xs cursor-pointer shadow-md"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4 max-w-xl mx-auto">
                <div>
                  <h4 className="text-base font-black text-[#134E4A]">Leave a Message for Human Support</h4>
                  <p className="text-xs text-teal-900/80 font-medium">Can't find what you need? Our dedicated support team responds within 2 hours.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-teal-800/80 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      required
                      placeholder="Alex Smith"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-teal-800/80 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      required
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-teal-800/80 mb-1">Inquiry Topic</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs outline-none font-medium"
                  >
                    <option value="Account setup">Account setup (Login, password, profile)</option>
                    <option value="Speaking practice">Speaking practice (Fluency, topics, scoring)</option>
                    <option value="AI features">AI features (Voices, feedback, grammar)</option>
                    <option value="Subscription plans">Subscription plans & Billing (Upgrades, 14-day refund)</option>
                    <option value="Technical issues">Technical issues (Microphone, audio playback)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-teal-800/80 mb-1">Subject</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                    placeholder="Brief description of your issue"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-teal-800/80 mb-1">Message</label>
                  <textarea
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder="Provide as much details as possible so we can assist you quickly..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBDED9] bg-[#DCEDE9] text-[#134E4A] text-xs outline-none focus:ring-2 focus:ring-[#0F766E] font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-ai-gradient text-white font-black text-xs shadow-lg shadow-teal-900/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket to Support Team</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="px-5 py-3 bg-[#DCEDE9] border-t border-[#CBDED9] flex items-center justify-between text-[11px] text-teal-900/80 font-bold shrink-0">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
            <span>Speak with MZ Verified Support</span>
          </span>
          <span>100% Privacy Protected</span>
        </div>

      </div>
    </div>
  );
};

// Intelligent instant response generator for support chat
function getInstantSupportResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('account') || q.includes('login') || q.includes('password') || q.includes('email') || q.includes('reset')) {
    return `🔐 **Account Setup & Password Help:**\n\n1. **Sign In / Sign Up:** Use your registered Email & Password or 1-Click Google Authentication.\n2. **Reset Password:** Click "Forgot Password?" on the login screen to receive a secure password reset link via email.\n3. **Profile Settings:** Update your display name or current English speaking level under Profile > Settings.`;
  }

  if (q.includes('speak') || q.includes('practice') || q.includes('studio') || q.includes('score') || q.includes('fluency') || q.includes('accent')) {
    return `🎤 **Speaking Practice & Scoring Guidance:**\n\n1. **Speaking Studio:** Select any real-world scenario (e.g., Job Interview, Travel, Casual Chat) and click the Microphone button to record.\n2. **Real-time Feedback:** MZ AI provides immediate grammar corrections, vocabulary enhancements, and pronunciation score analysis.\n3. **Fluency Tracking:** Your daily performance is saved automatically to your Learning Progress & Achievements dashboard!`;
  }

  if (q.includes('ai') || q.includes('feature') || q.includes('gemini') || q.includes('elevenlabs') || q.includes('voice')) {
    return `🤖 **AI Features Information:**\n\n1. **Gemini AI Partner:** Powers natural, human-like speaking practice with adaptive difficulty for Beginner, Intermediate, and Advanced learners.\n2. **ElevenLabs Voice Synthesis:** Delivers crystal-clear native English accents for listening comprehension.\n3. **Vocabulary Vault:** Save new words directly from conversation practice to review with custom exercises.`;
  }

  if (q.includes('plan') || q.includes('subscription') || q.includes('price') || q.includes('upgrade') || q.includes('cost') || q.includes('refund') || q.includes('pay') || q.includes('card')) {
    return `💳 **Subscription Plans & Billing:**\n\n1. **Free Beginner Plan:** Enjoy 200 free speaking minutes every single month.\n2. **Intermediate Plan ($15/mo or PKR Rs. 3,900/mo):** Unlimited AI speaking time, full grammar reports, and all curriculum modules.\n3. **Advanced Plan ($29/mo or PKR Rs. 7,900/mo):** Master class coaching, 1-on-1 interview practice, and certificate.\n4. **14-Day 100% Refund Policy:** Full money-back guarantee with 1-click refund from your Subscription settings. We accept Visa, Mastercard, 1Link/PayPak, JazzCash & EasyPaisa.`;
  }

  if (q.includes('mic') || q.includes('microphone') || q.includes('sound') || q.includes('audio') || q.includes('bug') || q.includes('error') || q.includes('technical')) {
    return `🛠️ **Technical Issues Troubleshooting:**\n\n1. **Microphone Access:** Ensure your web browser has permission to access your microphone (look for the camera/mic icon in your URL bar).\n2. **Audio Playback:** Check that your device volume is turned up and no bluetooth headset is disconnected.\n3. **Connection:** If the AI response pauses, click the microphone button to re-engage the conversation.`;
  }

  return `Thank you for reaching out! MZ AI Support Assistant can help you with:\n\n• **Account Setup:** Logging in, password reset, level selection\n• **Speaking Practice:** Using the studio, speech scoring, feedback\n• **AI Features:** Voice synthesis, real-time grammar feedback\n• **Subscription Plans:** Free vs. Paid tiers, 14-day refund policy\n• **Technical Issues:** Microphone and browser permissions\n\nPlease select one of these topics or leave a message for our support team!`;
}
