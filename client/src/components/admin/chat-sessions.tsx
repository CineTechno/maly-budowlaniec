import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Search, MessageSquare, Clock } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatSession = {
  id: number;
  user_name: string;
  started_at: string;
  chat_history: string; // JSON stringified chat history
  total_messages: number;
};

export function ChatSessions() {
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [parsedMessages, setParsedMessages] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: chatSessions, isLoading } = useQuery<ChatSession[]>({
    queryKey: ["/api/admin/chat-sessions"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Parse chat history when a session is selected
  useEffect(() => {
    if (selectedSession) {
      try {
        const messages = JSON.parse(selectedSession.chat_history) as ChatMessage[];
        setParsedMessages(messages);
      } catch (error) {
        console.error("Error parsing chat history:", error);
        setParsedMessages([]);
      }
    }
  }, [selectedSession]);

  const handleViewSession = (session: ChatSession) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };

  const filteredSessions = chatSessions?.filter(session => 
    session.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj po nazwie użytkownika..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : chatSessions?.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">Brak sesji czatu</h3>
          <p className="text-gray-600">Nie znaleziono żadnych sesji konwersacji.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Użytkownik</TableHead>
                <TableHead>Data rozpoczęcia</TableHead>
                <TableHead className="text-center">Liczba wiadomości</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.id}</TableCell>
                  <TableCell>{session.user_name}</TableCell>
                  <TableCell>
                    {format(new Date(session.started_at), "d MMMM yyyy, HH:mm", { locale: pl })}
                  </TableCell>
                  <TableCell className="text-center">{session.total_messages}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewSession(session)}
                    >
                      Podgląd
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Szczegóły konwersacji</DialogTitle>
            <DialogDescription>
              {selectedSession && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span>Użytkownik: <strong>{selectedSession.user_name}</strong></span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(selectedSession.started_at), "d MMMM yyyy, HH:mm", { locale: pl })}
                  </span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            {parsedMessages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === "assistant"
                    ? "bg-orange-200 border border-orange-300"
                    : "bg-gray-200 ml-auto"
                } ${message.role === "assistant" ? "mr-12" : "ml-12"}`}
              >
                <p className="text-sm">
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}