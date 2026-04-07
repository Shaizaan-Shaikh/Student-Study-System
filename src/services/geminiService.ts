import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getGeminiResponse = async (prompt: string, systemInstruction?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction
      }
    });
    
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my neural network right now.";
  }
};

export const chatWithGemini = async (messages: { role: 'user' | 'model', parts: { text: string }[] }[], systemInstruction: string) => {
  try {
    // Convert messages to the format expected by generateContent
    // The SDK handles history if we pass an array of contents
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: m.parts
      })),
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm sorry, I'm having trouble processing that request.";
  }
};
