import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PricingItem {
  id: number;
  service: string;
  price: string;
  unit: string;
}

const pricingItems: PricingItem[] = [
  { id: 1, service: "Basic Handyman Services", price: "$75", unit: "per hour" },
  { id: 2, service: "Drywall Repair", price: "$150", unit: "per patch" },
  { id: 3, service: "Tile Installation", price: "$12", unit: "per sq ft" },
  { id: 4, service: "Kitchen Remodel", price: "$5,000", unit: "starting at" },
  { id: 5, service: "Bathroom Remodel", price: "$3,500", unit: "starting at" },
  { id: 6, service: "Light Fixture Installation", price: "$85", unit: "per fixture" },
  { id: 7, service: "Fence Installation", price: "$25", unit: "per linear ft" },
  { id: 8, service: "Deck Building", price: "$35", unit: "per sq ft" },
  { id: 9, service: "Interior Painting", price: "$2.50", unit: "per sq ft" },
  { id: 10, service: "Cabinet Installation", price: "$100", unit: "per cabinet" }
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Pricing() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: "assistant", 
      content: "Hi there! I'm your AI assistant. Describe your project, and I'll give you a price estimate."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Pricing</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Get an estimate for your specific project.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="col-span-1 lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-primary-500 text-white">
                <h3 className="text-xl font-bold">Service Price List</h3>
                <p className="text-white/80">Starting prices - final quotes depend on project specifics</p>
              </div>
              <div className="p-6 overflow-auto max-h-[500px]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pricingItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.service}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
          
          {/* AI Chat Estimator */}
          <motion.div 
            id="ai-chat"
            className="bg-white rounded-lg shadow-md overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6 bg-secondary-500 text-white">
              <h3 className="text-xl font-bold">AI Price Estimator</h3>
              <p className="text-white/80">Describe your project for an instant estimate</p>
            </div>
            <div className="p-6 h-[400px] flex flex-col">
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-auto mb-4 space-y-4"
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
              <div className="mt-auto">
                <form onSubmit={handleSubmit} className="flex">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe your project..."
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="bg-primary-500 text-white px-4 py-2 rounded-r-md hover:bg-primary-600 transition duration-150 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
