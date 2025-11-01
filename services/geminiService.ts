import { GoogleGenAI, Chat, Part } from "@google/genai";
import { Message, MessagePart } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';
let chat: Chat | null = null;
const systemInstruction = "You are a friendly and helpful health expert. Your goal is to provide accurate and easy-to-understand information about health-related topics, including analyzing images of products to identify their functions and potential hazards. Always prioritize safety and suggest consulting a professional for medical advice.";


export const startChat = (history: Message[]) => {
    chat = ai.chats.create({
        model: model,
        history: history.map(msg => ({
            role: msg.role,
            parts: msg.parts,
        })),
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

export const sendMessageToChat = async (promptParts: MessagePart[]): Promise<string> => {
    if (!chat) {
        throw new Error("Chat not initialized. Call startChat first.");
    }
    try {
        // The `chat.sendMessage` method expects an object with a `message` property containing a string or an array of `Part` objects.
        const response = await chat.sendMessage({ message: promptParts as Part[] });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the Gemini API.");
    }
};