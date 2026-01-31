export async function handler(event) {
  try {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Request-Id, X-Debug',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event && event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders, body: '' };
    }
    // 1. Setup Request ID and Logging (Preserved from your original code)
    const reqId = (event && event.headers && (event.headers['x-request-id'] || event.headers['X-Request-Id'])) || (Date.now().toString(36) + Math.random().toString(36).slice(2));
    
    console.log('optimize-prompt:request', {
      reqId,
      method: event && event.httpMethod,
      bodyLength: (event && event.body ? event.body.length : 0),
    });

    // 2. Parse Body
    const body = JSON.parse(event.body || '{}');
    const basePrompt = body.basePrompt;
    const framework = body.framework;

    // 3. Check for API Key (Using standard OPENROUTER_API_KEY name)
    // Note: Ensure this is set in your Netlify Dashboard
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY; 

    if (!apiKey) {
      console.error("Missing OPENROUTER_API_KEY");
      return { statusCode: 500, body: JSON.stringify({ error: 'Server config error: API Key missing' }) };
    }

    // 4. Initialize OpenRouter SDK
    const { OpenRouter } = await import('@openrouter/sdk');
    const openrouter = new OpenRouter({ apiKey });
    
    // 5. Define Framework Structure
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

    // 6. Call OpenRouter with the specific model and Streaming
    const stream = await openrouter.chat.send({
      model: "openai/gpt-oss-120b:free", // The specific model you requested
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: basePrompt }
      ],
      stream: true,
      streamOptions: {
        includeUsage: true // Enable reasoning token tracking
      }
    });

    // 7. Collect Stream and Log Reasoning
    let rawOutput = "";
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        rawOutput += content;
      }
      
      // Log reasoning tokens as requested
      if (chunk.usage && chunk.usage.reasoningTokens) {
        console.log(`optimize-prompt:reasoning [${reqId}]`, { 
          tokens: chunk.usage.reasoningTokens 
        });
      }
    }

    // 8. Robust JSON Parsing (Preserved from your original code)
    // This is crucial because models sometimes add markdown ```json blocks
    const cleanJson = String(rawOutput).replace(/```json/g, '').replace(/```/g, '').trim();
    let parsed;
    
    try {
      parsed = JSON.parse(cleanJson);
    } catch (e) {
      // Fallback: Try to find the JSON object boundaries
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

    // Double check nested content strings
    if (parsed && typeof parsed === 'object' && typeof parsed.content === 'string') {
      try {
        parsed = JSON.parse(parsed.content);
      } catch (_ignore) {}
    }

    console.log('optimize-prompt:success', { reqId, keysFound: parsed ? Object.keys(parsed).length : 0 });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ success: true, data: parsed || {}, meta: { reqId } })
    };

  } catch (e) {
    const status = Number(e?.statusCode || e?.status || e?.response?.status || e?.response?.statusCode || 500);
    let message = typeof e?.message === 'string' ? e.message : 'Prompt request failed';
    let code = status;
    if (typeof e?.body === 'string') {
      try {
        const parsed = JSON.parse(e.body);
        if (parsed?.error?.message) message = parsed.error.message;
        if (parsed?.error?.metadata?.raw) message = parsed.error.metadata.raw;
        if (typeof parsed?.error?.code === 'number') code = parsed.error.code;
      } catch {}
    }
    if (code === 429 || /rate[-\s]?limit/i.test(message)) {
      message = 'The prompt engine is temporarily rate-limited. Please try again in a minute.';
    }
    console.error("CRITICAL FUNCTION ERROR:", { status: code, message });
    return {
      statusCode: code === 200 ? 500 : code,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({
        success: false,
        error: message,
        meta: { errorType: e && e.name ? e.name : 'Error', code }
      })
    };
  }
}
