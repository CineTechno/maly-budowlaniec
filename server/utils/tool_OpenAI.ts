import {Tool} from "openai/resources/responses/responses";
import {pricingItems} from "../pricingItems.tsx";

const serviceNames = pricingItems.map((service) => service.service);
export const tools: Tool[] = [
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