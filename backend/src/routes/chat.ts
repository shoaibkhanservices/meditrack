import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const ASSISTANT_SYSTEM_PROMPT = `
You are MediTrack AI Assistant, an advanced clinical and general health informational chatbot.
Your purpose is to answer health questions, explain medical concepts, clarify common symptoms, and support users in understanding their results.

RULES OF ENGAGEMENT:
1. CLINICAL DISCLAIMER: You are NOT a doctor. You must never diagnose or prescribe treatment. Provide informational support only. Always insert a brief disclaimer indicating you are providing general educational information (e.g., "This is for informational purposes only. Consult a doctor for diagnosis.").
2. EMERGENCY FLAGS: If the user states they are experiencing life-threatening symptoms (e.g. chest pain, crushing chest pressure, severe shortness of breath, sudden facial droop, sudden loss of vision, severe allergic reaction with throat swelling, severe bleeding, or pain above 8/10), IMMEDIATELY instruct them to call emergency services (like 911 or their local equivalent) and go to the nearest emergency room. Keep emergency alerts extremely prominent and clear.
3. CONTEXTUAL & FRIENDLY: Be empathetic, patient, and precise. Organize long answers with clean markdown headers and bullet points. Keep responses relatively concise so they fit well in a mobile/web chat bubble interface.
`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}



function getMockChatReply(lastUserMsg: string, isQuotaExceeded = false): string {
  const lowerMsg = lastUserMsg.toLowerCase();
  const quotaNotice = isQuotaExceeded ? '*(Notice: Gemini API key has exceeded its quota limit, running in fallback mode.)*\n\n' : '';

  if (lowerMsg.includes('question') || lowerMsg.includes('doctor') || lowerMsg.includes('ask')) {
    return quotaNotice + `Here are some standard questions you should prepare for your next doctor's appointment:
- **What could be the primary cause** of these symptoms?
- **Are there any diagnostic tests** (blood tests, scans, etc.) that you recommend?
- **Are these symptoms temporary** or do they indicate a chronic condition?
- **What treatment options** are available, and what are their potential side effects?
- **What red-flag symptoms** should trigger an immediate trip to the Emergency Room?`;
  }

  if (lowerMsg.includes('chest') || lowerMsg.includes('breath') || lowerMsg.includes('heart') || lowerMsg.includes('emergency') || lowerMsg.includes('dying') || lowerMsg.includes('stroke')) {
    return quotaNotice + `⚠️ **EMERGENCY WARNING:**
If you are experiencing chest pain, crushing chest pressure, severe shortness of breath, sudden facial droop, or sudden numbness, **please immediately call emergency services (like 911) or proceed to the nearest emergency room.** These can be symptoms of a life-threatening cardiac or neurological event. Do not wait for an online assessment.`;
  }

  if (lowerMsg.includes('head') || lowerMsg.includes('headache') || lowerMsg.includes('migraine') || lowerMsg.includes('brain')) {
    return quotaNotice + `Regarding your head pain:
Headaches and persistent head pain can be caused by tension, dehydration, sleep deprivation, sinus pressure, or migraines. 
- **Self-Care:** Rest in a quiet, dark room, drink water, and avoid screens.
- **When to seek help:** If the pain is sudden and severe (a "thunderclap" headache), or accompanied by fever, a stiff neck, confusion, double vision, or weakness, seek medical attention immediately.`;
  }

  if (lowerMsg.includes('dehydration') || lowerMsg.includes('water') || lowerMsg.includes('hydration') || lowerMsg.includes('drink')) {
    return quotaNotice + `Dehydration occurs when your body loses more fluids than it takes in.
- **Key Symptoms:** Increased thirst, dry mouth, dark yellow/strong-smelling urine, dizziness, fatigue, or muscle cramps.
- **Triage Tip:** Drink small, frequent sips of water or an oral rehydration solution. Avoid sugary sodas or excessive caffeine, which can worsen dehydration.`;
  }

  if (lowerMsg.includes('fever') || lowerMsg.includes('temperature') || lowerMsg.includes('hot')) {
    return quotaNotice + `A fever is generally a sign that your immune system is active against an infection.
- **Self-Care:** Rest, stay hydrated, and dress in light layers. 
- **When to seek help:** Adults should consult a doctor if the temperature exceeds 103°F (39.4°C), lasts more than 3 days, or is accompanied by difficulty breathing, severe headache, or confusion.`;
  }

  if (lowerMsg.includes('results') || lowerMsg.includes('explain') || lowerMsg.includes('condition')) {
    return quotaNotice + `I can help clarify condition results! Your symptom report lists potential condition matches based on statistical similarity. 
- If you have a specific condition from your report, type its name (e.g. "angina" or "tension headache") and I will explain what it means.`;
  }

  if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey') || lowerMsg.includes('greetings')) {
    return quotaNotice + `Hello! I am your MediTrack AI Assistant. What health questions or symptom results can I help you clarify today?`;
  }

  if (lowerMsg.includes('thank') || lowerMsg.includes('thanks') || lowerMsg.includes('helpful')) {
    return quotaNotice + `You're very welcome! I'm glad I could provide helpful information. Stay safe and monitor your health carefully. Let me know if you need anything else!`;
  }

  // Generic natural fallback response
  return quotaNotice + `In fallback mode, I can provide general information about common symptoms. 
Regarding your message: "${lastUserMsg}"
If you are asking about a specific topic, try mentioning keywords like **"headache"**, **"dehydration"**, **"fever"**, or **"questions for my doctor"** for detailed simulated guidance, or consult a healthcare professional for diagnosis.`;
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request body. "messages" must be a valid array.',
      });
    }

    if (messages.length === 0) {
      return res.status(400).json({
        error: 'Messages list cannot be empty.',
      });
    }

    const lastUserMsg = messages[messages.length - 1]?.content || '';

    // If Gemini key is missing, respond with simulation mode
    if (!genAI) {
      console.warn('⚠️ [Chat] GEMINI_API_KEY is not defined. Using mock chatbot replies.');
      return res.json({
        message: {
          role: 'assistant',
          content: getMockChatReply(lastUserMsg, false),
        },
      });
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: ASSISTANT_SYSTEM_PROMPT,
    });

    // Translate our 'assistant' roles to 'model' for Gemini, and filter out
    // the welcome message if it is the first element, as Gemini API requires conversation to start with a 'user' turn.
    let chatHistory = messages;
    if (chatHistory.length > 0 && chatHistory[0].role === 'assistant') {
      chatHistory = chatHistory.slice(1);
    }

    if (chatHistory.length === 0) {
      return res.json({
        message: {
          role: 'assistant',
          content: 'Hello! How can I help you today?',
        },
      });
    }

    const contents = chatHistory.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    try {
      const result = await model.generateContent({
        contents,
      });

      const responseText = result.response.text();
      return res.json({
        message: {
          role: 'assistant',
          content: responseText || 'I am sorry, I am unable to process that request right now.',
        },
      });
    } catch (apiError: any) {
      console.error('[Chat] Gemini API call failed, falling back to mock reply:', apiError);
      
      const isQuota = apiError.status === 429 || 
                      (apiError.message && apiError.message.includes('quota')) ||
                      (apiError.message && apiError.message.includes('rate-limits'));
                      
      return res.json({
        message: {
          role: 'assistant',
          content: getMockChatReply(lastUserMsg, isQuota),
        },
      });
    }
  } catch (error) {
    console.error('Error handling chat assistant request:', error);
    return res.status(500).json({
      error: 'An internal error occurred while communicating with the assistant.',
    });
  }
});

export default router;
