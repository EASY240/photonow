import React from 'react';
import { Zap, Brain, Target, HelpCircle } from 'lucide-react';

const PromptGuideSection: React.FC = () => {
  return (
    <section className="mt-16">
      {/* Branding Header */}
      <header className="text-center py-16 px-4 bg-[#003F5C] text-white rounded-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">4 Secrets to Writing AI Prompts Like a Pro</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">The problem isn't the AI. It's how you're talking to it.</p>
      </header>

      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        {/* Why Your Prompts Fail */}
        <section className="mb-12">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-8">Why Your Prompts Fail</h2>
          <p className="text-lg max-w-3xl mx-auto text-center mb-8">
            An AI can't read your mind. It understands what you write, not what you think. A vague question gets a vague answer. A specific, detailed prompt gets a specific, detailed result. This is the entire secret to "prompt engineering."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-2xl font-bold text-center mb-4 text-[#BC5090]">The Vague Prompt</h3>
              <p className="text-center mb-4">You ask a coworker, "How's it going?"</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <strong>Prompt:</strong> "Analyze this sales data."
              </div>
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <strong className="text-red-700">Result:</strong> A generic, unhelpful summary. You get a list of numbers, but no insights and no direction.
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-2xl font-bold text-center mb-4 text-[#7A5195]">The Pro Prompt</h3>
              <p className="text-center mb-4">You ask, "Where are we on the Q3 report for the exec meeting tomorrow?"</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <strong>Prompt:</strong> "Analyze the attached Q3 sales data for our marketing meeting. I need to identify the top-performing product and the product with the sharpest decline. Format the analysis as a 3-section email..."
              </div>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <strong className="text-green-700">Result:</strong> A detailed, actionable report in the exact format you need.
              </div>
            </div>
          </div>
        </section>

        {/* Use a Framework */}
        <section className="text-center py-12 mb-12 bg-white rounded-lg shadow-inner">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Use a Framework, Not a Guess</h2>
          <p className="text-lg max-w-3xl mx-auto">
            Professionals don't guess. They use frameworks—structured templates—to ensure every prompt contains all the information an AI needs. Here are the four frameworks you can use to get expert results, every time.
          </p>
        </section>

        {/* Four Secrets Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Secret 1: ICDF */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-3xl mb-4">Secret 1: The ICDF Framework</h2>
            <p className="text-lg mb-6">This is the perfect framework for daily tasks and data analysis. It ensures you provide a complete request.</p>
            <div className="mb-6">
              <img src="/images/blog/ICDF framework.png" alt="ICDF framework visualization" className="mx-auto max-h-80" />
            </div>
            <p className="text-center font-semibold mb-6">Most users only provide the "Instruction," leading to incomplete results.</p>
            <ul className="space-y-4 mb-6">
              <li><span className="font-semibold">I - Instruction:</span> What is the core task? (e.g., "Analyze...")</li>
              <li><span className="font-semibold">C - Context:</span> Why do you need this? Who is it for? (e.g., "For a marketing meeting...")</li>
              <li><span className="font-semibold">D - Data:</span> What data should it use? (e.g., "Use the attached file...")</li>
              <li><span className="font-semibold">F - Format:</span> How should it be presented? (e.g., "As a 3-section email...")</li>
            </ul>
            <h3 className="text-xl font-bold mb-2">Example: Analyzing Sales Data</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
              <p><span className="font-bold">[Instruction]</span> Analyze the attached sales data.</p>
              <p><span className="font-bold">[Context]</span> I need to present a monthly summary to my manager for our marketing team meeting. The goal is to identify our top-performing product and the product with the most significant drop.</p>
              <p><span className="font-bold">[Data]</span> The data includes product names, units sold, and revenue for July, August, and September.</p>
              <p><span className="font-bold">[Format]</span> Present the analysis as a clean, bulleted list with three clear sections: 1. Top Performing Products, 2. Underperforming Products, and 3. Short Recommendations.</p>
            </div>
          </div>

          {/* Secret 2: RCREOC */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-3xl mb-4">Secret 2: The RCREOC Framework</h2>
            <p className="text-lg mb-6">Use this to turn the AI from a simple tool into an expert "AI Agent" that works for you by giving it a specific job.</p>
            <div className="py-8">
              <h3 className="text-xl font-bold text-center mb-4">The "AI Agent" Workflow</h3>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-700">
                <span className="px-3 py-1 rounded-full bg-gray-100">Role</span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full bg-gray-100">Context</span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full bg-gray-100">Request</span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full bg-gray-100">Examples</span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full bg-gray-100">Output</span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full bg-gray-100">Constraints</span>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              <li><span className="font-semibold">R - Role:</span> Who is the AI? (e.g., "You are an expert Assistant Project Manager...")</li>
              <li><span className="font-semibold">C - Context:</span> What is the situation? (e.g., "You review weekly reports...")</li>
              <li><span className="font-semibold">R - Request:</span> What is the specific task? (e.g., "Extract recurring problems...")</li>
              <li><span className="font-semibold">E - Examples:</span> Show it what a good answer looks like.</li>
              <li><span className="font-semibold">O - Output:</span> What is the final format? (e.g., "A table with 3 columns...")</li>
              <li><span className="font-semibold">C - Constraints:</span> What are the rules? (e.g., "Each entry must be less than 3 lines...")</li>
            </ul>
            <h3 className="text-xl font-bold mb-2">Example: Analyzing Team Reports</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
              <p><span className="font-bold">[Role]</span> You are an Assistant Project Manager on a tech team.</p>
              <p><span className="font-bold">[Context]</span> Your job is to review weekly reports to find problems and solutions.</p>
              <p><span className="font-bold">[Request]</span> Review this report and extract: 1. Recurring issues, 2. Team suggestions, 3. Your recommendations.</p>
              <p><span className="font-bold">[Output]</span> Format as a 3-column table: 'Issue', 'Proposed Solution', 'Recommendation'.</p>
              <p><span className="font-bold">[Constraints]</span> Each entry must be under 3 lines.</p>
            </div>
          </div>

          {/* Secret 3: MICRO */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-3xl mb-4">Secret 3: The MICRO Framework</h2>
            <p className="text-lg mb-6">This is the ultimate framework for all content creation, from blog posts to video scripts.</p>
            <div className="mb-6">
              <img src="/images/blog/MICRO framework.png" alt="MICRO framework visualization" className="mx-auto max-h-80" />
            </div>
            <p className="text-center font-semibold mb-6">A great piece of content balances all axes.</p>
            <ul className="space-y-4 mb-6">
              <li><span className="font-semibold">M - Message:</span> What is the core takeaway?</li>
              <li><span className="font-semibold">I - Intention:</span> What is the goal? (Persuade, inform, motivate...)</li>
              <li><span className="font-semibold">C - Context (Audience):</span> Who is this for?</li>
              <li><span className="font-semibold">R - Rhythm (Tone):</span> What is the style? (Formal, funny, motivational...)</li>
              <li><span className="font-semibold">O - Output:</span> What is the final format? (Blog post, 5-min video script...)</li>
            </ul>
            <h3 className="text-xl font-bold mb-2">Example: Writing a YouTube Script</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
              <p><span className="font-bold">[Output]</span> Write a 5-minute YouTube script with an intro, body, and conclusion.</p>
              <p><span className="font-bold">[Message]</span> Help college students organize their study time effectively.</p>
              <p><span className="font-bold">[Intention]</span> Persuade students that AI is a tool for success, not for cutting corners.</p>
              <p><span className="font-bold">[Context/Audience]</span> US college students who are stressed and want realistic solutions.</p>
              <p><span className="font-bold">[Rhythm/Tone]</span> Fast-paced, encouraging, and motivational.</p>
            </div>
          </div>

          {/* Secret 4: COSTAR */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-3xl mb-4">Secret 4: The COSTAR Framework</h2>
            <p className="text-lg mb-6">This framework makes the AI think like a professional marketer. Perfect for emails, ads, and landing pages.</p>
            <div className="py-8">
              <h3 className="text-xl font-bold text-center mb-4">The Marketing Funnel Workflow</h3>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-700">
                <span className="px-3 py-1 rounded-full bg-gray-100">Context</span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full bg-gray-100">Offer</span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full bg-gray-100">Style</span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full bg-gray-100">Target</span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full bg-gray-100">Action</span>
                <span>→</span>
                <span className="px-3 py-1 rounded-full bg-gray-100">Result</span>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              <li><span className="font-semibold">C - Context:</span> What is this for? (e.g., "A marketing email...")</li>
              <li><span className="font-semibold">O - Offer:</span> What is the promotion? (e.g., "25% off for 72 hours...")</li>
              <li><span className="font-semibold">S - Style:</span> What is the tone? (e.g., "Simple, warm, and helpful...")</li>
              <li><span className="font-semibold">T - Target:</span> Who is the audience? (e.g., "Busy homeowners 25-45...")</li>
              <li><span className="font-semibold">A - Action:</span> What should they do? (e.g., "Click the 'Shop Now' link...")</li>
              <li><span className="font-semibold">R - Result:</span> What is the business goal? (e.g., "Boost sales...")</li>
            </ul>
            <h3 className="text-xl font-bold mb-2">Example: Writing a Promo Email</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
              <p><span className="font-bold">[Context]</span> Write a marketing email for a new promotion on smart home cleaning products.</p>
              <p><span className="font-bold">[Offer]</span> 25% off all smart cleaning tools, online only for 72 hours.</p>
              <p><span className="font-bold">[Style]</span> Simple, warm, and helpful. Like a friendly tip, not a sales pitch.</p>
              <p><span className="font-bold">[Target]</span> Busy homeowners (25-45) who value their free time.</p>
              <p><span className="font-bold">[Action]</span> Click the 'Shop Now' link before the sale ends.</p>
              <p><span className="font-bold">[Result]</span> Boost sales and attract new customers.</p>
            </div>
          </div>
        </section>

        {/* Closing Banner */}
        <footer className="text-center py-16 px-4 mt-12 bg-[#003F5C] text-white rounded-lg">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Stop Guessing. Start Directing.</h2>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            The difference between an amateur and a pro is structure. Use these frameworks to provide the clarity, context, and constraints the AI needs to deliver exceptional results.
          </p>
        </footer>
        <section className="container mx-auto max-w-7xl p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose Generate Prompt AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Enhancement</h3>
              <p className="text-gray-700">Get immediate improvements to your Prompts using advanced AI techniques.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Analysis</h3>
              <p className="text-gray-700">Our system uses sophisticated analysis techniques to understand your Prompt context and provide optimal suggestions.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Precision Results</h3>
              <p className="text-gray-700">Get accurate and relevant responses from AI with our enhanced Prompts.</p>
            </div>
          </div>
        </section>
        <section className="container mx-auto max-w-7xl p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <h3 className="text-base font-semibold">What is the AI Prompt Generator?</h3>
              </div>
              <p className="text-gray-700">A free web tool that transforms a simple idea into a professional prompt using frameworks like COSTAR, MICRO, ICDF, and RCREOC. It analyzes intent, suggests structured fields, and assembles a polished prompt ready for ChatGPT, Claude, or Gemini.</p>
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <h3 className="text-base font-semibold">How does the AI Prompt Generator work?</h3>
              </div>
              <p className="text-gray-700">You enter a short idea; the analyzer detects the best framework; the backend uses Bytez with GPT‑4o to generate structured suggestions; the UI lets you refine each field and outputs a final prompt you can copy.</p>
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <h3 className="text-base font-semibold">Can I use the tool for free?</h3>
              </div>
              <p className="text-gray-700">Yes. It is completely free and requires no registration.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <h3 className="text-base font-semibold">What use cases does the tool support?</h3>
              </div>
              <p className="text-gray-700">Marketing emails and ads (COSTAR), content scripts and posts (MICRO), data analysis and reporting (ICDF), expert reviews and critiques (RCREOC), plus general prompt polishing for chat models.</p>
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <h3 className="text-base font-semibold">How can I ensure high-quality Prompts?</h3>
              </div>
              <p className="text-gray-700">Provide clear context and goals, include relevant data or constraints, select the right framework, and refine the suggested fields for accuracy before copying the final prompt.</p>
              <div>
                <div className="flex items-start gap-3 mb-1">
                  <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <h3 className="text-base font-semibold">Do the generated Prompts support all AI models?</h3>
                </div>
                <p className="text-gray-700">The tool is designed to support popular AI models like ChatGPT, Claude, and Gemini, but it is also adaptable to most other models. You may need slight adjustments to fit the specific requirements of the model you are using.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default PromptGuideSection;