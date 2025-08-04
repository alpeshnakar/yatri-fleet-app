// Note: This file should be placed in the `api` directory at the root of your project.
// Vercel automatically deploys files in this directory as serverless functions.
// To use external libraries like @google/genai here, you might need a package.json.
// For now, this assumes the environment can resolve it.

import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will cause the function to fail on boot if the key is not set, which is a good safeguard.
  throw new Error("Gemini API key not found. Please set the API_KEY environment variable in your Vercel project settings.");
}

// This enum is duplicated from types.ts to make the serverless function self-contained.
// Vercel serverless functions have difficulty with relative imports outside their directory.
enum MessageTemplate {
    PaymentReminder = 'Payment Reminder',
    PaymentFailed = 'Payment Failed',
    GeneralUpdate = 'General Update',
}


const ai = new GoogleGenAI({ apiKey: API_KEY });

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

// Vercel serverless function handler. Using `any` for request/response types for simplicity
// as @vercel/node types are not explicitly installed in this project setup.
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { template, driverName, amount } = req.body;

        if (!template || !driverName || typeof amount === 'undefined') {
            return res.status(400).json({ error: 'Missing required parameters: template, driverName, amount' });
        }
        
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
        
        const text = response.text;
        
        return res.status(200).json({ message: text });

    } catch (error: any) {
        console.error("Error in /api/generate:", error);
        return res.status(500).json({ error: error.message || "Failed to generate message from AI." });
    }
}