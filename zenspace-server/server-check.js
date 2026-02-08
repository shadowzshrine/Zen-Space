const http = require('http');

console.log("Checking server health...");
const req = http.request({
    hostname: 'localhost',
    port: 1337,
    path: '/_health',
    method: 'HEAD',
    timeout: 2000
}, (res) => {
    console.log(`Server responded with status: ${res.statusCode}`);
});

req.on('error', (e) => {
    console.error(`Server unreachable: ${e.message}`);
});

req.on('timeout', () => {
    console.error('Request timed out');
    req.destroy();
});

req.end();
