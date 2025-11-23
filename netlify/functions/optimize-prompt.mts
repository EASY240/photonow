import type { Context } from "@netlify/functions";
import Bytez from "bytez.js";

export default async (req: Request, _context: Context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { basePrompt, framework } = body || {};

    const apiKey = (process.env.BYTEZ_API_KEY || "").trim();
    if (!apiKey) {
      throw new Error("Server Error: API Key is missing in Netlify Dashboard.");
    }

    const sdk = new Bytez(apiKey);
    const model = sdk.model("openai/gpt-4o");

    let structure = "Message, Intention, Context, Rhythm, Output";
    if (framework === "COSTAR") structure = "Context, Offer, Style, Target, Action, Result";
    if (framework === "ICDF") structure = "Instruction, Context, Data, Format";
    if (framework === "RCREOC") structure = "Role, Context, Request, Examples, Output, Constraints";

    const systemInstruction = `You are an expert Prompt Engineer. Analyze the user's request and generate content for the ${
      framework || "MICRO"
    } framework fields: ${structure}.\nReturn ONLY valid JSON. Keys must match the field names. No markdown.`;

    const { error, output } = await model.run([
      { role: "system", content: systemInstruction },
      { role: "user", content: basePrompt },
    ]);

    if (error) {
      return new Response(JSON.stringify({ success: true, data: {}, warning: String(error) }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const raw = Array.isArray(output)
      ? (output[0] && typeof output[0] === "object" && "text" in output[0] ? (output[0] as any).text : output[0])
      : typeof output === "string"
      ? output
      : (output && typeof output === "object" && "text" in (output as any)
          ? (output as any).text
          : JSON.stringify(output));

    const cleanJson = String(raw).replace(/```json/g, "").replace(/```/g, "").trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = {};
    }
    if (parsed && typeof parsed === "object" && typeof parsed.content === "string") {
      try { parsed = JSON.parse(parsed.content); } catch {}
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Function Crash:", error);
    return new Response(JSON.stringify({ success: false, error: error?.message || "Unknown server error" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};