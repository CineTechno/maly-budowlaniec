import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { Loader2, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

type EstimateRequest = {
  id: number;
  query: string;
  response: string;
  user_name: string | null;
  ip_address: string | null;
  created_at: string;
};

export function ChatQueries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const queriesPerPage = 5;

  // Fetch estimate requests from backend
  const { data: queries, isLoading, isError } = useQuery({
    queryKey: ["/api/admin/estimates"],
    queryFn: async () => {
      const res = await fetch("/api/admin/estimates");
      if (!res.ok) throw new Error("Failed to fetch chat queries");
      return res.json() as Promise<EstimateRequest[]>;
    }
  });

  // Filter and sort queries
  const filteredQueries = queries
    ? queries
        .filter(
          (query) =>
            query.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (query.user_name && query.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredQueries.length / queriesPerPage);
  const indexOfLastQuery = currentPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
  const currentQueries = filteredQueries.slice(indexOfFirstQuery, indexOfLastQuery);

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
          placeholder="Wyszukaj zapytania..."
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
      ) : filteredQueries.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          Brak zapytań do wyświetlenia
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {currentQueries.map((query) => (
              <Card key={query.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-md">
                        {query.user_name ? query.user_name : "Anonimowy użytkownik"}
                      </CardTitle>
                      <CardDescription>
                        {formatDate(query.created_at)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      ID: {query.id}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h4 className="font-medium text-sm mb-1">Zapytanie:</h4>
                    <p className="text-sm">{query.query}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-md">
                    <h4 className="font-medium text-sm mb-1">Odpowiedź:</h4>
                    <p className="text-sm whitespace-pre-line">{query.response}</p>
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