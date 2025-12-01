import Bytez from 'bytez.js';

export async function handler(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const basePrompt = body.basePrompt;
    const framework = body.framework;

    if (!process.env.BYTEZ_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server config error: API Key missing' }) };
    }

    const sdk = new Bytez(process.env.BYTEZ_API_KEY);
    const model = sdk.model('Qwen/Qwen3-0.6B');

    let structure = 'Message, Intention, Context, Rhythm, Output';
    if (framework === 'COSTAR') structure = 'Context, Offer, Style, Target, Action, Result';
    if (framework === 'ICDF') structure = 'Instruction, Context, Data, Format';
    if (framework === 'RCREOC') structure = 'Role, Context, Request, Examples, Output, Constraints';

    const systemInstruction = `
      Task: Expand the user request into a prompt using these fields: ${structure}.
      
      IMPORTANT: Output ONLY valid JSON. No text. No markdown.
      Example: {"Message": "content", "Intention": "goal"}
    `;

    const { error, output } = await model.run([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: basePrompt }
    ]);

    if (error) {
      throw new Error(error);
    }

    const raw = Array.isArray(output)
      ? (output[0]?.text ?? output[0])
      : (typeof output === 'string'
          ? output
          : (output && typeof output === 'object' && 'text' in output
              ? output.text
              : JSON.stringify(output)));

    const cleanJson = String(raw).replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    const finalJson = jsonMatch ? jsonMatch[0] : cleanJson;
    let parsed = JSON.parse(finalJson);
    if (parsed && typeof parsed === 'object' && typeof parsed.content === 'string') {
      try {
        parsed = JSON.parse(parsed.content);
      } catch (_ignore) {}
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, data: parsed }) };
  } catch (e) {
    console.error("CRITICAL FUNCTION ERROR:", e);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: `Server Error: ${e && e.message ? e.message : 'Unknown error'}`
      })
    };
  }
}
