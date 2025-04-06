import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, addDays } from "date-fns";
import { pl } from "date-fns/locale";

// Define status types for days
type DayStatus = "dostepny" | "zajety" | "niedostepny";

interface DayAvailability {
  [date: string]: DayStatus;
}

// Generate availability for the next 14 days
const generateCalendarAvailability = (): DayAvailability => {
  const availability: DayAvailability = {};
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayOfWeek = date.getDay();
    
    // Assign statuses based on day of week and randomness
    if (dayOfWeek === 0) {
      // Sundays are always unavailable
      availability[dateStr] = "niedostepny";
    } else if (dayOfWeek === 6) {
      // Saturdays are mostly busy
      availability[dateStr] = Math.random() < 0.7 ? "zajety" : "dostepny";
    } else {
      // Weekdays have mixed availability
      const random = Math.random();
      if (random < 0.5) {
        availability[dateStr] = "dostepny";
      } else if (random < 0.8) {
        availability[dateStr] = "zajety";
      } else {
        availability[dateStr] = "niedostepny";
      }
    }
  }
  
  return availability;
};

const availability: DayAvailability = generateCalendarAvailability();

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<DayStatus | undefined>(
    date ? availability[format(date, "yyyy-MM-dd")] : undefined
  );
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const dateStr = format(newDate, "yyyy-MM-dd");
      setSelectedStatus(availability[dateStr]);
    } else {
      setSelectedStatus(undefined);
    }
  };

  // Helper functions for day status
  const isDayDostepny = (day: Date): boolean => {
    const dateStr = format(day, "yyyy-MM-dd");
    return availability[dateStr] === "dostepny";
  };

  const isDayZajety = (day: Date): boolean => {
    const dateStr = format(day, "yyyy-MM-dd");
    return availability[dateStr] === "zajety";
  };

  const isDayNiedostepny = (day: Date): boolean => {
    const dateStr = format(day, "yyyy-MM-dd");
    return availability[dateStr] === "niedostepny";
  };

  return (
    <section id="calendar" className="py-16 md:py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Kalendarz Dostępności</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Sprawdź dostępne terminy i zaplanuj swoją wizytę z naszym zespołem.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[600px]">
          <motion.div 
            className="bg-white rounded-lg border border-primary-300 shadow-md overflow-hidden p-6 flex flex-col h-full"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Wybierz Datę</h3>
            <div className="flex-grow flex flex-col">
              <CalendarUI
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                locale={pl}
                className="w-full flex-grow"
                classNames={{
                  root: "h-full flex flex-col",
                  months: "flex-grow",
                  month: "h-full",
                  table: "h-full",
                  row: "flex-1",
                  head_row: "flex-shrink-0",
                  cell: "h-12 w-12 text-center focus-within:relative p-0 relative",
                  day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
                }}
                modifiers={{
                  dostepny: (day) => isDayDostepny(day),
                  zajety: (day) => isDayZajety(day),
                  niedostepny: (day) => isDayNiedostepny(day)
                }}
                modifiersClassNames={{
                  dostepny: "font-bold text-green-600 bg-green-50 border border-green-100",
                  zajety: "font-bold text-orange-600 bg-orange-50 border border-orange-100",
                  niedostepny: "font-bold text-red-600 bg-red-50 border border-red-100"
                }}
                disabled={{ before: new Date() }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg border border-primary-300 shadow-md overflow-hidden p-6 flex flex-col h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              {date ? `Status (${format(date, "d MMMM yyyy", { locale: pl })})` : "Wybierz datę, aby zobaczyć status"}
            </h3>
            
            {date && selectedStatus ? (
              <div className="mt-8 text-center">
                <div className={`
                  inline-block text-2xl font-bold p-6 rounded-lg mb-4
                  ${selectedStatus === "dostepny" ? "bg-green-100 text-green-800 border-2 border-green-500" : 
                    selectedStatus === "zajety" ? "bg-orange-100 text-orange-800 border-2 border-orange-500" : 
                    "bg-red-100 text-red-800 border-2 border-red-500"}
                `}>
                  {selectedStatus === "dostepny" ? "Dostępny" : 
                   selectedStatus === "zajety" ? "Zajęty" : 
                   "Niedostępny"}
                </div>
                
                <p className="mt-4 text-gray-700">
                  {selectedStatus === "dostepny" ? 
                    "W tym dniu możemy wykonać wszystkie usługi. Zadzwoń, aby umówić spotkanie." : 
                   selectedStatus === "zajety" ? 
                    "W tym dniu mamy ograniczoną dostępność. Zadzwoń, aby sprawdzić możliwości." : 
                    "W tym dniu nie jesteśmy dostępni. Wybierz inny dzień."}
                </p>
              </div>
            ) : date ? (
              <div className="text-center py-8 text-gray-500">
                <p>Brak informacji o dostępności w tym dniu</p>
                <p className="mt-2">Wybierz inną datę lub skontaktuj się z nami telefonicznie</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Wybierz datę w kalendarzu, aby zobaczyć status dostępności</p>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <div className="flex flex-col justify-center items-center mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-700">Dostępny</span>
                  
                  <div className="w-4 h-4 rounded-full bg-orange-500 mx-4 mr-2"></div>
                  <span className="text-sm text-gray-700">Zajęty</span>
                  
                  <div className="w-4 h-4 rounded-full bg-red-500 mx-4 mr-2"></div>
                  <span className="text-sm text-gray-700">Niedostępny</span>
                </div>
              </div>
              <p className="text-gray-600">
                Aby zarezerwować wizytę, zadzwoń do nas: <span className="font-semibold text-primary-700">+48 123 456 789</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}