import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

async function testGemini25Flash() {
    console.log("Testing Gemini 2.5 Flash (stable model)...");
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: 'Return this exact JSON: {"name":"Pizza","calories":300}' }
                    ]
                }
            ]
        });

        console.log("\n✅ Gemini 2.5 Flash is working!");
        console.log("Raw response:", response.text);

        // Test JSON parsing
        let jsonString = response.text.trim();
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(jsonString);
        console.log("Parsed successfully:", parsed);

    } catch (error) {
        console.error("\n❌ Error:");
        console.error(error);
    }
}

testGemini25Flash();
