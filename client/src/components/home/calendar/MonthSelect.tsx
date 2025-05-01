import {Button} from '../../ui/button.tsx'
import React from "react"
import {addMonths, format} from "date-fns";
import {ChevronLeft, ChevronRight} from "lucide-react";
export default function MonthSelect({setDate, date}: {setDate: (date: Date) => void, date: Date}) {
    return (
        <div className="flex ">
            <Button onClick = {()=>setDate(addMonths(date, -1))} variant="default">
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex mx-2 p-1 text-lg font-bold">
                {format(date, "MMMM")}
            </div>
            <Button onClick = {()=>setDate(addMonths(date, 1))}  variant="default">
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}