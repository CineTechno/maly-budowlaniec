import React, {useState} from "react";
import Login from "@/components/AdminPanel/Login.tsx";
import Calendar from "@/components/home/calendar/Calendar.tsx";
import { CalendarContext } from "../home/calendar/CalendarContext";
import ChatMessages from "@/components/AdminPanel/ChatMessages.tsx";
import Pricing from "@/components/home/Pricing.tsx";



export default function Admin(){

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    return(
        <CalendarContext.Provider value={{ isAdmin: true }}>
        <div className="h-screen flex flex-col gap-6">
            <Login className={isLoggedIn ? "hidden" : ""}  setIsLoggedIn = {setIsLoggedIn}/>
            <Calendar classname={!isLoggedIn?"hidden":""}></Calendar>
            <ChatMessages className={!isLoggedIn?"hidden":""}></ChatMessages>
            <Pricing className={!isLoggedIn?"hidden":""}></Pricing>

        </div>
        </CalendarContext.Provider>
    )
}
