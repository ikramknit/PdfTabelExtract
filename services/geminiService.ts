
import { GoogleGenAI } from '@google/genai';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error('Failed to read file as base64 string.'));
        }
    };
    reader.onerror = (error) => {
        reject(error);
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const extractSingleFileInformation = async (
    file: File, 
    ai: GoogleGenAI,
    customInstructions: string
): Promise<Record<string, string | number>> => {
    const filePart = await fileToGenerativePart(file);

    const basePrompt = `
      Analyze the content of the provided document (PDF or image). Your task is to extract the most important, structured information and summarize it as a single, flat JSON object.
      
      Do NOT create a JSON array; the output must be one JSON object representing a single row of data that summarizes this document.
      
      For example, if the document is an invoice, extract fields like "Invoice Number", "Total Amount", "Due Date". If it's a registration form, extract "Applicant Name", "Application Number", "Registration Date".
      
      The keys of the JSON object should be descriptive headers, and the values should be the corresponding information.
      Ensure the JSON is well-formed. Do not wrap the JSON in markdown backticks.
    `;

    const prompt = customInstructions 
      ? `${basePrompt}\n\n**User Instructions:**\n${customInstructions}`
      : basePrompt;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, filePart] },
            config: {
                responseMimeType: 'application/json',
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error(`The API returned an empty response for ${file.name}.`);
        }

        const parsedJson = JSON.parse(jsonText);
        if (Array.isArray(parsedJson)) {
            if (parsedJson.length > 0) return parsedJson[0];
            throw new Error(`The API returned an empty array for ${file.name}.`);
        }
        return parsedJson;

    } catch (error) {
        console.error(`Error processing file ${file.name} with Gemini API:`, error);
        if (error instanceof Error && error.message.includes('JSON')) {
            throw new Error(`Could not structure content from ${file.name} into a valid format.`);
        }
        throw new Error(`An unexpected AI service error occurred for ${file.name}.`);
    }
};