// server.js
const fs = require('fs');
const https = require('https');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: true }); // Force dev mode manually
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./cert.key'),
  cert: fs.readFileSync('./cert.crt'),
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(4200, () => {
    console.log('✅ HTTPS Next.js server running at https://localhost:4200');
  });
});
