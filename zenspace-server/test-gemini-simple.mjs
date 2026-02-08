import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
    console.log("Testing Gemini API...");
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Return this exact JSON object without any additional text:
{"name":"Test Food","calories":100}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("\n✅ Gemini API is working!");
        console.log("Raw response:", text);

        // Test JSON parsing
        let jsonString = text.trim();
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const parsed = JSON.parse(jsonString);
        console.log("Parsed successfully:", parsed);

    } catch (error) {
        console.error("\n❌ Gemini API Error:");
        console.error(error.message);
        console.error(error);
    }
}

testGemini();
