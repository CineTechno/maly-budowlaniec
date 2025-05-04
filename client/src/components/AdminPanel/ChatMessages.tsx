import React, {useEffect, useState} from "react";
import {ChatMessage} from "@/components/home/Pricing.tsx";

interface ChatDocument {
    id: string;
    updatedChatMessages: ChatMessage[];
    userId: string;
    createdAt: Date
    __v:number
}

interface ChatResponse {
    response: ChatDocument[];
}

interface MessagesEntry {
    name: string;
    updatedChatMessages: ChatMessage[];
}

export default function ChatMessages({className}: {className?: string}) {

    const [messages, setMessages] = useState<MessagesEntry[]>([]);
    const [userMessages, setUserMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        try{
        const getChatHistory = async () => {
            const response = await fetch("/api/estimate");
            const data = await response.json() as ChatResponse
            setMessages(
                data.response.map((message:ChatDocument) => {
                        const name = message.updatedChatMessages[1].content
                    return {name: name, updatedChatMessages: message.updatedChatMessages};
                    }
                )
            )
        }
            void getChatHistory();
        }catch(err){
            console.log(err);
        }


    }, []);

    const handleUserSelect = (chatMessages: ChatMessage[]) => {
        setUserMessages(chatMessages);
    }
    return (
        <div className={`${className} container mx-auto`} >
            <div className="mx-4 rounded-lg shadow-sm grid grid-cols-[auto_1fr] gap-6 items-start">
            <div className="flex flex-col gap-4 max-h-100 overflow-y-auto">
                {messages.map((message,index) => (
                    <button type={"button"}   key={index} onClick={() => handleUserSelect(message.updatedChatMessages)}>
                        {message.name}
                    </button>
                ))}
            </div>
            <div className="flex flex-col gap-4 max-h-100 overflow-y-auto border-l-2 pl-2">
                {userMessages.map((message,index) => (
                    <div className="flex gap-2 ">
                        <p className="min-w-1/6">{message.role}</p>
                        <p className="">{message.content}</p>
                    </div>
                ))}
            </div>


            </div>
        </div>
    )
}