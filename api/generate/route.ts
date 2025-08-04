// Note: This file should be placed in `api/generate/route.ts`.
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';

// This enum is duplicated from types.ts to make the serverless function self-contained.
enum MessageTemplate {
    PaymentReminder = 'Payment Reminder',
    PaymentFailed = 'Payment Failed',
    GeneralUpdate = 'General Update',
}

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


export async function POST(request: Request) {
    if (!process.env.API_KEY) {
        return NextResponse.json({ error: "Gemini API key not found. Please set the API_KEY environment variable." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const { template, driverName, amount } = await request.json();

        if (!template || !driverName || typeof amount === 'undefined') {
            return NextResponse.json({ error: 'Missing required parameters: template, driverName, amount' }, { status: 400 });
        }
        
        const prompt = getPrompt(template, driverName, amount);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 1,
                topK: 1,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        
        const text = response.text;
        
        return NextResponse.json({ message: text });

    } catch (error: any) {
        console.error("Error in /api/generate:", error);
        return NextResponse.json({ error: error.message || "Failed to generate message from AI." }, { status: 500 });
    }
}
