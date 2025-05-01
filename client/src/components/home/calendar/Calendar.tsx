import { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import React from "react";
import CalendarGrid from "./CalendarGrid.tsx";
import CalendarHeader from "./CalendarHeader";
import Availability from "./Availability";
import mockAvailability from "./mockAvailability.ts";
import MonthSelect from "@/components/home/calendar/MonthSelect.tsx";

// Define status types for days
export type DayStatus = "dostepny" | "zajety" | "niedostepny";

export interface DayAvailability {
  [date: string]: DayStatus;
}

// Generate mockAvailability for the next 14 days

export default function Calendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<DayStatus>(
    mockAvailability[format(date, "yyyy-MM-dd")]
  );

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleDateSelect = (newDate: Date) => {
    setDate(newDate);
    const dateStr = format(newDate, "yyyy-MM-dd");
    setSelectedStatus(mockAvailability[dateStr]);
  };
  // Helper functions for day status
  const isDayDostepny = (day: Date): boolean => {
    const dateStr = format(day, "yyyy-MM-dd");
    return mockAvailability[dateStr] === "dostepny";
  };

  const isDayZajety = (day: Date): boolean => {
    const dateStr = format(day, "yyyy-MM-dd");
    return mockAvailability[dateStr] === "zajety";
  };

  const isDayNiedostepny = (day: Date): boolean => {
    const dateStr = format(day, "yyyy-MM-dd");
    return mockAvailability[dateStr] === "niedostepny";
  };
  return (
    <section id="calendar" className="py-2 bg-white" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <CalendarHeader></CalendarHeader>
        </motion.div>
        <MonthSelect/>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="basis-2/3">
            <CalendarGrid
              mockAvailability={mockAvailability}
              setSelectedStatus={setSelectedStatus}
            ></CalendarGrid>
          </div>
          <div className="basis-1/3 h-1/2">
            <Availability
              date={date}
              selectedStatus={selectedStatus}
            ></Availability>
          </div>
        </div>
      </div>
    </section>
  );
}
