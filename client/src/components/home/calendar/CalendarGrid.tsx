import {eachDayOfInterval, endOfMonth, endOfWeek, getDate, startOfMonth, startOfWeek} from "date-fns";
import React from "react";



function getcalendarTiles (currentDate:Date) {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)

    const calendarStart = startOfWeek(monthStart, {weekStartsOn:1})
    const calendarEnd = endOfWeek(monthEnd,{weekStartsOn:1})

    return eachDayOfInterval({
        start:calendarStart,
        end:calendarEnd
    })

}

export default function CalendarGrid(){
    return (
        <div className="flex flex-grow">

            <div className="grid grid-cols-7 grid-rows-6">
                {getcalendarTiles(new Date()).map((date, i) => {
                    const isTopRow = i < 7;
                    const isLastRow = i <= 35 && i >= 28; // 6 rows x 7 columns = 42
                    const isRightCol = (i + 1) % 7 === 0;


                    return (
                        <div
                            key={date.toISOString()}
                            className={[
                                "p-10 text-center",
                                !isTopRow && "border-t",
                                !isRightCol && "border-r",
                                !isLastRow && "border-b",
                                "border-gray-400"
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            {getDate(date)}
                        </div>
                    );
                })}
            </div>
            <div>
                Hello
            </div>
        </div>
    )
}
