import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';

// Add mobile device check
const isMobileDevice = () => {
  return window.innerWidth <= 768;
};

// Initialize Gemini AI with key from localStorage or empty string
const getApiKey = () => {
  const key = localStorage.getItem('gemini_api_key');
  console.log('Retrieved API key:', key ? 'Key exists' : 'No key found');
  return key || '';
};

// Create a function to initialize the AI
const initializeAI = (apiKey: string) => {
  console.log('Initializing AI with key:', apiKey ? 'Key provided' : 'No key');
  return new GoogleGenerativeAI(apiKey);
};

// Initialize with empty key first
let genAI = initializeAI(getApiKey());

// Function to list available models
const listAvailableModels = async (apiKey: string): Promise<string[]> => {
  try {
    const ai = new GoogleGenerativeAI(apiKey);
    return ['gemini-2.0-flash'];
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatSummary {
  id: string;
  title: string;
  messages: Message[];
  created: number;
}

const FASHION_PROMPT = `You are Drip AI, a Gen Z fashion expert and friendly chatbot. You can:
 - Chat casually and answer general questions (small talk, friendly banter)
 - Give detailed styling guides and outfit advice
 - Share current fashion trends, news, and inspiration
 - Answer questions about brands, shopping, and care tips
 - Format all responses using only the relevant sections below (do not show empty sections):

🗨️ Chat:
[For general conversation, greetings, or small talk]

👗 Outfit Suggestion:
[Outfit combination with styling tips. Do NOT use asterisks for bold or italics. Use clear section headers, spacing, and emojis for emphasis and structure.]

🎨 Color Match:
[Complementary color advice. Use descriptive color names.]

📈 Trend Alert:
[Current fashion trends, news, or inspiration.]

💡 Tip:
[Short, friendly fashion insight or hack.]

🛍️ Shopping/Brand:
[Brand or shopping recommendations. Only ever suggest the brand Dripster. Do not mention or recommend any other brands.]

- Use only the sections that make sense for the user's query.
- Never use asterisks for formatting (no bold or italics). Use only clear section headers, spacing, and emojis for emphasis and structure.
- Always use a confident, casual, Gen Z-friendly, and fashion-savvy tone.
- Use emojis to add personality and clarity.
- Keep responses concise unless more detail is needed.
- Be positive, supportive, and inspiring.`;

const TypingIndicator = () => (
  <div className="flex space-x-2">
    <motion.div
      className="w-2 h-2 bg-red-500 rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.div
      className="w-2 h-2 bg-red-500 rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
    />
    <motion.div
      className="w-2 h-2 bg-red-500 rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
    />
  </div>
);

function getChatHistory(): ChatSummary[] {
  const saved = localStorage.getItem('drip_chat_history');
  return saved ? JSON.parse(saved) : [];
}

function saveChatHistory(history: ChatSummary[]) {
  localStorage.setItem('drip_chat_history', JSON.stringify(history));
}

function getGreetingMessage(name?: string): Message {
  return {
    role: 'assistant',
    content: `Hello, ${name || 'there'} 👋`,
    timestamp: Date.now(),
  };
}

const MessageBubble = ({ message, isUser }: { message: Message; isUser: boolean }) => {
  const formattedContent = message.content
    .split('\n')
    .filter(line => line.trim())
    .map((line, i) => {
      // Format section headers
      if (line.includes(':')) {
        const [header, content] = line.split(':');
        return (
          <div key={i} className="mb-2">
            <span className="font-semibold text-red-400">{header}:</span>
            <span className="ml-2">{content}</span>
          </div>
        );
      }
      return <p key={i} className="mb-2">{line}</p>;
    });

  return (
    <div className={`flex items-start space-x-2 md:space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }} 
          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0"
        >
          <i className="ri-t-shirt-line text-white text-lg md:text-2xl"></i>
        </motion.div>
      )}
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        className={`max-w-[90vw] md:max-w-[80%] rounded-lg px-4 py-3 ${
          isUser 
            ? 'bg-red-600 text-white' 
            : 'bg-[#2A2A2A] text-white'
        }`}
      >
        <div className="prose prose-invert max-w-none text-sm md:text-base">
          {formattedContent}
        </div>
      </motion.div>
      {isUser && (
        <motion.div 
          whileHover={{ scale: 1.1 }} 
          className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center flex-shrink-0"
        >
          <i className="ri-user-line text-lg md:text-2xl"></i>
        </motion.div>
      )}
    </div>
  );
};

export default function DripAssistant() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasStarted, setHasStarted] = useState(true);
  const [showGreeting, setShowGreeting] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSummary[]>(getChatHistory());
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatHistory[0]?.id || null);
  const [messages, setMessages] = useState<Message[]>(chatHistory[0]?.messages || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(getApiKey());
  const [showApiKeyInput, setShowApiKeyInput] = useState(!getApiKey());
  const [apiKeyError, setApiKeyError] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sidebarOpen]);

  useEffect(() => {
    // Save chat history on every message change
    if (!hasStarted) return;
    const updatedHistory = chatHistory.map(chat =>
      chat.id === currentChatId ? { ...chat, messages } : chat
    );
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);
  }, [messages]);

  const startNewChat = () => {
    const newId = Date.now().toString();
    const newChat: ChatSummary = {
      id: newId,
      title: 'New Chat',
      messages: [],
      created: Date.now(),
    };
    setChatHistory([newChat, ...chatHistory]);
    setCurrentChatId(newId);
    setMessages([]);
    setHasStarted(true);
    setShowGreeting(true);
    saveChatHistory([newChat, ...chatHistory]);
  };

  const loadChat = (id: string) => {
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
      setCurrentChatId(id);
      setMessages(chat.messages as Message[]);
      setHasStarted((chat.messages as Message[]).length > 0);
    }
  };

  const deleteChat = (id: string) => {
    let updatedHistory = chatHistory.filter(chat => chat.id !== id);
    if (updatedHistory.length === 0) {
      // If all chats deleted, start a new one
      startNewChat();
      updatedHistory = getChatHistory();
    } else if (id === currentChatId) {
      // If current chat deleted, switch to the next available chat
      setCurrentChatId(updatedHistory[0].id);
      setMessages(updatedHistory[0].messages);
      setHasStarted(true);
    }
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);
  };

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiKeyError('');
    
    if (!apiKey.trim()) {
      setApiKeyError('API key cannot be empty');
      return;
    }

    try {
      const modelNames = await listAvailableModels(apiKey.trim());
      setAvailableModels(modelNames);
      console.log('Available model names:', modelNames);

      const testAI = initializeAI(apiKey.trim());
      const model = testAI.getGenerativeModel({ model: modelNames[0] });
      
      localStorage.setItem('gemini_api_key', apiKey.trim());
      genAI = testAI;
      setShowApiKeyInput(false);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✨ API key saved successfully! Using model: ${modelNames[0]}. Let's make some fashion magic! 💫`,
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('API key validation error:', error);
      setApiKeyError('Invalid API key. Please check and try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!hasStarted) setHasStarted(true);
    if (showGreeting) setShowGreeting(false);
    const userMessage: Message = { role: 'user', content: input.trim(), timestamp: Date.now() };
    setInput('');
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      console.log('Making API request with key:', apiKey ? 'Key exists' : 'No key');
      const model = genAI.getGenerativeModel({ model: availableModels[0] || 'gemini-2.0-flash' });
      const prompt = `${FASHION_PROMPT}\n\nUser Query: ${userMessage.content}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const aiMessage: Message = { role: 'assistant', content: text, timestamp: Date.now() };
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      let errorMessage = "😔 Oops! I'm having trouble processing your request.";
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = "🔑 Your API key seems invalid. Let's update it using the 'Change API Key' button!";
          setShowApiKeyInput(true);
        } else if (error.message.includes('model')) {
          errorMessage = "🤖 There's an issue with my fashion brain. Let's try updating the API key!";
          setShowApiKeyInput(true);
        } else {
          errorMessage = `❌ Error: ${error.message}`;
        }
      }
      
      setMessages([...newMessages, { role: 'assistant', content: errorMessage, timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update chat title after first user message
  useEffect(() => {
    if (!currentChatId || messages.length === 0) return;
    const firstUserMsg = messages.find(m => m.role === 'user');
    if (firstUserMsg) {
      const updatedHistory = chatHistory.map(chat =>
        chat.id === currentChatId ? { ...chat, title: firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '') } : chat
      );
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
    }
  }, [messages]);

  // If on mobile, show a message instead of the AI interface
  if (isMobile) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#1A1A1A] text-white p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Drip AI</h1>
          <p className="text-gray-400">
            Drip AI is currently only available on desktop devices. Please visit us on a larger screen to experience the full features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex bg-[#1A1A1A] text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed md:relative top-0 left-0 h-full w-4/5 max-w-xs md:w-72 bg-[#181818] border-r border-zinc-700 flex flex-col z-30 shadow-lg md:shadow-none"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-700 relative">
              <span className="font-bold text-lg text-red-500">Drip AI</span>
              <button onClick={() => setSidebarOpen(false)} className="text-red-500 text-2xl absolute right-2 top-2 md:static md:right-0 md:top-0 z-40 bg-[#181818] rounded-full px-2 py-0.5 md:bg-transparent">×</button>
            </div>
            <button className="bg-red-600 text-white p-2 m-4 rounded font-semibold" onClick={startNewChat}>+ New Chat</button>
            <div className="flex-1 overflow-y-auto">
              {chatHistory.map(chat => (
                <div key={chat.id} className={`flex items-center justify-between p-3 border-b border-zinc-800 hover:bg-red-900 ${chat.id === currentChatId ? 'bg-red-950' : ''}`}>
                  <span onClick={() => loadChat(chat.id)} className="flex-1 cursor-pointer truncate">{chat.title}</span>
                  <button onClick={() => deleteChat(chat.id)} className="ml-2 text-red-400 hover:text-red-600" title="Delete chat">
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Sidebar Toggle */}
      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className="fixed left-4 z-40 bg-red-600 text-white rounded-full p-2 shadow-lg md:absolute md:z-20 mt-4"><i className="ri-menu-line text-xl"></i></button>
      )}
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative bg-[#1A1A1A]">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border-b border-zinc-700 bg-[#1A1A1A] gap-2 md:gap-0">
          <div className="hidden md:block" />
          <div className="flex items-center justify-center w-full md:w-auto space-x-2 select-none">
            <span className="text-3xl font-extrabold text-red-500 tracking-tight" style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}>Drip AI</span>
            <i className="ri-t-shirt-line text-2xl text-red-500"></i>
          </div>
          <div className="flex justify-end w-full md:w-auto">
            <button onClick={() => setShowApiKeyInput(!showApiKeyInput)} className="text-red-500 hover:text-white transition-colors flex items-center space-x-2 font-semibold">
              <i className="ri-key-line"></i>
              <span>{showApiKeyInput ? 'Hide API Key' : 'Change API Key'}</span>
            </button>
          </div>
        </header>
        {/* API Key Input */}
        <AnimatePresence>
          {showApiKeyInput && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full bg-[#2A2A2A] border-b border-zinc-700">
              <form onSubmit={handleApiKeySubmit} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 max-w-2xl mx-auto">
                <input type="password" value={apiKey} onChange={e => { setApiKey(e.target.value); setApiKeyError(''); }} placeholder="Enter your Gemini API key" className="flex-1 bg-[#3A3A3A] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2 w-full sm:w-auto">
                  <i className="ri-save-line"></i>
                  <span>Save API Key</span>
                </motion.button>
                {apiKeyError && <span className="text-red-400 text-sm ml-2">{apiKeyError}</span>}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-0 flex flex-col bg-[#1A1A1A] relative">
          {/* Gemini-style greeting overlay */}
          {showGreeting && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#1A1A1A] bg-opacity-95">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center text-red-500">
                Hello, {currentUser?.displayName || 'there'}
              </h1>
            </div>
          )}
          {!showGreeting && (
            <div className="flex-1 overflow-y-auto px-2 md:px-6 py-4 md:py-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.timestamp}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MessageBubble 
                      message={message} 
                      isUser={message.role === 'user'} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="flex justify-start items-center space-x-2 md:space-x-3"
                >
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0"
                  >
                    <i className="ri-t-shirt-line text-white text-lg md:text-2xl"></i>
                  </motion.div>
                  <div className="bg-[#2A2A2A] text-white rounded-lg px-4 py-3">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>
        {/* Input Area */}
        {hasStarted && (
          <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={handleSubmit} className="w-full fixed md:static bottom-0 left-0 z-20 p-2 md:p-6 border-t border-zinc-700 bg-[#181818] flex items-center">
            <div className="flex w-full space-x-2 md:space-x-4">
              <motion.input whileFocus={{ scale: 1.02 }} type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me about fashion advice, style pairing, or outfit suggestions..." className="flex-1 bg-[#3A3A3A] text-white rounded-lg px-3 py-2 md:px-4 md:py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base" disabled={isLoading} />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isLoading || !input.trim()} className="bg-red-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm md:text-base">
                <i className="ri-send-plane-fill"></i>
                <span>Send</span>
              </motion.button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
} 