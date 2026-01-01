import { GoogleGenAI, Type } from "@google/genai";
import { Song, GigType, GigSpecificData } from '../types';

export const enrichSongData = async (rawTitle: string): Promise<Partial<Song> | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API Key found for Gemini");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide metadata for the song most likely matching: "${rawTitle}". 
      If it's a popular cover, use the most famous version or original. 
      Estimate the original key if standard. Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            originalKey: { type: Type.STRING },
            isSlow: { type: Type.BOOLEAN },
            isDuet: { type: Type.BOOLEAN }
          },
          required: ["title", "artist", "originalKey"]
        }
      }
    });

    const text = response.text;
    if (text) {
      const result = JSON.parse(text);
      
      // Build default gig data structure
      const gigData: Record<string, GigSpecificData> = {};
      const defaultData: GigSpecificData = {
        rating: 0,
        isSlow: result.isSlow || false,
        isDuet: result.isDuet || false,
        preferredSets: 'ANY',
        setsToAvoid: 'ANY',
        goodTransitionFrom: [],
        goodTransitionTo: [],
        preferredSingers: [],
        preferredPlacement: ''
      };

      Object.values(GigType).forEach(type => {
        gigData[type] = { ...defaultData };
      });

      return {
        title: result.title,
        artist: result.artist,
        originalKey: result.originalKey,
        gigData
      };
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const parseRepertoireText = async (fileContent: string): Promise<Array<{title: string, artist: string, key: string}> | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract a list of songs from the following unstructured text. 
      Identify the Song Title, Artist, and the Key (if mentioned, otherwise use 'OG').
      Return a JSON array.
      
      Text to process:
      ${fileContent.substring(0, 10000)}`, // Limit extraction size for safety
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              key: { type: Type.STRING }
            },
            required: ["title", "artist"]
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};