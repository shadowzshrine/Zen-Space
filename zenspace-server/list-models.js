const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

console.log("Fetching available Gemini models...");
console.log("API Key exists:", !!apiKey);

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${apiKey}`,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`\nStatus: ${res.statusCode}`);
        if (res.statusCode === 200) {
            const parsed = JSON.parse(data);
            console.log("\n✅ Available Models:");
            parsed.models.forEach(model => {
                if (model.name.includes('gemini') && model.supportedGenerationMethods?.includes('generateContent')) {
                    console.log(`  - ${model.name}`);
                }
            });
        } else {
            console.error("❌ Error:", data);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Request error: ${e.message}`);
});

req.end();
