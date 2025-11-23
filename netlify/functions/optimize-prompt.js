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
    const model = sdk.model('openai/gpt-4o');

    let structure = '';
    if (framework === 'COSTAR') {
      structure = 'Context, Offer, Style, Target, Action, Result';
    } else if (framework === 'ICDF') {
      structure = 'Instruction, Context, Data, Format';
    } else if (framework === 'RCREOC') {
      structure = 'Role, Context, Request, Examples, Output, Constraints';
    } else {
      structure = 'Message, Intention, Context, Rhythm, Output';
    }

    const systemInstruction = `You are an expert Prompt Engineer. Your goal is to transform a basic user request into a detailed, professional prompt using the ${framework} framework.\n\nAnalyze the User's Request and generate specific content for these fields: ${structure}.\n\nReturn ONLY a valid JSON object. The keys must be the field names listed above (e.g., "Context", "Offer").\nDo not use markdown code blocks. Just the raw JSON string.`;

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