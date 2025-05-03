import React from "react";

export default function Login({setIsLoggedIn, className}: {setIsLoggedIn: (b: boolean)=>void, className: string}) {

    function handleLogin(){
        setIsLoggedIn(true);
    }

    return(
        <div className={`${className} container mx-auto h-screen flex justify-center items-center`}>

            <div className={`${className} bg-white absolute shadow-sm rounded-lg mx-auto p-4 w-fit flex flex-col gap-4`}>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                    <input type={"text"} placeholder={"Użytkownik"} className="focus:outline-0"/>
                    <input type={"text"} placeholder={"Hasło"} className="focus:outline-0"/>
                <button onClick={handleLogin} type="submit">
                    Zaloguj
                </button>
                </form>
            </div>
        </div>

    )
}