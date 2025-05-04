import React, {useState} from "react";
import Login from "@/components/AdminPanel/Login.tsx";
import Calendar from "@/components/home/calendar/Calendar.tsx";
import { CalendarContext } from "../home/calendar/CalendarContext";
import ChatMessages from "@/components/AdminPanel/ChatMessages.tsx";


export default function Admin(){

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    return(
        <CalendarContext.Provider value={{ isAdmin: true }}>
        <div className="container mx-auto h-screen">
            <Login className={isLoggedIn ? "hidden" : ""}  setIsLoggedIn = {setIsLoggedIn}/>
            <Calendar classname={!isLoggedIn?"hidden":""}></Calendar>
            <ChatMessages></ChatMessages>

        </div>
        </CalendarContext.Provider>
    )
}
