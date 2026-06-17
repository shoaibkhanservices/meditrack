import type { SymptomEntry, AnalysisResult } from '../types';

export function generateMockTriage(
  symptoms: SymptomEntry[],
  generalNotes: string
): AnalysisResult {
  const sessionId = 'session_' + Math.random().toString(36).substring(2, 11);
  const hasSevereSymptom = symptoms.some((s) => s.severity >= 8);
  
  if (generalNotes) {
    console.log('[Mock AI] Evaluating triage with user notes:', generalNotes);
  }
  
  const hasChestPain = symptoms.some(
    (s) => s.region === 'chest' && (s.symptomId.includes('pain') || s.symptomId.includes('palpitations'))
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
      (s) => s.duration.includes('weeks') || s.duration.includes('days') || s.duration.includes('4_7')
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
      'This assessment is a mock report generated client-side as a connection fallback. It is for informational purposes only and does not constitute a medical diagnosis. Always consult a qualified healthcare professional.',
    emergencyContact: urgencyLevel === 'EMERGENCY' ? '911' : null,
  };
}
