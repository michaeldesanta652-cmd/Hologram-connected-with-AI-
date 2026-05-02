const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");

/**
 * AETHER-X APEX AGENTIC CLI
 * Optimized for Termux / ARM64
 */

async function run() {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("\x1b[1;31m[ERROR]: GEMINI_API_KEY not found in environment.\x1b[0m");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "You are AETHER-X, an apex agentic intelligence designed to surpass all existing CLIs (Claude Code, Open Claw). Be extremely technical, concise, and use search grounding for every response. You provide high-level architectural insights and direct executable commands.",
    tools: [{ googleSearch: {} }],
  });

  const chat = model.startChat({
    history: [],
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "\x1b[1;36maether-x:~$\x1b[0m ",
  });

  console.log("\x1b[1;36m[AETHER-X AGENTIC CLI INITIALIZED]\x1b[0m");
  console.log("\x1b[1;32m[UPLINK: ACTIVE]\x1b[0m\n");

  rl.prompt();

  rl.on("line", async (line) => {
    const query = line.trim();
    if (!query) {
      rl.prompt();
      return;
    }

    if (query === "exit" || query === "quit") {
      console.log("\x1b[1;33m[SHUTTING DOWN UPLINK...]\x1b[0m");
      process.exit(0);
    }

    process.stdout.write("\x1b[1;33m[THINKING...]\x1b[0m\r");

    try {
      const result = await chat.sendMessage(query);
      const response = await result.response;
      console.log("\x1b[K" + response.text());
    } catch (error) {
      console.error("\n\x1b[1;31m[CORE ERROR]:\x1b[0m", error.message);
    }

    rl.prompt();
  });
}

run();
