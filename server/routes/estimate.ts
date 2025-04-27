import { openai } from "server/server";
import { Router, Request, Response } from "express";
import { pricingItems } from "server/pricingItems";
import { Tool } from "openai/resources/responses/responses.mjs";
import { OutputItemListParams } from "openai/resources/evals/runs/output-items.mjs";
import { JapaneseYenIcon } from "lucide-react";

const estimate = Router();

const serviceNames = pricingItems.map((service) => service.service);

const tools: Tool[] = [
  {
    type: "function",
    name: "estimate_cost",
    description:
      "Suggest specific services that solve the user's problem. For each service, include name, price, and unit. Choose only services from the provided list.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        services: {
          type: "array",
          items: {
            type: "object",
            properties: {
              service: {
                type: "string",
                enum: serviceNames, // serviceNames array
                description: "The name of the service",
              },
              price: {
                type: "string", // price as a string (e.g., '500 zł')
                description: "The price of the service",
              },
              unit: {
                type: "string",
                description:
                  "The measurement unit for the service (e.g., m², item, etc.)",
              },
            },
            required: ["service", "price", "unit"],
            additionalProperties: false,
          },
          description: "List of selected services with prices and units.",
        },
      },
      required: ["services"],
      additionalProperties: false,
    },
  },
];

estimate.post("/", async (req: Request, res: Response): Promise<void> => {
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

    if (!response.output[0]) {
      res.status(400).json({ error: "nie znaleziono usług" });
    }
    console.dir(parseArguments(response), { depth: null });
    if (response.output[0].type === "function_call") {
      const services = parseArguments(response);
      console.dir("WYNIK FLATMAP:" + services, { depth: null });
      const total = calculatePrice(services);

      const assistantMessage = `Na podstawie Twojego opisu proponuję: ${services
        .map((s) => `${s.service} (${s.price}/${s.unit})`)
        .join(
          ", "
        )}. Szacunkowy koszt wynosi: ${total} zł. Czy chcesz kontynuować?`;

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
    res.status(400).json({ error: "error" });
  }
});

function calculatePrice(serviceName: any) {
  const matchedServices = pricingItems.filter((item) =>
    serviceName.includes(item.service)
  );

  const total = matchedServices.reduce((sum, service) => {
    const price: number = parseInt(service.price.replace(/\D/g, ""), 10);
    return (sum += price);
  }, 0);

  return { matchedServices, total };
}

function parseArguments(response) {
  if (response.output[0].type === "function_call") {
    const Jsonparsed = JSON.parse(response.output[0].arguments);
    const parsedArguments = Jsonparsed.flatMap((item) => item.service);
    return Jsonparsed;
  }
}

export default estimate;
