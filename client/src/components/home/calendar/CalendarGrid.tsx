import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  startOfMonth,
  startOfWeek, subDays,
} from "date-fns";
import {useMediaQuery} from "react-responsive";
import React, {useCallback, useState} from "react";
import { DayAvailability, DayStatus } from "./Calendar";
import {pl} from "date-fns/locale/pl";
import {CalendarContext} from "@/components/home/calendar/CalendarContext.tsx";
import {useContext} from "react";
import {boolean} from "zod";

interface CalendarGridProps {
  setSelectedStatus: (status: DayStatus) => void;
  date:Date
}

interface DayStartEnd {
  dayStart:Date | null,
  dayEnd:Date | null,
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

function isDateInRange(dateToCheck: Date, range: DayStartEnd):boolean {

  const time = dateToCheck.getTime();

  if (range.dayStart && range.dayEnd) {
    const start = range.dayStart.getTime();
    const end = range.dayEnd.getTime();
    return time >= start && time <= end;
  }

  if (range.dayStart) {
    return time === range.dayStart.getTime();
  }

}

export default function CalendarGrid({
  setSelectedStatus, date
}: CalendarGridProps) {

  const [dayStartEnd, setDayStartEnd] = useState<DayStartEnd>(
      {dayStart:null, dayEnd:null}
  );
  const [selectedOption, setSelectedOption] = useState<DayStatus>("Częściowo dostępny")

  const [mockAvailability, setMockAvailability] = useState<(DayAvailability | null)[] >
  ([])

  function handleDayStartEnd(newDate: Date) {
    const { dayStart, dayEnd } = dayStartEnd;


    if (dayStart && dayEnd) {
      setDayStartEnd({ dayStart: null, dayEnd: null });
      return;
    }

    // If only start is selected
    if (dayStart) {
      if (newDate.getTime() < dayStart.getTime()) {
        // Clicked earlier date → swap
        setDayStartEnd({ dayStart: newDate, dayEnd: dayStart });
      } else {
        setDayStartEnd({ dayStart: dayStart, dayEnd: newDate });
      }
    } else {
      // First click
      setDayStartEnd({ dayStart: newDate, dayEnd: null });
    }
  }


  async function handleSubmitAvailability(e: React.FormEvent) {
    e.preventDefault();

    const { dayStart, dayEnd } = dayStartEnd;

    if (!dayStart || !dayEnd) return;

    const startTimestamp = dayStart.getTime();
    const endTimestamp = dayEnd.getTime();

    const newStart = format(dayStart, "yyyy-MM-dd");
    const newEnd = format(dayEnd, "yyyy-MM-dd");

    const updated = mockAvailability
        .flatMap((avail): DayAvailability[] => {
          const availStart = new Date(avail.start).getTime();
          const availEnd = new Date(avail.end).getTime();

          const overlaps = startTimestamp <= availEnd && endTimestamp >= availStart;
          if (!overlaps) return [avail];

          if (availStart >= startTimestamp && availEnd <= endTimestamp) return [];

          if (availStart < startTimestamp && availEnd <= endTimestamp && availEnd >= startTimestamp) {
            return [{
              start: avail.start,
              end: format(subDays(dayStart, 1), "yyyy-MM-dd"),
              status: avail.status
            }];
          }

          if (availStart >= startTimestamp && availStart <= endTimestamp && availEnd > endTimestamp) {
            return [{
              start: format(addDays(dayEnd, 1), "yyyy-MM-dd"),
              end: avail.end,
              status: avail.status
            }];
          }

          if (availStart < startTimestamp && availEnd > endTimestamp) {
            return [
              {
                start: avail.start,
                end: format(subDays(dayStart, 1), "yyyy-MM-dd"),
                status: avail.status
              },
              {
                start: format(addDays(dayEnd, 1), "yyyy-MM-dd"),
                end: avail.end,
                status: avail.status
              }
            ];
          }

          return [avail];
        });

// Add the new entry
    const finalAvailability = [
      ...updated,
      {
        start: newStart,
        end: newEnd,
        status: selectedOption
      }
    ];

// Update state
    setMockAvailability(finalAvailability);

// Now send the correct data
    try {
      await fetch("/api/calendar", {
        method: "POST",
        body: JSON.stringify(finalAvailability), // ✅ use the latest version
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error(error);
    }

    setDayStartEnd({ dayStart: null, dayEnd: null });
  }


  const checkDateStatus = useCallback((date: Date): DayStatus | null => {
    const formatted = format(date, "yyyy-MM-dd"); // convert the tile's Date to string

    const matchingRange = mockAvailability.find((availability) => {
      return (
          formatted >= availability.start &&
          formatted <= availability.end
      );
    });

    return matchingRange ? matchingRange.status : null;
  }, [mockAvailability])



  const isBigScreen =useMediaQuery({minWidth:1200})

  const {isAdmin} = useContext(CalendarContext);
  return (
      <>
      <div className="grid grid-cols-7 text-center gap-1">
        {getcalendarTiles(date).map((date,i) => (
            i<7?(
                <div className="bg-gray-100 p-4 rounded-sm font-bold text-sm ">
                  {isBigScreen?format(date, "EEEE", {locale:pl}):
                      format(date, "EE", {locale:pl})
                  }
                </div>
            ):null
        ))}
      </div>
    <div className="bg-white shadow-sm rounded-lg ">

      <div className="grid grid-cols-7 grid-rows-5 gap-1">
        {getcalendarTiles(date).map((date, i) => {
          const status = checkDateStatus(date);
          return (
            <div
              key={date.toISOString()}
                onClick={!isAdmin
                    ? () => {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      const match = mockAvailability.find(
                          (d) => formattedDate >= d.start && formattedDate <= d.end
                      );
                      setSelectedStatus(match ? match.status : "Dostępny");
                    }
                    : () => handleDayStartEnd(date)
              }
              className={[
                "flex items-center justify-center aspect-square rounded-sm hover:brightness-110 hover:cursor-pointer",
                "border-gray-400",
                status==="Częściowo dostępny"?"bg-orange-300":"bg-green-400",
                  status==="Niedostępny"?"bg-red-400":"bg-green-400",
                 isDateInRange(date, dayStartEnd)?"!bg-blue-500":"",
              ]
                .join(" ")

            }
            >
              {getDate(date)}
            </div>
          );
        })}
      </div>
    </div>
        <div>
          <form onSubmit={handleSubmitAvailability}>
          <select id="dropdown"
          value={selectedOption}
          onChange={(e)=>setSelectedOption(e.target.value as DayStatus)
          }>
            <option value={"Częściowo dostępny"}>Częściowo dostępny</option>
            <option value={"Niedostępny"}>Niedostępny</option>
          </select>
          <button type="submit"></button>
          </form>
          <div>
            {mockAvailability.map((date, index) => (
                <div key={index}>
                  {date.start} - {date.end} - {date?.status}
                </div>
            ))}
          </div>
        </div>
      </>
  );
}
