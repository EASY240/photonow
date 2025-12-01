import Bytez from 'bytez.js';

export async function handler(event) {
  try {
    const reqId = (event && event.headers && (event.headers['x-request-id'] || event.headers['X-Request-Id'])) || (Date.now().toString(36) + Math.random().toString(36).slice(2));
    console.log('optimize-prompt:request', {
      reqId,
      method: event && event.httpMethod,
      path: event && event.path,
      hasBody: !!(event && event.body),
      bodyLength: (event && event.body ? event.body.length : 0),
      query: event && event.queryStringParameters,
    });
    const body = JSON.parse(event.body || '{}');
    const basePrompt = body.basePrompt;
    const framework = body.framework;
    console.log('optimize-prompt:payload', { reqId, basePromptLength: basePrompt ? String(basePrompt).length : 0, framework });

    if (!process.env.BYTEZ_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server config error: API Key missing' }) };
    }
    console.log('optimize-prompt:env', { reqId, apiKeyPresent: !!process.env.BYTEZ_API_KEY, nodeEnv: process.env.NODE_ENV });

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
    console.log('optimize-prompt:model-run', { reqId, hasError: !!error, outputType: Array.isArray(output) ? 'array' : typeof output });

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
    let parsed;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (e) {
      const start = cleanJson.indexOf('{');
      const end = cleanJson.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        const candidate = cleanJson.slice(start, end + 1);
        try {
          parsed = JSON.parse(candidate);
        } catch (_err) {
          parsed = undefined;
        }
      }
    }
    if (parsed && typeof parsed === 'object' && typeof parsed.content === 'string') {
      try {
        parsed = JSON.parse(parsed.content);
      } catch (_ignore) {}
    }

    console.log('optimize-prompt:parsed', { reqId, parsedKeys: parsed && typeof parsed === 'object' ? Object.keys(parsed).length : 0 });
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ success: true, data: parsed || {}, meta: { reqId } }) };
  } catch (e) {
    console.error("CRITICAL FUNCTION ERROR:", e);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: `Server Error: ${e && e.message ? e.message : 'Unknown error'}`,
        meta: { errorType: e && e.name ? e.name : 'Error' }
      })
    };
  }
}
