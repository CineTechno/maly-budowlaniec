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
  { id: 1, service: "Podstawowe usługi", price: "90 zł", unit: "za godzinę" },
  { id: 2, service: "Naprawa płyt gipsowo-kartonowych", price: "200 zł", unit: "za miejsce" },
  { id: 3, service: "Układanie płytek", price: "120 zł", unit: "za m²" },
  { id: 4, service: "Remont kuchni", price: "20 000 zł", unit: "od" },
  { id: 5, service: "Remont łazienki", price: "15 000 zł", unit: "od" },
  { id: 6, service: "Montaż oświetlenia", price: "150 zł", unit: "za punkt" },
  { id: 7, service: "Montaż ogrodzenia", price: "200 zł", unit: "za mb" },
  { id: 8, service: "Budowa tarasu", price: "400 zł", unit: "za m²" },
  { id: 9, service: "Malowanie wnętrz", price: "30 zł", unit: "za m²" },
  { id: 10, service: "Montaż szafek", price: "250 zł", unit: "za szafkę" },
  { id: 11, service: "Wymiana drzwi wewnętrznych", price: "350 zł", unit: "za sztukę" },
  { id: 12, service: "Wymiana okien", price: "800 zł", unit: "za m²" },
  { id: 13, service: "Instalacja elektryczna", price: "100 zł", unit: "za punkt" },
  { id: 14, service: "Instalacja hydrauliczna", price: "150 zł", unit: "za punkt" },
  { id: 15, service: "Montaż paneli podłogowych", price: "60 zł", unit: "za m²" },
  { id: 16, service: "Układanie parkietu", price: "120 zł", unit: "za m²" },
  { id: 17, service: "Wyburzanie ścian", price: "300 zł", unit: "za m²" },
  { id: 18, service: "Tynkowanie", price: "70 zł", unit: "za m²" }
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
      content: "Witaj! Jestem Twoim asystentem AI. Opisz swój projekt, a przedstawię Ci szacunkową wycenę."
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
          content: "Przepraszam, mam problem z wygenerowaniem wyceny w tej chwili. Proszę spróbować ponownie później."
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Cennik Usług</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Przejrzyste ceny bez ukrytych opłat. Uzyskaj indywidualną wycenę dla swojego projektu.
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
              <div className="p-6 bg-primary-600 text-white">
                <h3 className="text-xl font-bold">Lista Cen Usług</h3>
                <p className="text-white/80">Ceny wyjściowe - ostateczne wyceny zależą od specyfiki projektu</p>
              </div>
              <div className="p-6 overflow-auto max-h-[500px]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usługa</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena Początkowa</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jednostka</th>
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
            <div className="p-6 bg-orange-500 text-white">
              <h3 className="text-xl font-bold">Kalkulator Wyceny AI</h3>
              <p className="text-white/80">Opisz swój projekt, aby otrzymać natychmiastową wycenę</p>
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
                        ? "chat-bubble text-white bg-primary-600 p-3 rounded-lg rounded-bl-none max-w-[80%]" 
                        : "chat-bubble ml-auto bg-gray-200 p-3 rounded-lg rounded-br-none max-w-[80%]"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-bubble text-white bg-primary-600 p-3 rounded-lg rounded-bl-none max-w-[80%] flex items-center space-x-2">
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
                    placeholder="Opisz swój projekt..."
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition duration-150 disabled:opacity-50"
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
