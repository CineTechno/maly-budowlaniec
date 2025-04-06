import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

// Form validation schema
const availabilityFormSchema = z.object({
  date: z.date({
    required_error: "Proszę wybrać datę",
  }),
  start_time: z.string().min(1, {
    message: "Proszę podać godzinę rozpoczęcia",
  }),
  end_time: z.string().min(1, {
    message: "Proszę podać godzinę zakończenia",
  }),
  available: z.boolean().default(true),
});

type AvailabilityFormValues = z.infer<typeof availabilityFormSchema>;

type CalendarAvailability = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
  created_at?: string;
};

export function CalendarForm() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form handling
  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: {
      date: new Date(),
      start_time: "09:00",
      end_time: "17:00",
      available: true,
    },
  });

  // Query for calendar availability
  const {
    data: availabilityData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/api/calendar"],
    queryFn: async () => {
      const res = await fetch("/api/calendar");
      if (!res.ok) throw new Error("Failed to fetch calendar data");
      return res.json() as Promise<CalendarAvailability[]>;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (values: AvailabilityFormValues) => {
      const formattedDate = format(values.date, "yyyy-MM-dd");
      const data = {
        ...values,
        date: formattedDate,
      };
      const res = await apiRequest("POST", "/api/admin/calendar", data);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create availability");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar"] });
      toast({
        title: "Sukces",
        description: "Dostępność została zapisana",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się zapisać dostępności",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: number;
      values: AvailabilityFormValues;
    }) => {
      const formattedDate = format(values.date, "yyyy-MM-dd");
      const data = {
        ...values,
        date: formattedDate,
      };
      const res = await apiRequest("PUT", `/api/admin/calendar/${id}`, data);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update availability");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar"] });
      toast({
        title: "Sukces",
        description: "Dostępność została zaktualizowana",
      });
      setEditingId(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się zaktualizować dostępności",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/calendar/${id}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete availability");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar"] });
      toast({
        title: "Sukces",
        description: "Dostępność została usunięta",
      });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się usunąć dostępności",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: AvailabilityFormValues) => {
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, values });
    } else {
      createMutation.mutate(values);
    }
  };

  // Handle edit click
  const handleEdit = (item: CalendarAvailability) => {
    setEditingId(item.id);
    form.reset({
      date: new Date(item.date),
      start_time: item.start_time,
      end_time: item.end_time,
      available: item.available,
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    form.reset();
  };

  // Filter availability by selected date
  const filteredAvailability = selectedDate
    ? availabilityData?.filter(
        (item) => item.date === format(selectedDate, "yyyy-MM-dd")
      ) || []
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendar section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Wybierz datę</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md p-2 bg-white"
          locale={pl}
        />
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">
            Istniejące terminy ({format(selectedDate || new Date(), "d MMMM yyyy", { locale: pl })})
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredAvailability.length === 0 ? (
            <p className="text-gray-500 text-sm">Brak zapisanych terminów na ten dzień</p>
          ) : (
            <div className="space-y-2">
              {filteredAvailability.map((item) => (
                <Card key={item.id} className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {item.start_time} - {item.end_time}
                    </p>
                    <p className={`text-sm ${item.available ? "text-green-600" : "text-red-600"}`}>
                      {item.available ? "Dostępny" : "Niedostępny"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(item)}
                    >
                      Edytuj
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteMutation.mutate(item.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form section */}
      <div>
        <h3 className="text-lg font-medium mb-4">
          {editingId !== null ? "Edytuj termin" : "Dodaj nowy termin"}
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={pl}
                        disabled={createMutation.isPending || updateMutation.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Czas rozpoczęcia</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        disabled={createMutation.isPending || updateMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Czas zakończenia</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        disabled={createMutation.isPending || updateMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Dostępność</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Określ czy termin jest dostępny dla klientów
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={createMutation.isPending || updateMutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end space-x-2">
              {editingId !== null && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Anuluj
                </Button>
              )}
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId !== null ? "Aktualizowanie..." : "Zapisywanie..."}
                  </>
                ) : (
                  <>
                    {editingId !== null ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {editingId !== null ? "Zaktualizuj termin" : "Dodaj termin"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}