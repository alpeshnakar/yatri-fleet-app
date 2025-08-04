
import { GoogleGenAI } from "@google/genai";
import { MessageTemplate } from '../types';

// IMPORTANT: In a real application, the API key must be secured and not exposed on the client-side.
// This is using a placeholder and assumes process.env.API_KEY is configured in the build environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const getPrompt = (template: MessageTemplate, driverName: string, amount: number): string => {
    switch(template) {
        case MessageTemplate.PaymentReminder:
            return `Write a friendly and professional WhatsApp message to ${driverName} to remind them their weekly rental payment of $${amount} is due soon. Keep it brief and clear. Start with "Hi ${driverName},".`;
        case MessageTemplate.PaymentFailed:
            return `Write a polite but firm WhatsApp message to ${driverName} informing them that their recent direct debit payment of $${amount} has failed. Advise them to check their bank account and make a manual payment as soon as possible to avoid vehicle interruption. Start with "Hi ${driverName},".`;
        case MessageTemplate.GeneralUpdate:
            return `Write a general operational update for a driver named ${driverName}. Mention a scheduled system maintenance this weekend and that they should save their work. Keep it concise. Start with "Hi ${driverName},".`;
        default:
            return `Write a generic message to ${driverName}.`;
    }
}


export const generateWhatsappMessage = async (
  template: MessageTemplate,
  driverName: string,
  amount: number
): Promise<string> => {
  if (!ai) {
    return Promise.resolve("AI functionality is disabled. Please configure the API Key.");
  }
  
  try {
    const prompt = getPrompt(template, driverName, amount);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 1,
        thinkingConfig: { thinkingBudget: 0 } // For faster, direct response
      }
    });

    return response.text.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate message from AI.");
  }
};
