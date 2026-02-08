const https = require('https');
const fs = require('fs');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

console.log("Fetching ALL available Gemini models with full details...\n");

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
        if (res.statusCode === 200) {
            const parsed = JSON.parse(data);

            // Write full response to file
            fs.writeFileSync('models-full.json', JSON.stringify(parsed, null, 2));
            console.log("✅ Full response saved to models-full.json\n");

            console.log("📋 Available models that support generateContent:\n");
            parsed.models.forEach(model => {
                if (model.supportedGenerationMethods?.includes('generateContent')) {
                    console.log(`Model: ${model.name}`);
                    console.log(`  Display Name: ${model.displayName}`);
                    console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
                    console.log(`  Vision: ${model.name.includes('vision') || model.name.includes('pro') || model.name.includes('2.5') ? 'YES' : 'Maybe'}`);
                    console.log('');
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
