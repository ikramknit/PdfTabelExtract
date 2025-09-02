
import { GoogleGenAI } from '@google/genai';
import type { ExtractedData } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            // This should not happen with readAsDataURL
            resolve('');
        }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const extractInformationFromPDF = async (file: File): Promise<ExtractedData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const pdfPart = await fileToGenerativePart(file);

  const prompt = `
    Analyze the content of the provided PDF document. Your task is to extract all structured information and present it as a JSON array of objects.
    Each object in the array should represent a single row of data from a table or a logical grouping of information.
    The keys of the objects should be descriptive headers for the data, and the values should be the corresponding information.
    
    IMPORTANT: The output JSON must be flat. Do not use nested objects. If you encounter a section with multiple fields (e.g., an address), flatten it by creating distinct columns for each field (e.g., "address_street", "address_city", "address_zip"). The goal is to produce a simple, two-dimensional table structure.

    Ensure that the JSON is well-formed and accurately reflects the data in the document.
    Prioritize tabular data, but also include any lists or key-value pairs that can be structured similarly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          pdfPart,
        ]
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("The API returned an empty response. The document might not contain extractable text or tables.");
    }
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error processing PDF with Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("Failed to parse the data from the document. The AI model could not structure the content into a valid table format.");
    }
    throw new Error("An unexpected error occurred while communicating with the AI service.");
  }
};