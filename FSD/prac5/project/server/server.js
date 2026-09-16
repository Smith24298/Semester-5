/* ============================================================
   Zero-dependency static file server for the PG & Hostel Finder
   Serves everything under ../public (relative to this file).
   Usage: node server/server.js   ->  http://localhost:3000
   ============================================================ */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".txt": "text/plain; charset=utf-8",
    ".map": "application/json"
};

const server = http.createServer((req, res) => {
    // Only GET/HEAD
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { "Allow": "GET, HEAD" });
        res.end("Method Not Allowed");
        return;
    }

    // Normalise the request path
    let urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    if (urlPath === "/") urlPath = "/index.html";

    const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
    const ext = path.extname(filePath).toLowerCase();

    // Basic traversal guard
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 Not Found");
            return;
        }

        res.writeHead(200, {
            "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
            "Content-Length": stats.size
        });

        if (req.method === "HEAD") {
            res.end();
            return;
        }

        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`PG & Hostel Finder running at: http://localhost:${PORT}`);
    console.log(`  Student Search:  http://localhost:${PORT}/`);
    console.log(`  Owner Dashboard:  http://localhost:${PORT}/owner/dashboard.html`);
});
