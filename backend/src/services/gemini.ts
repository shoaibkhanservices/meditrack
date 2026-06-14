import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

// Initialize Google Generative AI client if key is present
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface SymptomEntry {
  region: string;
  symptomId: string;
  symptomName: string;
  severity: number;
  duration: string;
  freeText?: string;
}

export interface UserProfile {
  age?: number;
  sex?: 'male' | 'female' | 'prefer_not_to_say';
  conditions?: string[];
}

export interface AnalysisResult {
  sessionId: string;
  urgencyLevel: 'EMERGENCY' | 'SEE_DOCTOR_TODAY' | 'MONITOR_AT_HOME' | 'ROUTINE_CHECKUP';
  urgencyColor: string;
  conditions: Array<{
    name: string;
    confidence: number;
    description: string;
    learnMoreUrl?: string;
    tags?: string[];
  }>;
  recommendations: string[];
  keySymptoms: string[];
  disclaimer: string;
  emergencyContact?: string | null;
}

// System prompt instructing Gemini to behave as a medical triage assistant
const MEDICAL_TRIAGE_SYSTEM_PROMPT = `
You are MediTrack AI, an advanced clinical triage assistant.
Your goal is to evaluate user symptoms and provide a safe, structured clinical triage assessment.
Analyze the user's symptoms (region, name, severity 1-10, duration, and notes) along with their profile (age, sex, and conditions).

Provide your assessment STRICTLY in JSON format matching the schema provided.

Guidelines for Urgency Levels:
- EMERGENCY (Red): Chest pain, severe shortness of breath, sudden numbness/weakness, severe head injury, pain above 8/10. Emergency Contact: 911 or localized equivalent.
- SEE_DOCTOR_TODAY (Orange): Persistent fever, moderate abdominal pain, spreading rash, symptoms worsening over 3-7 days.
- MONITOR_AT_HOME (Yellow): Mild symptoms, seasonal allergies, common cold, minor strains, duration < 3 days.
- ROUTINE_CHECKUP (Green): Mild muscle tightness, chronic conditions under control, routine follow-ups.
`;

// OpenAPI-based JSON schema for structured Gemini output
const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    urgencyLevel: {
      type: SchemaType.STRING,
      enum: ['EMERGENCY', 'SEE_DOCTOR_TODAY', 'MONITOR_AT_HOME', 'ROUTINE_CHECKUP'],
      description: 'The urgency level of the symptoms based on clinical evaluation.',
    },
    urgencyColor: {
      type: SchemaType.STRING,
      enum: ['red', 'orange', 'yellow', 'green'],
      description: 'The color associated with the urgency level (red for EMERGENCY, orange for SEE_DOCTOR_TODAY, yellow for MONITOR_AT_HOME, green for ROUTINE_CHECKUP).',
    },
    conditions: {
      type: SchemaType.ARRAY,
      description: 'List of potential conditions that might match the user\'s symptoms. Maximum of 3.',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: {
            type: SchemaType.STRING,
            description: 'Name of the medical condition.',
          },
          confidence: {
            type: SchemaType.INTEGER,
            description: 'Confidence percentage (0-100) of this condition matching the symptoms.',
          },
          description: {
            type: SchemaType.STRING,
            description: 'Short explanation of this condition (2 sentences max).',
          },
          learnMoreUrl: {
            type: SchemaType.STRING,
            description: 'Medical reference link (e.g. Mayo Clinic or similar authoritative site).',
          },
          tags: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: 'Relevant tags (e.g. Respiratory, Common, Serious).',
          },
        },
        required: ['name', 'confidence', 'description'],
      },
    },
    recommendations: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: 'Clear, actionable next steps for the user.',
    },
    keySymptoms: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: 'List of key symptoms evaluated from user input.',
    },
    disclaimer: {
      type: SchemaType.STRING,
      description: 'Standard medical disclaimer stating this is not a clinical diagnosis.',
    },
    emergencyContact: {
      type: SchemaType.STRING,
      description: 'Emergency number (e.g. "911" or null).',
      nullable: true,
    },
  },
  required: [
    'urgencyLevel',
    'urgencyColor',
    'conditions',
    'recommendations',
    'keySymptoms',
    'disclaimer',
  ],
};

export async function analyzeSymptoms(
  symptoms: SymptomEntry[],
  generalNotes: string,
  profile?: UserProfile
): Promise<AnalysisResult> {
  const sessionId = 'session_' + Math.random().toString(36).substring(2, 11);

  if (!genAI) {
    console.warn(
      '⚠️  [MediTrack] GEMINI_API_KEY is not defined. Using dynamic mock AI results.'
    );
    return generateMockResponse(symptoms, generalNotes, sessionId);
  }

  try {
    const userPrompt = `
User Profile:
- Age: ${profile?.age || 'Not provided'}
- Sex: ${profile?.sex || 'Not provided'}
- Pre-existing Conditions: ${profile?.conditions?.join(', ') || 'None reported'}

Symptom Entries:
${symptoms
  .map(
    (s, i) =>
      `${i + 1}. Region: ${s.region}, Symptom: ${s.symptomName}, Severity: ${s.severity}/10, Duration: ${s.duration}, Details: ${s.freeText || 'None'}`
  )
  .join('\n')}

Additional User Notes:
${generalNotes || 'None'}
`;

    // Retrieve the Gemini Flash 2.0 model with system instructions pre-configured
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: MEDICAL_TRIAGE_SYSTEM_PROMPT,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const responseText = result.response.text();
    if (responseText) {
      const parsed = JSON.parse(responseText.trim());
      return {
        sessionId,
        ...parsed,
      };
    }
    throw new Error('Unexpected empty response from Gemini API');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback to mock response on error
    return generateMockResponse(symptoms, generalNotes, sessionId);
  }
}

