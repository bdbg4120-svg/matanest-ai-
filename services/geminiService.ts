
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationSettings } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please set your API key for the app to function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const generateMetadataSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: 'A compelling and descriptive title for the image.'
        },
        description: {
            type: Type.STRING,
            description: 'A detailed description of the image, suitable for stock photo sites. Around 2-3 sentences.'
        },
        keywords: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
                description: 'A relevant keyword.'
            },
            description: 'An array of relevant keywords for the image.'
        }
    },
    required: ['title', 'description', 'keywords']
};


export const generateMetadataForImage = async (
    base64ImageData: string,
    mimeType: string,
    settings: GenerationSettings
) => {
    try {
        const prompt = `Generate metadata for this image. The title should be a maximum of ${settings.titleLength} characters. Generate a detailed description of 2-3 sentences. Generate exactly ${settings.keywordCount} relevant keywords. The overall style should be descriptive and optimized for search.`;

        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType
            },
        };

        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: generateMetadataSchema
            }
        });

        const jsonString = response.text.trim();
        const metadata = JSON.parse(jsonString);

        if (typeof metadata.title !== 'string' || typeof metadata.description !== 'string' || !Array.isArray(metadata.keywords)) {
            throw new Error('Invalid metadata format received from API.');
        }

        return {
            title: metadata.title,
            description: metadata.description,
            keywords: metadata.keywords,
        };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if(process.env.API_KEY === undefined || process.env.API_KEY === "YOUR_API_KEY_HERE") {
             throw new Error("API Key not configured. Please set your Google AI Studio API key.");
        }
        throw new Error("Failed to generate metadata. Please check the console for details.");
    }
};
