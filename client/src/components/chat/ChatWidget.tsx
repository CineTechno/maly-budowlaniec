import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: "assistant", 
      content: "Hi there! I'm your AI assistant. Describe your project, and I'll give you a price estimate."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (chatContainerRef.current && isOpen) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isOpen]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatInput("");
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    setIsLoading(true);
    
    try {
      // Send request to our API endpoint
      const response = await apiRequest("POST", "/api/estimate", { query: userMessage });
      const data = await response.json();
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error getting estimate:", error);
      setChatMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: "Sorry, I'm having trouble generating an estimate right now. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleChat}
        className={`rounded-full p-3 shadow-lg ${isOpen ? "bg-gray-700 hover:bg-gray-800" : "bg-primary-500 hover:bg-primary-600"}`}
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
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-4 bg-primary-500 text-white">
              <h3 className="text-lg font-semibold">HandyPro Assistant</h3>
              <p className="text-sm text-white/80">Get a quick price estimate</p>
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
                      ? "chat-bubble text-white bg-primary-500 p-3 rounded-lg rounded-bl-none max-w-[80%]" 
                      : "chat-bubble ml-auto bg-gray-200 p-3 rounded-lg rounded-br-none max-w-[80%]"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="chat-bubble text-white bg-primary-500 p-3 rounded-lg rounded-bl-none max-w-[80%] flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-0"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Describe your project..."
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="rounded-l-none bg-primary-500 hover:bg-primary-600"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            
            <style jsx>{`
              .chat-bubble {
                position: relative;
              }
              .chat-bubble.bg-primary-500:after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 10px;
                width: 0;
                height: 0;
                border: 10px solid transparent;
                border-top-color: hsl(var(--primary));
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
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
