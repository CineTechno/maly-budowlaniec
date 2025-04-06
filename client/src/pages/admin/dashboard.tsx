import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

// Import admin dashboard components
import type { ReactNode } from "react";
import { CalendarForm } from "@/components/admin/calendar-form";
import { ChatQueries } from "@/components/admin/chat-queries";
import { ContactRequests } from "@/components/admin/contact-requests";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("calendar");

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-700">Panel Administratora</h1>
          <div className="flex items-center gap-4">
            {user && <span className="text-sm text-gray-600">Zalogowany jako: {user.username}</span>}
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="text-red-500 border-red-300 hover:bg-red-50"
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wylogowywanie...
                </>
              ) : (
                "Wyloguj się"
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calendar">Kalendarz dostępności</TabsTrigger>
            <TabsTrigger value="chat">Zapytania z czatu</TabsTrigger>
            <TabsTrigger value="contacts">Formularze kontaktowe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Zarządzanie dostępnością</h2>
              <CalendarForm />
            </div>
          </TabsContent>
          
          <TabsContent value="chat">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Historia zapytań z czatu</h2>
              <ChatQueries />
            </div>
          </TabsContent>
          
          <TabsContent value="contacts">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Formularze kontaktowe</h2>
              <ContactRequests />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}