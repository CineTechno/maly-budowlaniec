import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Send, AlertCircle, Info } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { pricingItems } from "../../../../server/pricingItems";
import React from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Pricing() {
  const [chatInput, setChatInput] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(1243534523423523);
  const [userNameSubmitted, setUserNameSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [queryCount, setQueryCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Witaj! Jestem Twoim asystentem AI. Podaj swoje imię, aby rozpocząć wycenę.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // NAME SUBMIT

  const handleNameSubmit = () => {
    if (!userName.trim()) {
      setErrorMessage("Proszę podać swoje imię, aby kontynuować.");
      return;
    }

    setUserNameSubmitted(true);
    setErrorMessage("");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userName },
      {
        role: "assistant",
        content: `Cześć ${userName}! Powiedz mi, jakiego rodzaju prace budowlane planujesz? Na przykład: "Chcę odnowić łazienkę 5m² z wymianą płytek i armatury" lub "Potrzebuję pomalować mieszkanie 60m²". Im więcej szczegółów podasz, tym dokładniejsza będzie wycena.`,
      },
    ]);
  };

  // QUERY SUBMIT

  const handleSubmitUserQuery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatInput.trim()) return;

    // Character limit check
    if (chatInput.length > 300) {
      setErrorMessage(
        "Wiadomość może zawierać maksymalnie 300 znaków. Proszę skrócić zapytanie."
      );
      return;
    }

    // Rate limiting check
    if (queryCount >= 10) {
      setErrorMessage(
        "Przekroczono limit 10 zapytań na godzinę. Proszę spróbować później."
      );
      return;
    }

    setErrorMessage("");
    const userMessage = chatInput.trim();
    setChatInput("");

    const updatedChatMessages: ChatMessage[] = [
      ...chatMessages,
      { role: "user", content: userMessage },
    ];

    // Add user message to chatuserMessage
    setChatMessages(updatedChatMessages);

    setIsLoading(true);
    setQueryCount((prev) => prev + 1);
    // POSTING TO ESTIMATE

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedChatMessages }),
      });

      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      console.error("Error getting estimate:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Przepraszam, mam problem z wygenerowaniem wyceny w tej chwili. Proszę spróbować ponownie później.",
        },
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
    <section id="pricing" className="py-12 md:py-24 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Cennik Usług
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Przejrzyste ceny bez ukrytych opłat. Uzyskaj indywidualną wycenę dla
            swojego projektu.
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
              <div className="p-6 pb-4 bg-primary-600 text-black">
                <h3 className="text-xl font-bold">Lista Cen Usług</h3>
                <p className="text-black/80">
                  Ceny wyjściowe - ostateczne wyceny zależą od specyfiki
                  projektu
                </p>
              </div>
              <div className="p-6 pt-2">
                <Tabs defaultValue="podstawowe" className="w-full">
                  <TabsList
                    className="w-full flex justify-around overflow-x-auto overflow-y-hidden touch-auto
  [scrollbar-width:thin]
  [-ms-overflow-style:auto]
  [&::-webkit-scrollbar]:h-1
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full "
                  >
                    <TabsTrigger value="podstawowe">Podstawowe</TabsTrigger>
                    <TabsTrigger value="kuchnie-lazienki">
                      Kuchnie i Łazienki
                    </TabsTrigger>
                    <TabsTrigger value="wykonczeniowe">
                      Wykończeniowe
                    </TabsTrigger>
                    <TabsTrigger value="instalacje">Instalacje</TabsTrigger>
                    <TabsTrigger value="zewnetrzne">Zewnętrzne</TabsTrigger>
                  </TabsList>

                  {[
                    "podstawowe",
                    "kuchnie-lazienki",
                    "wykonczeniowe",
                    "instalacje",
                    "zewnetrzne",
                  ].map((category) => (
                    <TabsContent
                      key={category}
                      value={category}
                      className="max-h-[400px] overflow-y-auto"
                    >
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Usługa
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Cena Początkowa
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Jednostka
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pricingItems
                            .filter((item) => item.category === category)
                            .map((item) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.service}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.unit}
                                </td>
                              </tr>
                            ))}
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
              <p className="text-white/80">
                Opisz swój projekt, aby otrzymać natychmiastową wycenę
              </p>
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

              {/* NAME SUBMIT */}

              <div className="mt-auto">
                {!userNameSubmitted ? (
                  <div className="space-y-3">
                    <Alert variant="default" className="bg-blue-50 mb-2">
                      <AlertDescription className="text-sm text-blue-700">
                        Aby skorzystać z kalkulatora wyceny, podaj swoje imię.
                      </AlertDescription>
                    </Alert>

                    <div className="flex">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Twoje imię..."
                        disabled={isLoading}
                        maxLength={30}
                      />
                      <button
                        type="button"
                        onSubmit={handleNameSubmit}
                        className="!bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition duration-150 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // QUERY SUBMIT

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 mb-1">
                        <span
                          className={
                            chatInput.length > 300
                              ? "text-red-500 font-bold"
                              : ""
                          }
                        >
                          {chatInput.length}/300 znaków
                        </span>
                        <span className="mx-2">•</span>
                        <span
                          className={
                            queryCount >= 10 ? "text-red-500 font-bold" : ""
                          }
                        >
                          {queryCount}/10 zapytań
                        </span>
                      </div>
                    </div>

                    {/* SUBMIT FORM */}

                    <form onSubmit={handleSubmitUserQuery} className="flex">
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
                        disabled={
                          isLoading ||
                          queryCount >= 10 ||
                          !chatInput.trim() ||
                          chatInput.length > 300
                        }
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
