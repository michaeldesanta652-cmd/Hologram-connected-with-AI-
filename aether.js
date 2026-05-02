const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");

/**
 * AETHER-X APEX AGENTIC CLI v3.0
 * Optimized for Termux / ARM64
 * Features: Exponential Backoff, History Trimming, Slash Commands
 */

// Configuration
const AVAILABLE_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite-preview-02-05",
  "gemini-2.0-pro-experimental-02-05",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.0-pro",
  "gemini-3-flash-preview"
];

let currentModelName = "gemini-2.0-flash";
const MAX_HISTORY = 12; 
let history = [];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Exponential Backoff Wrapper
async function callIntelligenceWithRetry(chat, query, retries = 3, initialDelay = 1000) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const result = await chat.sendMessage(query);
      return await result.response;
    } catch (error) {
      if (error.message.includes("429") || error.message.includes("Resource has been exhausted")) {
        if (attempt === retries) throw error;
        const waitTime = initialDelay * Math.pow(2, attempt);
        console.log(`\x1b[1;31m[RATE_LIMIT]: Retrying in ${waitTime}ms...\x1b[0m`);
        await delay(waitTime);
        attempt++;
      } else {
        throw error;
      }
    }
  }
}

async function run() {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("\x1b[1;31m[ERROR]: GEMINI_API_KEY not found in environment.\x1b[0m");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const getAgenticChat = (modelName) => {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: "You are AETHER-X v3, an apex agentic intelligence. Be extremely technical. Use Google Search for every query. Trim verbose fluff. Current Platform: Terminal.",
      tools: [{ googleSearch: {} }],
    });
    return model.startChat({ history: history.slice(-MAX_HISTORY) });
  };

  let chat = getAgenticChat(currentModelName);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `\x1b[1;36maether-x[${currentModelName}]:~$\x1b[0m `,
  });

  console.log("\x1b[1;36m[AETHER-X v3.0 AGENTIC CORE ONLINE]\x1b[0m");
  console.log("\x1b[1;32m[RETRY_LOGIC: ACTIVE | HISTORY_TRIM: ON]\x1b[0m");
  console.log("Type \x1b[1;33m/help\x1b[0m for commands.\n");

  rl.prompt();

  rl.on("line", async (line) => {
    const query = line.trim();
    if (!query) {
      rl.prompt();
      return;
    }

    // Command Parser
    if (query.startsWith("/")) {
      const args = query.split(" ");
      const cmd = args[0].toLowerCase();

      switch (cmd) {
        case "/help":
          console.log("\n\x1b[1;36mAVAILABLE COMMANDS:\x1b[0m");
          console.log("  /models      : List all available Gemini engines");
          console.log("  /model <id>  : Switch model (e.g., /model gemini-1.5-pro)");
          console.log("  /clear       : Clear neural history (conserve tokens)");
          console.log("  /info        : Show status and telemetry");
          console.log("  /exit        : Shutdown uplink\n");
          break;
        case "/models":
          console.log("\n\x1b[1;36mCOMPATIBLE ENGINES:\x1b[0m");
          AVAILABLE_MODELS.forEach(m => console.log(`  - ${m}`));
          console.log("");
          break;
        case "/model":
          if (args[1]) {
            currentModelName = args[1];
            chat = getAgenticChat(currentModelName);
            rl.setPrompt(`\x1b[1;36maether-x[${currentModelName}]:~$\x1b[0m `);
            console.log(`\x1b[1;32m[SYSTEM]: Switched to ${currentModelName}\x1b[0m`);
          } else {
            console.log("\x1b[1;33m[USAGE]: /model <model-name>\x1b[0m");
          }
          break;
        case "/clear":
          history = [];
          chat = getAgenticChat(currentModelName);
          console.log("\x1b[1;32m[SYSTEM]: Neural history purged.\x1b[0m");
          break;
        case "/info":
          console.log(`\x1b[1;36mSTATUS:\x1b[0m ACTIVE`);
          console.log(`\x1b[1;36mMODEL:\x1b[0m ${currentModelName}`);
          console.log(`\x1b[1;36mHISTORY_DEPTH:\x1b[0m ${history.length}/${MAX_HISTORY}`);
          break;
        case "/exit":
        case "/quit":
          console.log("\x1b[1;33m[SHUTTING DOWN UPLINK...]\x1b[0m");
          process.exit(0);
          break;
        default:
          console.log("\x1b[1;31m[ERROR]: Unknown command. Type /help\x1b[0m");
      }
      rl.prompt();
      return;
    }

    process.stdout.write("\x1b[1;33m[THINKING...]\x1b[0m\r");

    try {
      const response = await callIntelligenceWithRetry(chat, query);
      const text = response.text();
      
      console.log("\x1b[K" + text);
      
      // Manage local history window
      history.push({ role: "user", parts: [{ text: query }] });
      history.push({ role: "model", parts: [{ text: text }] });
      if (history.length > MAX_HISTORY * 2) {
        history = history.slice(-MAX_HISTORY * 2);
      }
    } catch (error) {
      console.error("\n\x1b[1;31m[CORE ERROR]:\x1b[0m", error.message);
    }

    rl.prompt();
  });
}

run();
