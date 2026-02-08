import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

async function testGemini25() {
    console.log("Testing Gemini 2.5 with @google/genai SDK...");
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-0205",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: "Return this exact JSON: {\"name\":\"Pizza\",\"calories\":300}" }
                    ]
                }
            ]
        });

        console.log("\n✅ Gemini 2.5 API is working!");
        console.log("Raw response:", response.text);

    } catch (error) {
        console.error("\n❌ Error:");
        console.error(error.message);
        console.error("Full error:", error);
    }
}

testGemini25();
