import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {useMediaQuery} from "react-responsive";
import React from "react";
import { DayAvailability, DayStatus } from "./Calendar";
import {pl} from "date-fns/locale/pl";

interface CalendarGridProps {
  mockAvailability: DayAvailability;
  setSelectedStatus: (status: DayStatus) => void;
}

function getcalendarTiles(currentDate: Date) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
}



export default function CalendarGrid({
  mockAvailability,
  setSelectedStatus,
}: CalendarGridProps) {

  const isBigScreen =useMediaQuery({minWidth:1200})
  return (
    <div className="bg-white shadow-2xl rounded-lg border-1 h-full">
      <div className="grid grid-cols-7 text-center gap-2">
        {getcalendarTiles(new Date).map((date,i) => (
            i<7?(
                <div className="bg-gray-100 p-4 rounded-lg font-bold">
                  {isBigScreen?format(date, "EEEE", {locale:pl}):
                      format(date, "EE", {locale:pl})
                  }
                </div>
            ):null
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 gap-1">
        {getcalendarTiles(new Date()).map((date, i) => {
          const isTopRow = i < 7;
          const isLastRow = i <= 35 && i >= 28; // 6 rows x 7 columns = 42
          const isRightCol = (i + 1) % 7 === 0;
          return (
            <div
              key={date.toISOString()}
              onClick={() =>
                setSelectedStatus(mockAvailability[format(date, "yyyy-MM-dd")])
              }
              className={[
                "flex items-center justify-center aspect-square rounded-lg",
                !isTopRow && "border-t",
                !isRightCol && "border-r",
                !isLastRow && "border-b",
                "border-gray-400",
                mockAvailability[format(date, "yyyy-MM-dd")] === "dostepny" &&
                  "bg-green-400",
                mockAvailability[format(date, "yyyy-MM-dd")] === "zajety" &&
                  "bg-orange-300",
                ,
                mockAvailability[format(date, "yyyy-MM-dd")] === "zajety" &&
                  "bg-red-400",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {getDate(date)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
