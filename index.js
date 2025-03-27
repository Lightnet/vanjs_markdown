import van from "vanjs-core";
import http from "http";
import handler from "serve-handler";

const server = http.createServer((req, res) => {
  handler(req, res, {
    public: "./",
    cleanUrls: false // Ensure .js files are served correctly
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

// Export van for use in client.js
globalThis.van = van;