import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: number;
  user_name: string;
  chat_history: string;
  total_messages: number;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [userName, setUserName] = useState("");
  const [chatSessionId, setChatSessionId] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: "assistant", 
      content: "Witaj! Jestem Twoim asystentem AI. Opisz swój projekt, a przedstawię Ci szacunkową wycenę."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const maxRequestsPerHour = 10;
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load existing chat session if user has provided their name
  const { data: chatSession } = useQuery<ChatSession>({
    queryKey: ['chat-session', userName],
    queryFn: async () => {
      if (!userName.trim()) return null;
      const response = await apiRequest('GET', `/api/chat-session/${encodeURIComponent(userName)}`);
      if (response.status === 404) return null;
      return response.json();
    },
    enabled: !!userName.trim(),
  });

  // Update chat messages when chat session is loaded
  useEffect(() => {
    if (chatSession) {
      try {
        const parsedHistory = JSON.parse(chatSession.chat_history) as ChatMessage[];
        setChatMessages([
          { role: "assistant", content: "Witaj ponownie! Kontynuujmy naszą rozmowę." },
          ...parsedHistory
        ]);
        setChatSessionId(chatSession.id);
      } catch (error) {
        console.error("Error parsing chat history:", error);
      }
    }
  }, [chatSession]);
  
  useEffect(() => {
    if (chatContainerRef.current && isOpen) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isOpen]);
  
  // Reset rate limit after an hour
  useEffect(() => {
    if (requestCount >= maxRequestsPerHour) {
      setIsRateLimited(true);
      const timer = setTimeout(() => {
        setRequestCount(0);
        setIsRateLimited(false);
      }, 60 * 60 * 1000); // 1 hour
      
      return () => clearTimeout(timer);
    }
  }, [requestCount]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim() || !userName.trim() || isRateLimited) return;
    
    // Check rate limiting
    if (requestCount >= maxRequestsPerHour) {
      setIsRateLimited(true);
      return;
    }
    
    const userMessage = `${userName}: ${chatInput.trim()}`;
    setChatInput("");
    
    // Add user message to chat
    const updatedMessages: ChatMessage[] = [...chatMessages, { role: "user", content: userMessage }];
    setChatMessages(updatedMessages);
    
    setIsLoading(true);
    setRequestCount(prev => prev + 1);
    
    try {
      const previousMessages = updatedMessages.slice(1); // Exclude welcome message
      
      // Send request to our API endpoint with name and chat history
      const response = await apiRequest("POST", "/api/estimate", { 
        query: chatInput.trim(),
        userName: userName.trim(),
        chatHistory: previousMessages
      });
      const data = await response.json();
      
      // Add AI response to chat
      const finalMessages: ChatMessage[] = [...updatedMessages, { role: "assistant", content: data.response }];
      setChatMessages(finalMessages);
      
      // Store chat session
      await storeChatSession(finalMessages.slice(1)); // Exclude welcome message
      
    } catch (error) {
      console.error("Error getting estimate:", error);
      setChatMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: "Przepraszam, mam problem z wygenerowaniem wyceny w tej chwili. Proszę spróbować ponownie później."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Store chat session in the database
  const storeChatSession = async (messagesHistory: ChatMessage[]) => {
    try {
      if (chatSessionId) {
        // Update existing session
        await apiRequest("PUT", `/api/chat-session/${chatSessionId}`, {
          chatHistory: JSON.stringify(messagesHistory),
          totalMessages: messagesHistory.length
        });
      } else {
        // Create new session
        const response = await apiRequest("POST", "/api/chat-session", {
          userName: userName.trim(),
          chatHistory: JSON.stringify(messagesHistory),
          totalMessages: messagesHistory.length
        });
        
        const newSession = await response.json();
        setChatSessionId(newSession.id);
      }
    } catch (error) {
      console.error("Error storing chat session:", error);
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleChat}
        className={`rounded-full p-3 shadow-lg ${isOpen ? "bg-gray-700 hover:bg-gray-800" : "bg-blue-600 hover:bg-blue-700"}`}
        size="icon"
        aria-label="Chat with us"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-gray-100 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-4 bg-blue-600 text-white">
              <h3 className="text-lg font-semibold">BudTeam Asystent</h3>
              <p className="text-sm text-white/80">Uzyskaj szybką wycenę</p>
            </div>
            
            <div 
              ref={chatContainerRef}
              className="h-80 overflow-y-auto p-4 space-y-4"
            >
              {chatMessages.map((message, index) => (
                <div 
                  key={index} 
                  className={`${
                    message.role === "assistant" 
                      ? "chat-bubble text-gray-800 bg-orange-200 p-3 rounded-lg rounded-bl-none max-w-[80%] border border-orange-300" 
                      : "chat-bubble ml-auto bg-gray-200 p-3 rounded-lg rounded-br-none max-w-[80%]"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="chat-bubble text-gray-800 bg-orange-200 p-3 rounded-lg rounded-bl-none max-w-[80%] flex items-center space-x-2 border border-orange-300">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-0"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300"></div>
                </div>
              )}
            </div>
            
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 px-2 py-1">
                Proszę napisać typ usługi, metraż pomieszczenia, typ materiału i wszystkie inne informacje które pomogą nam w wycenie. Maksymalnie 300 znaków.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Twoje imię..."
                  className="w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  disabled={isLoading}
                  required
                />
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value.slice(0, 300))}
                  placeholder="Opisz swój projekt..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  disabled={isLoading}
                  maxLength={300}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{chatInput.length}/300 znaków</span>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading || !userName.trim() || !chatInput.trim() || isRateLimited}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Wyślij
                </Button>
              </div>
              {isRateLimited && (
                <p className="text-xs text-red-500 mt-1">Przekroczono limit 10 zapytań na godzinę. Spróbuj ponownie później.</p>
              )}
            </form>
            
            <style>
              {`
              .chat-bubble {
                position: relative;
              }
              .chat-bubble.bg-orange-200:after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 10px;
                width: 0;
                height: 0;
                border: 10px solid transparent;
                border-top-color: #fed7aa;
                border-bottom: 0;
                margin-left: -10px;
                margin-bottom: -10px;
              }
              .chat-bubble.bg-gray-200:after {
                content: '';
                position: absolute;
                bottom: 0;
                right: 10px;
                width: 0;
                height: 0;
                border: 10px solid transparent;
                border-top-color: #e5e7eb;
                border-bottom: 0;
                margin-right: -10px;
                margin-bottom: -10px;
              }
              `}
            </style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
