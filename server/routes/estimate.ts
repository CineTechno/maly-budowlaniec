import { openai } from "server/server";
import { Request, Response, Router } from "express";
import { pricingItems } from "server/pricingItems";
import { tools } from "../utils/tool_OpenAI.ts";
import { ResponseFunctionToolCall } from "openai/resources/responses/responses";
import {connectToDatabase} from "../lib/mongodb.ts";
import {Estimate} from "../models/Estimate.ts";

const estimate = Router();

export interface Service {
  service: string;
  price: string;
  unit: string;
}

export interface Arguments {
  services: Service[];
}

interface EstimateRequestBody {
  userId: string;
  updatedChatMessages: {role:"user" | "assistant", content: string}[];
}

export interface EstimateDocument extends EstimateRequestBody, Document {}

estimate.post("/", async (req:Request<{},{},EstimateRequestBody>, res: Response): Promise<void> => {
  //API CALL

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1", // or "gpt-4-turbo" or "gpt-3.5-turbo", etc.
      input: [
        {
          role: "system",
          content: `Jesteś profesjonalnym asystentem AI do szacowania kosztów budowlanych. Zawsze pytaj o brakujące informacje, takie jak metraż (m²) lub liczba pomieszczeń, jeśli nie zostały podane. Wszystkie usługi wraz z cenami możesz znaleźć tutaj: ${pricingItems
            .map(
              (service) =>
                `${service.service} - ${service.price} jednostka: ${service.unit}`
            )
            .join(
              "; "
            )} Proponuj wyłącznie usługi z udostępnionej listy cenowej. Staraj się mówić `,
        },
        ...req.body.updatedChatMessages,
      ],
      tools,
      tool_choice: "auto",
    });

    const toolResponse = response.output[0] as ResponseFunctionToolCall;
    if (!toolResponse) {
      res.status(400).json({ error: "nie znaleziono usług" });
    }

    //FUNCTION CALL

    if (toolResponse.type === "function_call") {
      const services: Service[] = parseArguments(toolResponse);
      const total: number = calculatePrice(services);

      const assistantMessage = `Na podstawie Twojego opisu proponuję: ${services
        .map((s) => `${s.service} (${s.price}/${s.unit})`)
        .join(
          ", "
        )}. Szacunkowy koszt wynosi: ${total} zł. Czy chcesz kontynuować?`;

        const updatedChatMessages= [...req.body.updatedChatMessages, {role:"assistant", content:assistantMessage}];
        const userId = req.body.userId;

      //DB CONNECT

    try {
      await connectToDatabase();
      let convo = await Estimate.findOne({ userId }).sort({ createdAt: -1 });
      if (convo) {
        convo.updatedChatMessages=updatedChatMessages; // Append new messages
        await convo.save();
        console.log("Estimate updated entry:", convo);
      } else {
         const newEntry = await Estimate.create({
          userId: userId,
          updatedChatMessages: updatedChatMessages,
        })
        console.error("Added new entry:" + JSON.stringify(newEntry));
      }
    }catch(err){
      console.error("DB Error:", err);
      res.status(500).json({ message: "Server error" });
    }

      res.json({
        type: "estimate",
        services: services,
        total: total,
        content: assistantMessage,
      });
    } else if (response.output[0].type === "message") {
      res.json({
        type: "clarification",
        content: response.output_text,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error", details: error.message });
  }
});

function calculatePrice(service: Service[]) {
  const total = service.reduce((sum, service) => {
    const price: number = parseInt(service.price.replace(/\D/g, ""), 10);
    return (sum += price);
  }, 0);

  return total;
}

function parseArguments(toolResponse: ResponseFunctionToolCall): Service[] {
  const jsonParsed = JSON.parse(toolResponse.arguments) as Arguments;
  return jsonParsed.services;
}

export default estimate;
