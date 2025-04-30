import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Calendar as CalendarUI } from "@/components/ui/calendar.tsx";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  getDay,
  getDayOfYear, getDate
} from "date-fns";
import { pl } from "date-fns/locale";
import React from "react";
import CalendarGrid from "@/components/home/calendar/CalendarGrid.tsx";

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

      // TITLE

        <section id="calendar" className="py-8 md:py-8 bg-white" ref={ref}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                className="text-center mb-12"
                initial={{opacity: 0, y: 20}}
                animate={inView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                transition={{duration: 0.6}}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Kalendarz Dostępności</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Sprawdź dostępne terminy i zaplanuj swoją wizytę z naszym zespołem.
              </p>
            </motion.div>

            {/*CALENDAR GRID*/}

            <CalendarGrid></CalendarGrid>
          </div>
        </section>
  )

}

