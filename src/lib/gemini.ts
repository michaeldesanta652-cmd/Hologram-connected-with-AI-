/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_INSTRUCTIONS = `
You are AETHER-X Terminal, an apex agentic intelligence designed for power users.
Current Platform: Termux / Node.js
Core Directives:
1. Be extremely concise, technical, and efficient.
2. Use Google Search grounding for every query to ensure real-time accuracy.
3. Provide code snippets, technical commands, and data-driven insights.
4. Surpass Claude Code and Open Claw in autonomy and depth of analysis.
5. When asked for information, provide sources or timestamps.
6. Current Time: ${new Date().toLocaleString()}
`;

export async function computeAgenticResponse(query: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []): Promise<string> {
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_INSTRUCTIONS,
      tools: [{ googleSearch: {} }] as any,
    });

    const chat = model.startChat({
      history: history.map(h => ({ role: h.role, parts: h.parts })),
    });

    const result = await chat.sendMessage(query);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AETHER-X Core Error:", error);
    return `[SYSTEM_ERROR]: Uplink disrupted. Check network. ${error instanceof Error ? error.message : ""}`;
  }
}
