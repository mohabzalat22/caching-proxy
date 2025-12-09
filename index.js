#!/usr/bin/env node
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { HashMap } from "./utils/hashmap.js";
import { successMessage, errorMessage } from "./utils/message.js";
import { argv } from "process";
import * as readline from "node:readline";
import { EventEmitter } from "events";

const emitter = new EventEmitter();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const hostname = "localhost";
const hashmap = new HashMap();

let port = 8000;
let origin = "";

argv.forEach((arg, index) => {
  if (arg.startsWith("/")) return;

  if (arg == "--port") {
    port = argv[index + 1];
  }

  if (arg == "--origin") {
    origin = argv[index + 1];
  }
});

if (!origin || !port) {
  console.log("please use --origin and --port to run server");
  process.exit(1);
}

const blackListRoutes = ["/favicon.ico"];

const server = createServer(async (req, res) => {
  const url = req.url;

  if (blackListRoutes.includes(url)) {
    res.statusCode = 400;
    res.end("invalid json");
    return;
  }

  const originUrl = origin + url;

  if (!hashmap.get(url)) {
    try {
      console.log("origin request: ", originUrl);
      const response = await fetch(originUrl, {
        method: req.method,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          body: JSON.stringify(req.body),
        },
      });

      if (!response.ok) {
        throw new Error("HTTP Error status: " + response.status);
      }

      const data = await response.json();
      hashmap.set(url, JSON.stringify(data));
      // set header
      res.setHeader("Content-Type", "application/json");
      res.setHeader("X-Cache", "MISS");
      res.statusCode = 200;

      const finalResponse = successMessage(
        200,
        true,
        "success fetch from origin server",
        data
      );
      res.write(JSON.stringify(finalResponse));
    } catch (err) {
      res.write(JSON.stringify(errorMessage(400, false, err.message, [])));
    }
  } else {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;

    res.setHeader("X-Cache", "HIT");

    const data = JSON.parse(hashmap.get(url));

    const finalResponse = successMessage(
      200,
      true,
      "success fetch from origin server",
      data
    );

    res.write(JSON.stringify(finalResponse));
  }
  res.end();
});

server.listen(port, hostname, () => {
  console.log("\n=================================");
  console.log("🚀 Cache Proxy Server Started");
  console.log("=================================");
  console.log(`📍 Server: http://${hostname}:${port}`);
  console.log(`🎯 Origin: ${origin}`);
  console.log(`💾 Cache: Ready`);
  console.log("=================================");
  console.log("\nType cache-proxy -h or --help for available commands\n");
  rl.prompt();
});

emitter.on("clear-cache", () => {
  hashmap.clear();
  console.log(`Cleared cached entries`);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

const showHelp = () => {
  console.log("\n=== Available Commands ===");
  console.log("  -h, --help              Show this help message");
  console.log("  --clear-cache           Clear all cached entries");
  console.log("  exit, quit              Exit the application");
  console.log("==========================\n");
};

rl.on("line", (input) => {
  const trimmedInput = input.trim();
  console.log(trimmedInput);

  switch (trimmedInput) {
    case "cache-proxy --clear-cache":
      emitter.emit("clear-cache");
      break;
    case "cache-proxy -h":
    case "cache-proxy --help":
      showHelp();
      break;
    case trimmedInput === "exit" || trimmedInput === "quit":
      process.exit(0);
    default:
      console.log("Unknown command:", trimmedInput);
      console.log("Type -h or --help for available commands");
      break;
  }

  rl.prompt();
});
