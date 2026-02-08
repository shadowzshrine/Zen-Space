import { GoogleGenAI } from "@google/genai";
import fs from "fs";

export const analyzeImage = async (filePath: string) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined");
        }

        const ai = new GoogleGenAI({ apiKey });

        const base64ImageFile = fs.readFileSync(filePath, {
            encoding: "base64",
        });

        const prompt = `Analyze this food image and return a JSON object with these exact keys:
- "name": A short descriptive name of the food (string)
- "calories": Estimated total calories as a number (integer only)

Return ONLY valid JSON with no additional text, markdown, or explanations. Example format:
{"name":"Grilled Chicken","calories":250}`;

        // Use the stable gemini-2.5-flash model
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: base64ImageFile,
                                mimeType: "image/jpeg"
                            }
                        }
                    ]
                }
            ]
        });

        const text = response.text;
        console.log("Gemini Raw Response:", text);

        // Parse JSON robustly
        let jsonString = text.trim();

        // Remove markdown code blocks
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        jsonString = jsonString.trim();

        // Try to extract JSON if wrapped in other text
        const jsonMatch = jsonString.match(/\{[^{}]*"name"[^{}]*"calories"[^{}]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        }

        console.log("Parsed JSON String:", jsonString);

        const parsed = JSON.parse(jsonString);

        // Validate the response has required fields
        if (!parsed.name || typeof parsed.calories !== 'number') {
            throw new Error("Invalid response format from Gemini");
        }

        console.log("Successfully parsed:", parsed);
        return parsed;

    } catch (error: any) {
        console.error("Gemini Analysis Error:", error);
        throw new Error(error?.message || "Failed to analyze image");
    }
}