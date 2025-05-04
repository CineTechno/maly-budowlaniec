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

export default function ChatMessages() {

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
        <div className="container mx-auto ">
            <div className="mx-4 rounded-lg shadow-sm flex gap-4">
            <div className="flex flex-col gap-4">
                {messages.map((message,index) => (
                    <div key={index} onClick={() => handleUserSelect(message.updatedChatMessages)}>
                        {message.name}
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-4">
                {userMessages.map((message,index) => (
                    <div className="flex gap-2">
                        {message.role}
                        {message.content}
                    </div>
                ))}
            </div>


            </div>
        </div>
    )
}