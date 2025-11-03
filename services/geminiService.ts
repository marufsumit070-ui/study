import { GoogleGenAI } from "@google/genai";
import { AidType } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateStudyAids = async (noteContent: string, aidType: AidType): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is not configured. Please set the API_KEY environment variable.";
  }
  
  let prompt = '';
  switch (aidType) {
    case 'summarize':
      prompt = `Summarize the following study notes concisely. Focus on the key concepts and definitions. Output in markdown format:\n\n---\n\n${noteContent}`;
      break;
    case 'quiz':
      prompt = `Generate a short multiple-choice quiz (3-5 questions) based on the following notes to test my understanding. Provide the questions first, then the answers with explanations at the end. Output in markdown format:\n\n---\n\n${noteContent}`;
      break;
    case 'explain':
      prompt = `Explain the key concepts from these notes in simple terms, as if you were explaining it to a beginner. Use analogies if possible. Output in markdown format:\n\n---\n\n${noteContent}`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating study aids:", error);
    return "Sorry, I encountered an error while trying to generate study aids. Please check the console for details.";
  }
};
