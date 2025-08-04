import { MessageTemplate } from '../types';

export const generateWhatsappMessage = async (
  template: MessageTemplate,
  driverName: string,
  amount: number
): Promise<string> => {
  // Call the backend serverless function instead of Gemini API directly
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ template, driverName, amount }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error from backend API:", data.error);
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  if (data.message) {
      return data.message.trim();
  }

  throw new Error("Received an empty response from the AI.");
};