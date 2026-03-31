import { serve } from "bun";
import { join } from "path";
import { readFileSync, existsSync } from "fs";

const PORT = 3000;

console.log(`Starting Claude Code Web Server on http://localhost:${PORT}`);

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname === "/" ? "/index.html" : url.pathname;
    
    // Check in web/ directory
    const webPath = join(process.cwd(), "web", path);
    if (existsSync(webPath)) {
      return new Response(Bun.file(webPath));
    }
    
    // Fallback to src/ for other files (e.g. .tsx imports)
    const srcPath = join(process.cwd(), path);
    if (existsSync(srcPath)) {
      return new Response(Bun.file(srcPath));
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    message(ws, message) {
      console.log(`Received message: ${message}`);
      // Handle messages from the web client (e.g. tool execution requests)
    },
    open(ws) {
      console.log("WebSocket connection opened");
    },
    close(ws) {
      console.log("WebSocket connection closed");
    },
  },
});
