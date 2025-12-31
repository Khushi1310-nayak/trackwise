
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBuilderAdvice = async (
  context: string,
  type: 'hackathon' | 'project' | 'internship'
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I am building Trackwise, a tracker for my professional journey. 
      Act as a senior engineering mentor. Based on my current ${type} details: "${context}", 
      give me 3 actionable tips to improve my chances of success or to build faster. 
      Keep each tip concise. Format as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
    });
    
    // .text is a property, not a method.
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return ["Focus on MVP features first.", "Network with other participants.", "Document your progress frequently."];
  }
};

export const generateProjectReadme = async (projectTitle: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex coding tasks like README generation.
      model: "gemini-3-pro-preview",
      contents: `Generate a short, professional Markdown README content for a project titled "${projectTitle}" with this description: "${description}". Include sections for Features and Tech Stack ideas.`,
    });
    // .text is a property.
    return response.text;
  } catch (error) {
    console.error("Gemini README Error:", error);
    return "Failed to generate README. Please try again later.";
  }
};
