const fs = require('fs');
const content = fs.readFileSync('../examples/05_http_api_client.omni', 'utf8');
const start = 6190;
const len = 454;
const end = start + len;
console.log("Start char:", content[start]);
console.log("End char:", content[end]);
console.log("Snippet at end:", content.substring(end - 50, end + 50));