// Generate a high-quality mock response based on user input
function generateMockResponse(
  symptoms: SymptomEntry[],
  generalNotes: string,
  sessionId: string
): AnalysisResult {
  const hasSevereSymptom = symptoms.some((s) => s.severity >= 8);
  const hasChestPain = symptoms.some(
    (s) => s.region === 'chest' && s.symptomId.includes('pain')
  );
  const hasShortnessOfBreath = symptoms.some(
    (s) => s.symptomId === 'shortness_of_breath'
  );

  let urgencyLevel: AnalysisResult['urgencyLevel'] = 'MONITOR_AT_HOME';
  let urgencyColor = 'yellow';
  let conditions: AnalysisResult['conditions'] = [];
  let recommendations: string[] = [];

  if (hasChestPain || hasShortnessOfBreath || hasSevereSymptom) {
    urgencyLevel = 'EMERGENCY';
    urgencyColor = 'red';
    conditions = [
      {
        name: 'Angina / Potential Cardiac Event',
        confidence: 75,
        description:
          'A condition marked by severe chest pain, caused by an inadequate blood supply to the heart. This requires immediate medical screening.',
        learnMoreUrl: 'https://www.mayoclinic.org/diseases-conditions/angina',
        tags: ['Cardiac', 'Urgent'],
      },
      {
        name: 'Acute Respiratory Distress',
        confidence: 60,
        description:
          'Difficulty breathing can stem from multiple conditions including severe asthma flares or viral/bacterial lung infections.',
        learnMoreUrl:
          'https://www.mayoclinic.org/diseases-conditions/respiratory-distress',
        tags: ['Respiratory', 'Critical'],
      },
    ];
    recommendations = [
      'Call emergency services immediately (911).',
      'Rest in a sitting position; do not exert yourself.',
      'If you have prescribed emergency medicine (like an inhaler or nitroglycerin), use it.',
      'Have someone stay with you until help arrives.',
    ];
  } else if (
    symptoms.some((s) => s.region === 'head' && s.symptomId === 'headache')
  ) {
    const isProlonged = symptoms.some(
      (s) => s.duration.includes('weeks') || s.duration.includes('days')
    );
    urgencyLevel = isProlonged ? 'SEE_DOCTOR_TODAY' : 'MONITOR_AT_HOME';
    urgencyColor = isProlonged ? 'orange' : 'yellow';

    conditions = [
      {
        name: 'Tension Headache',
        confidence: 80,
        description:
          'A mild, dull ache that feels like a tight band around the head, usually triggered by stress, muscle strain, or dehydration.',
        learnMoreUrl: 'https://www.mayoclinic.org/diseases-conditions/tension-headache',
        tags: ['Neurological', 'Common'],
      },
      {
        name: 'Dehydration Head Pain',
        confidence: 70,
        description:
          'Headache caused by temporary fluid deficit in body tissues, which leads to blood vessels narrowing.',
        learnMoreUrl: 'https://www.healthline.com/health/dehydration-headache',
        tags: ['Hydration', 'Self-Care'],
      },
    ];
    recommendations = [
      'Drink 16-24 oz of water or electrolytes.',
      'Rest in a dark, quiet room.',
      'Apply a cool compress to your forehead or neck.',
      isProlonged
        ? 'Since pain is prolonged, consult a doctor to rule out migraines.'
        : 'Over-the-counter pain relief can help if taken as directed.',
    ];
  } else {
    // Default cold / flu / general discomfort
    urgencyLevel = 'ROUTINE_CHECKUP';
    urgencyColor = 'green';
    conditions = [
      {
        name: 'Viral Infection / Common Cold',
        confidence: 85,
        description:
          'A minor viral infection of the nose and throat. Symptoms usually peak within 3 days and resolve in 7-10 days.',
        learnMoreUrl: 'https://www.mayoclinic.org/diseases-conditions/common-cold',
        tags: ['Viral', 'Seasonal'],
      },
    ];
    recommendations = [
      'Ensure plenty of bed rest and sleep.',
      'Increase fluid intake (broth, tea, water).',
      'Use saline nasal sprays or throat lozenges if experiencing congestion or throat irritation.',
      'Schedule a routine checkup if symptoms do not improve after 7 days.',
    ];
  }

  return {
    sessionId,
    urgencyLevel,
    urgencyColor,
    conditions,
    recommendations,
    keySymptoms: symptoms.map((s) => s.symptomName),
    disclaimer:
      'This assessment is a mock report generated locally for testing and demonstration. It is for informational purposes only and does not constitute a medical diagnosis. Always consult a qualified healthcare professional.',
    emergencyContact: urgencyLevel === 'EMERGENCY' ? '911' : null,
  };
}
