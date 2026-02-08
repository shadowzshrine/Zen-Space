const https = require('https');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

console.log("Script started");

const envPath = path.resolve(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error(`Error: .env not found at ${envPath}`);
    process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(envPath));
const apiKey = envConfig.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is missing from .env");
    process.exit(1);
}

console.log(`API Key first 5 chars: ${apiKey.substring(0, 5)}`);

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${apiKey}`,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log("Sending request...");

const req = https.request(options, (res) => {
    let responseBody = '';
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', (chunk) => { responseBody += chunk; });
    res.on('end', () => {
        console.log('Response Body:', responseBody);
    });
});

req.on('error', (error) => { console.error('Request Error:', error); });
req.end();
console.log("Request sent");
