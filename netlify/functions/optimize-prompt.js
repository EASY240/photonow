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
    const model = sdk.model('Qwen/Qwen3-4B-Instruct-2507');

    let structure = 'Message, Intention, Context, Rhythm, Output';
    if (framework === 'COSTAR') structure = 'Context, Offer, Style, Target, Action, Result';
    if (framework === 'ICDF') structure = 'Instruction, Context, Data, Format';
    if (framework === 'RCREOC') structure = 'Role, Context, Request, Examples, Output, Constraints';

    const systemInstruction = `
      You are an expert AI Prompt Engineer.
      Task: Analyze the user's request and generate content for the ${framework || 'MICRO'} framework.
      
      Required JSON Fields: ${structure}
      
      IMPORTANT: Return ONLY a raw JSON object. Do not use markdown formatting. Do not write explanations.
      Example Output:
      { "Message": "...", "Intention": "..." }
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
    let parsed = JSON.parse(cleanJson);
    if (parsed && typeof parsed === 'object' && typeof parsed.content === 'string') {
      try {
        parsed = JSON.parse(parsed.content);
      } catch (_ignore) {}
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, data: parsed }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
