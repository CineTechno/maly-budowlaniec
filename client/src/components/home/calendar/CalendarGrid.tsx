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
import React, {useState} from "react";
import { DayAvailability, DayStatus } from "./Calendar";
import {pl} from "date-fns/locale/pl";
import {CalendarContext} from "@/components/home/calendar/CalendarContext.tsx";
import {useContext} from "react";

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
  const [selectedOption, setSelectedOption] = useState<DayStatus>("Dostępny")

  const [mockAvailability, setMockAvailability] = useState<DayAvailability[]>
  ([])

  function handleDayStartEnd(newDate: Date) {
    const { dayStart, dayEnd } = dayStartEnd;


    if (dayStart && dayEnd) {
      setDayStartEnd({ dayStart: newDate, dayEnd: null });
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




  function handleSubmitAvailability(e:React.FormEvent) {
    e.preventDefault();

      setMockAvailability(prev =>
          [...prev,
            {
              start: format(dayStartEnd.dayStart!, "yyyy-MM-dd"),
              end: format(dayStartEnd.dayEnd!, "yyyy-MM-dd"),
              status: selectedOption
            }]);

  }

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
          return (
            <div
              key={date.toISOString()}
                onClick={!isAdmin?
                    () =>
                setSelectedStatus(mockAvailability[format(date, "yyyy-MM-dd")])
                    :
                    () => handleDayStartEnd(date)
              }
              className={[
                "flex items-center justify-center aspect-square rounded-sm hover:brightness-110 hover:cursor-pointer",
                "border-gray-400",
                mockAvailability[format(date, "yyyy-MM-dd")] === "Dostępny" &&
                  "bg-green-400",
                mockAvailability[format(date, "yyyy-MM-dd")] === "Częściowo dostępny" &&
                  "bg-orange-300",
                mockAvailability[format(date, "yyyy-MM-dd")] === "Niedostępny" &&
                  "bg-red-400",
                 isDateInRange(date, dayStartEnd)?"bg-blue-500":"",
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
          onChange={(e)=>setSelectedOption(e.target.value)
          }>
            <option value={"Dostępny"}>Dostępny</option>
            <option value={"Częściowo dostępny"}>Częściowo dostępny</option>
            <option value={"Niedostępny"}>Niedostępny</option>
          </select>
          <button type="submit"></button>
          </form>
          <div>
            {mockAvailability.map(date=>date.start)}
          </div>
        </div>
      </>
  );
}
