import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ parts: [{ text: "Hello" }] }] // content format might also be rigid
        });
        console.log(`Success with ${modelName}!`);
        console.log(response);
        return true;
    } catch (error) {
        console.log(`Failed with ${modelName}. Status: ${error.status}`);
        // console.log(error); // Detailed error
        return false;
    }
}

async function run() {
    const models = [
        "gemini-1.5-flash",
        "models/gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-pro",
        "models/gemini-pro"
    ];

    for (const m of models) {
        if (await testModel(m)) break;
    }
}

run();
