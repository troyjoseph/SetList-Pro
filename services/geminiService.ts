import { GoogleGenAI, Type } from "@google/genai";

const cleanJsonString = (str: string): string => {
  // Remove markdown code blocks if present
  let cleaned = str.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\n/i, '').replace(/\n```$/g, '').trim();
  }
  return cleaned;
};

export const parseRepertoireText = async (fileContent: string): Promise<Array<{title: string, artist: string, singer_key: string, song_key: string | null, note?: string}> | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{
        role: 'user',
        parts: [
          {
            text: `You are an expert music setlist parser. Your task is to extract a structured list of songs from unstructured text.
      
      RULES:
      1. Identify the SONG TITLE and ARTIST. 
      2. Key Logic (Follow strictly):
        - No key mentioned: Set singer_key to "OG" and song_key to null.
        - One key mentioned (e.g., "G"): Set singer_key to "G" and song_key to null.
        - "OG" + a Key mentioned (e.g., "OG - G" or "OG (G)): Set both singer_key and song_key to the specified key (e.g., "G").
        - Formatting: Standardize all keys (e.g., "Gm", "F#", "Bb").
      3. EXPAND LISTS: If a line mentions an artist followed by a list of songs in parentheses, return EACH song as a separate object.
         - e.g., "Love Story Taylor Swift (Lover, Paper Rings)" -> 3 objects (Love Story, Lover, Paper Rings) all by Taylor Swift.
         - e.g., "Bring it on Home to Me (G)" -> Title: "Bring it on Home to Me", Singer Key: "G".
      4. Identify explicit performance NOTES (e.g., "Starts on Drums", "Duet").
      5. IGNORE header lines that are not songs.
      
      Text to process:
      ${fileContent.substring(0, 20000)}`
          }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              singer_key: { type: Type.STRING },
              song_key: { type: Type.STRING, nullable: true },
              note: { type: Type.STRING }
            },
            required: ["title", "artist", "singer_key"]
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(cleanJsonString(text));
    }
    return null;
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};

export const parseRepertoireFile = async (base64Data: string, mimeType: string): Promise<Array<{title: string, artist: string, singer_key: string, song_key: string | null, note?: string}> | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: `You are an expert music setlist parser. Your task is to extract a structured list of songs from this document.
            
            RULES:
            1. Identify the SONG TITLE and ARTIST. 
            2. Key Logic (Follow strictly):
              - No key mentioned: Set singer_key to "OG" and song_key to null.
              - One key mentioned (e.g., "G"): Set singer_key to "G" and song_key to null.
              - "OG" + a Key mentioned (e.g., "OG - G" or "OG (G)): Set both singer_key and song_key to the specified key (e.g., "G").
              - Formatting: Standardize all keys (e.g., "Gm", "F#", "Bb").
            3. EXPAND LISTS: If a line mentions an artist followed by a list of songs in parentheses, return EACH song separately.
            4. Identify any performance NOTES explicitly found in the text.
            5. IGNORE header lines that are not songs.
            6. Return valid JSON.`
          }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              singer_key: { type: Type.STRING },
              song_key: { type: Type.STRING, nullable: true },
              note: { type: Type.STRING }
            },
            required: ["title", "artist", "singer_key"]
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(cleanJsonString(text));
    }
    return null;
  } catch (error) {
    console.error("Gemini File Parse Error:", error);
    return null;
  }
};