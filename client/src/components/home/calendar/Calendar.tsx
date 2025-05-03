import { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import React from "react";
import CalendarGrid from "./CalendarGrid.tsx";
import CalendarHeader from "./CalendarHeader";
import Availability from "./Availability";
import mockAvailability from "../../../../../server/lib/mockAvailability.ts"
import MonthSelect from "@/components/home/calendar/MonthSelect.tsx";
import {CalendarContext} from "@/components/home/calendar/CalendarContext.tsx";

// Define status types for days
export type DayStatus = "Częściowo dostępny" | "Niedostępny" | "Dostępny"

export interface DayAvailability {
  start: string,
  end: string,
  status: DayStatus,
}

// Generate mockAvailability for the next 14 days

export default function Calendar({classname, isAdmin}:{classname: string, isAdmin: boolean}) {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<DayStatus>(
    mockAvailability[format(date, "yyyy-MM-dd")]
  );
  const [month, setMonth] = useState<Date>(

  )

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleDateSelect = (newDate: Date) => {
    setDate(newDate);
    const dateStr = format(newDate, "yyyy-MM-dd");
    setSelectedStatus(mockAvailability[dateStr]);
  };

  return (
      <CalendarContext.Provider value={{isAdmin}}>
    <section id="calendar" className={`${classname} bg - white" ref={ref}`}>
      <div className={`${classname}container mx-auto px-4 sm:px-6 lg:px-8`}>
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <CalendarHeader></CalendarHeader>
        </motion.div>
        <MonthSelect date={date} setDate={setDate}/>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="basis-2/3">
            <CalendarGrid
              setSelectedStatus={setSelectedStatus}
              date={date}
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
      </CalendarContext.Provider>
  );
}
