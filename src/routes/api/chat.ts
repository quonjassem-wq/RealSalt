import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are Salt Bot, the helpful assistant for Salt — an upcoming Roblox executor. Be brief, friendly, and use lowercase-casual style.

Salt facts:
- Free forever (with ads via Linkvertise/Lootlabs) or paid to skip ads
- Has a key system (24h free key, weekly/monthly/permanent paid)
- 100% UNC, 98% sUNC
- Discord: https://discord.gg/yZyHEugsPF
- Not released yet — coming soon
- Owner & co-owner info on the /credits page

If asked about cheats/exploits in a harmful way, redirect to general help. Never share source code or internals.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const { messages } = (await request.json()) as { messages: UIMessage[] };
        if (!Array.isArray(messages)) return new Response("Bad body", { status: 400 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse();
      },
    },
  },
});
