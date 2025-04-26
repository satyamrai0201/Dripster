import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      message: "Hi there! How can I help you today? You can ask me about your order, returns, or payment options.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const sendMessage = (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate bot response after a short delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        sender: 'bot',
        message: getBotResponse(message),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const getBotResponse = (message: string): string => {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes('where') && lowerCaseMessage.includes('order')) {
      return "You can track your order in the 'My Account' section. If you've just placed your order, please allow 24 hours for tracking information to become available.";
    } else if (lowerCaseMessage.includes('return') || lowerCaseMessage.includes('refund')) {
      return "Our return policy allows for returns within 30 days of purchase. Ensure items are unworn with original tags. Visit the 'Returns' section in your account to initiate a return.";
    } else if (lowerCaseMessage.includes('cod') || lowerCaseMessage.includes('cash on delivery')) {
      return "Yes, we offer Cash on Delivery for orders under ₹10,000 in select pin codes. You can check availability during checkout.";
    } else if (lowerCaseMessage.includes('payment') || lowerCaseMessage.includes('pay')) {
      return "We accept various payment methods including Credit/Debit cards, UPI, Net Banking, Wallets, and Cash on Delivery in select areas.";
    } else if (lowerCaseMessage.includes('shipping') || lowerCaseMessage.includes('delivery')) {
      return "Standard shipping typically takes 3-5 business days. For metro cities, express delivery (1-2 days) is also available at an additional cost.";
    } else if (lowerCaseMessage.includes('size') || lowerCaseMessage.includes('sizing')) {
      return "You can find our detailed size guide on the product page. We recommend checking measurements to ensure the perfect fit!";
    } else if (lowerCaseMessage.includes('discount') || lowerCaseMessage.includes('coupon') || lowerCaseMessage.includes('offer')) {
      return "Check our 'Sale' section for current offers. You can also subscribe to our newsletter for exclusive discount codes and early access to sales!";
    } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
      return "Hey there! How can I help you with your shopping today?";
    } else {
      return "I'm not sure I understand. Could you rephrase that? You can ask me about orders, returns, payment options, or shipping.";
    }
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className="w-14 h-14 rounded-full bg-primary hover:bg-[#e03535] flex items-center justify-center shadow-lg transition-colors"
          onClick={handleToggleChat}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <i className={`${isOpen ? 'ri-close-line' : 'ri-customer-service-2-line'} text-2xl text-white`}></i>
        </button>
      </div>
      
      {/* Chatbot container */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-50 w-[320px] rounded-xl overflow-hidden shadow-xl"
          style={{
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Chat header */}
          <div className="p-4 border-b border-[rgba(255,255,255,0.1)] flex justify-between items-center">
            <h3 className="font-montserrat font-semibold">Dripster Support</h3>
            <button 
              className="p-1 hover:bg-[#2A2A2A] rounded transition-colors"
              onClick={handleToggleChat}
              aria-label="Close chat"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
          
          {/* Chat messages */}
          <div 
            className="h-[300px] p-4 overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent'
            }}
          >
            <div className="flex flex-col space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                      <i className="ri-customer-service-2-line text-white"></i>
                    </div>
                  )}
                  
                  <div 
                    className={`rounded-lg p-3 max-w-[80%] ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-[rgba(42,42,42,0.7)] text-white'
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                  
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center ml-2">
                      <i className="ri-user-line"></i>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Chat input */}
          <div className="p-4 border-t border-[rgba(255,255,255,0.1)]">
            <form onSubmit={handleSendMessage} className="flex">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 py-2 px-4 rounded-l-full bg-[#2A2A2A] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-primary text-white"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button 
                type="submit" 
                className="px-4 py-2 rounded-r-full bg-primary hover:bg-[#e03535] text-white transition-colors"
                aria-label="Send message"
              >
                <i className="ri-send-plane-fill"></i>
              </button>
            </form>
            
            {/* Quick questions */}
            <div className="flex flex-wrap justify-center mt-2">
              <button 
                className="text-xs bg-[#2A2A2A] px-3 py-1 rounded-full m-1 hover:bg-[#3A3A3A] transition-colors"
                onClick={() => handleQuickQuestion("Where's my order?")}
              >
                Where's my order?
              </button>
              <button 
                className="text-xs bg-[#2A2A2A] px-3 py-1 rounded-full m-1 hover:bg-[#3A3A3A] transition-colors"
                onClick={() => handleQuickQuestion("How do I return an item?")}
              >
                Return policy
              </button>
              <button 
                className="text-xs bg-[#2A2A2A] px-3 py-1 rounded-full m-1 hover:bg-[#3A3A3A] transition-colors"
                onClick={() => handleQuickQuestion("Do you offer COD?")}
              >
                Do you offer COD?
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
