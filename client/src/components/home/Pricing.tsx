import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Send, AlertCircle, Info } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PricingItem {
  id: number;
  service: string;
  price: string;
  unit: string;
  category: string;
}

const pricingItems: PricingItem[] = [
  // Naprawy i usługi podstawowe
  { id: 1, service: "Podstawowe usługi", price: "90 zł", unit: "za godzinę", category: "podstawowe" },
  { id: 2, service: "Naprawa płyt gipsowo-kartonowych", price: "200 zł", unit: "za miejsce", category: "podstawowe" },
  { id: 3, service: "Montaż oświetlenia", price: "150 zł", unit: "za punkt", category: "podstawowe" },
  { id: 4, service: "Malowanie wnętrz", price: "30 zł", unit: "za m²", category: "podstawowe" },
  { id: 5, service: "Montaż szafek", price: "250 zł", unit: "za szafkę", category: "podstawowe" },
  { id: 6, service: "Naprawa zamków", price: "120 zł", unit: "za sztukę", category: "podstawowe" },
  { id: 7, service: "Montaż karniszy", price: "80 zł", unit: "za sztukę", category: "podstawowe" },
  { id: 8, service: "Wymiana gniazdek/włączników", price: "60 zł", unit: "za sztukę", category: "podstawowe" },
  
  // Kuchnie i łazienki
  { id: 9, service: "Remont kuchni (mała)", price: "10 000 zł", unit: "od", category: "kuchnie-lazienki" },
  { id: 10, service: "Remont kuchni (duża)", price: "20 000 zł", unit: "od", category: "kuchnie-lazienki" },
  { id: 11, service: "Remont łazienki (mała)", price: "8 000 zł", unit: "od", category: "kuchnie-lazienki" },
  { id: 12, service: "Remont łazienki (duża)", price: "15 000 zł", unit: "od", category: "kuchnie-lazienki" },
  { id: 13, service: "Montaż kabiny prysznicowej", price: "500 zł", unit: "od", category: "kuchnie-lazienki" },
  { id: 14, service: "Montaż wanny", price: "450 zł", unit: "od", category: "kuchnie-lazienki" },
  { id: 15, service: "Montaż umywalki", price: "300 zł", unit: "od", category: "kuchnie-lazienki" },
  { id: 16, service: "Montaż toalety", price: "350 zł", unit: "od", category: "kuchnie-lazienki" },
  
  // Prace wykończeniowe
  { id: 17, service: "Układanie płytek", price: "120 zł", unit: "za m²", category: "wykonczeniowe" },
  { id: 18, service: "Wymiana drzwi wewnętrznych", price: "350 zł", unit: "za sztukę", category: "wykonczeniowe" },
  { id: 19, service: "Wymiana okien", price: "800 zł", unit: "za m²", category: "wykonczeniowe" },
  { id: 20, service: "Montaż paneli podłogowych", price: "60 zł", unit: "za m²", category: "wykonczeniowe" },
  { id: 21, service: "Układanie parkietu", price: "120 zł", unit: "za m²", category: "wykonczeniowe" },
  { id: 22, service: "Tynkowanie", price: "70 zł", unit: "za m²", category: "wykonczeniowe" },
  { id: 23, service: "Szpachlowanie", price: "40 zł", unit: "za m²", category: "wykonczeniowe" },
  { id: 24, service: "Tapetowanie", price: "50 zł", unit: "za m²", category: "wykonczeniowe" },
  
  // Instalacje
  { id: 25, service: "Instalacja elektryczna", price: "100 zł", unit: "za punkt", category: "instalacje" },
  { id: 26, service: "Instalacja hydrauliczna", price: "150 zł", unit: "za punkt", category: "instalacje" },
  { id: 27, service: "Montaż ogrzewania podłogowego", price: "200 zł", unit: "za m²", category: "instalacje" },
  { id: 28, service: "Wymiana grzejników", price: "300 zł", unit: "za sztukę", category: "instalacje" },
  { id: 29, service: "Instalacja odkurzacza centralnego", price: "3 000 zł", unit: "od", category: "instalacje" },
  { id: 30, service: "Instalacja klimatyzacji", price: "3 500 zł", unit: "od", category: "instalacje" },
  
  // Prace zewnętrzne
  { id: 31, service: "Montaż ogrodzenia", price: "200 zł", unit: "za mb", category: "zewnetrzne" },
  { id: 32, service: "Budowa tarasu", price: "400 zł", unit: "za m²", category: "zewnetrzne" },
  { id: 33, service: "Układanie kostki brukowej", price: "150 zł", unit: "za m²", category: "zewnetrzne" },
  { id: 34, service: "Montaż rynien", price: "90 zł", unit: "za mb", category: "zewnetrzne" },
  { id: 35, service: "Montaż drzwi zewnętrznych", price: "700 zł", unit: "za sztukę", category: "zewnetrzne" },
  { id: 36, service: "Instalacja oświetlenia ogrodowego", price: "150 zł", unit: "za punkt", category: "zewnetrzne" }
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Pricing() {
  const [chatInput, setChatInput] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameSubmitted, setUserNameSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [queryCount, setQueryCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: "assistant", 
      content: "Witaj! Jestem Twoim asystentem AI. Podaj swoje imię, aby rozpocząć wycenę."
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

  const handleNameSubmit = () => {
    if (!userName.trim()) {
      setErrorMessage("Proszę podać swoje imię, aby kontynuować.");
      return;
    }

    setUserNameSubmitted(true);
    setErrorMessage("");
    setChatMessages(prev => [
      ...prev,
      { role: "user", content: userName },
      { 
        role: "assistant", 
        content: `Cześć ${userName}! Powiedz mi, jakiego rodzaju prace budowlane planujesz? Na przykład: "Chcę odnowić łazienkę 5m² z wymianą płytek i armatury" lub "Potrzebuję pomalować mieszkanie 60m²". Im więcej szczegółów podasz, tym dokładniejsza będzie wycena.`
      }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;
    
    // Character limit check
    if (chatInput.length > 300) {
      setErrorMessage("Wiadomość może zawierać maksymalnie 300 znaków. Proszę skrócić zapytanie.");
      return;
    }

    // Rate limiting check
    if (queryCount >= 10) {
      setErrorMessage("Przekroczono limit 10 zapytań na godzinę. Proszę spróbować później.");
      return;
    }

    setErrorMessage("");
    const userMessage = chatInput.trim();
    setChatInput("");
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    setIsLoading(true);
    setQueryCount(prev => prev + 1);
    
    try {
      // Filter out initial bot message and get all the relevant conversation history
      const relevantChatHistory = chatMessages.filter(message => 
        // Skip the very first bot greeting
        !(message.role === "assistant" && message.content.includes("Witaj! Jestem Twoim asystentem AI"))
      );
      
      // Send request to our API endpoint with full chat history
      const response = await apiRequest("POST", "/api/estimate", { 
        query: userMessage,
        userName: userName,
        chatHistory: relevantChatHistory
      });
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
              <div className="p-6 overflow-auto">
                <Tabs defaultValue="podstawowe" className="w-full">
                  <TabsList className="grid grid-cols-5 w-full mb-8">
                    <TabsTrigger value="podstawowe">Podstawowe</TabsTrigger>
                    <TabsTrigger value="kuchnie-lazienki">Kuchnie i Łazienki</TabsTrigger>
                    <TabsTrigger value="wykonczeniowe">Wykończeniowe</TabsTrigger>
                    <TabsTrigger value="instalacje">Instalacje</TabsTrigger>
                    <TabsTrigger value="zewnetrzne">Zewnętrzne</TabsTrigger>
                  </TabsList>
                  
                  {["podstawowe", "kuchnie-lazienki", "wykonczeniowe", "instalacje", "zewnetrzne"].map((category) => (
                    <TabsContent key={category} value={category} className="max-h-[400px] overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usługa</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena Początkowa</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jednostka</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pricingItems
                            .filter(item => item.category === category)
                            .map((item) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.service}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </TabsContent>
                  ))}
                </Tabs>
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
            <div className="p-6 h-[400px] flex flex-col bg-gray-50">
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-auto mb-4 space-y-4"
              >
                {chatMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`${
                      message.role === "assistant" 
                        ? "chat-bubble text-white bg-orange-500 p-3 rounded-lg rounded-bl-none max-w-[80%] shadow-sm" 
                        : "chat-bubble ml-auto bg-gray-100 text-gray-800 p-3 rounded-lg rounded-br-none max-w-[80%] shadow-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-bubble text-white bg-orange-500 p-3 rounded-lg rounded-bl-none max-w-[80%] flex items-center space-x-2 shadow-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
                  </div>
                )}
              </div>
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              <div className="mt-auto">
                {!userNameSubmitted ? (
                  <div className="space-y-3">
                    <Alert variant="default" className="bg-blue-50 mb-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription className="text-sm text-blue-700">
                        Aby skorzystać z kalkulatora wyceny, podaj swoje imię.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Twoje imię..."
                        disabled={isLoading}
                        maxLength={30}
                      />
                      <button
                        type="button"
                        onClick={handleNameSubmit}
                        className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition duration-150 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 mb-1">
                        <span className={chatInput.length > 300 ? "text-red-500 font-bold" : ""}>
                          {chatInput.length}/300 znaków
                        </span>
                        <span className="mx-2">•</span>
                        <span className={queryCount >= 10 ? "text-red-500 font-bold" : ""}>
                          {queryCount}/10 zapytań
                        </span>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="flex">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Opisz swój projekt budowlany..."
                        disabled={isLoading || queryCount >= 10}
                      />
                      <button
                        type="submit"
                        className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition duration-150 disabled:opacity-50"
                        disabled={isLoading || queryCount >= 10 || !chatInput.trim() || chatInput.length > 300}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
