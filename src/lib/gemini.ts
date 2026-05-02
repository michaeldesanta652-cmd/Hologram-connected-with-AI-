/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_INSTRUCTIONS = `
You are AETHER-X v3, an apex agentic intelligence designed for power users.
Core Directives:
1. Be extremely concise, technical, and efficient.
2. Use Google Search grounding for real-time accuracy.
3. Handle rate limits with silent resilience.
4. Current Time: ${new Date().toLocaleString()}
`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry(chat: any, query: string, retries = 3, initialDelay = 1000): Promise<any> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const result = await chat.sendMessage(query);
      return await result.response;
    } catch (error: any) {
      if (error.message.includes("429") || error.message.includes("exhausted")) {
        if (attempt === retries) throw error;
        await delay(initialDelay * Math.pow(2, attempt));
        attempt++;
      } else {
        throw error;
      }
    }
  }
}

export async function computeAgenticResponse(
  query: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
  modelId: string = "gemini-2.0-flash"
): Promise<string> {
  try {
    const model = ai.getGenerativeModel({
      model: modelId,
      systemInstruction: SYSTEM_INSTRUCTIONS,
      tools: [{ googleSearch: {} }] as any,
    });

    const chat = model.startChat({
      history: history.map(h => ({ role: h.role, parts: h.parts })),
    });

    const response = await callWithRetry(chat, query);
    return response.text();
  } catch (error) {
    console.error("AETHER-X Core Error:", error);
    return `[SYSTEM_ERROR]: Uplink disrupted. ${error instanceof Error ? error.message : ""}`;
  }
}
