import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { Loader2, Mail, Phone, Search, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

type ContactRequest = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
};

export function ContactRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  // Fetch contact requests from backend
  const { data: contacts, isLoading, isError } = useQuery({
    queryKey: ["/api/admin/contacts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/contacts");
      if (!res.ok) throw new Error("Failed to fetch contact requests");
      return res.json() as Promise<ContactRequest[]>;
    }
  });

  // Filter and sort contact requests
  const filteredContacts = contacts
    ? contacts
        .filter(
          (contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.message.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredContacts.length / requestsPerPage);
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstRequest, indexOfLastRequest);

  // Format date to Polish locale
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMMM yyyy, HH:mm", { locale: pl });
    } catch (error) {
      return dateString;
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Create pagination elements
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <PaginationItem key={i}>
        <PaginationLink
          onClick={() => handlePageChange(i)}
          isActive={currentPage === i}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Wyszukaj w zapytaniach kontaktowych..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : isError ? (
        <div className="text-center p-8 text-red-500">
          Wystąpił błąd podczas pobierania danych
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          Brak zapytań kontaktowych do wyświetlenia
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {currentContacts.map((contact) => (
              <Card key={contact.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-md">
                        {contact.name}
                      </CardTitle>
                      <CardDescription>
                        {formatDate(contact.created_at)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      ID: {contact.id}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-blue-600" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-sm mb-1">Wiadomość:</h4>
                    <p className="text-sm whitespace-pre-line">{contact.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {paginationItems}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}