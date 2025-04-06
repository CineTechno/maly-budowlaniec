import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, addDays } from "date-fns";
import { pl } from "date-fns/locale";

// This function generates random time slots for demonstration purposes
interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Availability {
  [date: string]: TimeSlot[];
}

const generateAvailabilitySlots = (): TimeSlot[] => {
  const timeSlots: TimeSlot[] = [];
  const startTimes = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  
  for (let i = 0; i < startTimes.length; i++) {
    // Randomly decide if this time slot is available (70% chance of being available)
    if (Math.random() < 0.7) {
      timeSlots.push({
        startTime: `${startTimes[i]}:00`,
        endTime: `${startTimes[i] + 1}:00`,
        available: true
      });
    }
  }
  
  return timeSlots;
};

// Generate availability for the next 14 days
const generateCalendarAvailability = (): Availability => {
  const availability: Availability = {};
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");
    
    // Don't generate slots for Sundays (day 0)
    if (date.getDay() !== 0) {
      availability[dateStr] = generateAvailabilitySlots();
    } else {
      availability[dateStr] = []; // No availability on Sundays
    }
  }
  
  return availability;
};

const availability: Availability = generateCalendarAvailability();

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState(
    date ? availability[format(date, "yyyy-MM-dd")] || [] : []
  );
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const dateStr = format(newDate, "yyyy-MM-dd");
      setAvailableSlots(availability[dateStr] || []);
    } else {
      setAvailableSlots([]);
    }
  };

  const isSlotsAvailable = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    return availability[dateStr] && availability[dateStr].length > 0;
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
                  available: (day) => isSlotsAvailable(day),
                }}
                modifiersClassNames={{
                  available: "font-bold text-primary-600 bg-primary-50",
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
              {date ? `Dostępne godziny (${format(date, "d MMMM yyyy", { locale: pl })})` : "Wybierz datę, aby zobaczyć dostępne godziny"}
            </h3>
            
            {date && availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSlots.map((slot: TimeSlot, index: number) => (
                  <div 
                    key={index}
                    className="bg-primary-50 border border-primary-100 text-primary-800 rounded-md p-3 text-center hover:bg-primary-100 cursor-pointer transition-colors"
                  >
                    {slot.startTime} - {slot.endTime}
                  </div>
                ))}
              </div>
            ) : date ? (
              <div className="text-center py-8 text-gray-500">
                <p>Brak dostępnych terminów w tym dniu</p>
                <p className="mt-2">Wybierz inną datę lub skontaktuj się z nami telefonicznie</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Wybierz datę w kalendarzu, aby zobaczyć dostępne godziny</p>
              </div>
            )}
            
            <div className="mt-8 text-center">
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