import React, {useState} from "react";
import Login from "@/components/AdminPanel/Login.tsx";
import Calendar from "@/components/home/calendar/Calendar.tsx";


export default function Admin(){

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    return(
        <div className="container mx-auto h-screen">
            <Login className={isLoggedIn ? "hidden" : ""}  setIsLoggedIn = {setIsLoggedIn}/>
            <Calendar classname={!isLoggedIn?"hidden":""} isAdmin = {true}></Calendar>

        </div>

    )
}
