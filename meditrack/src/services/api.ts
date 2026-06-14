import type { SymptomEntry, AnalysisResult, UserProfile } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export async function analyzeSymptomsApi(
  symptoms: SymptomEntry[],
  freeText: string,
  profile?: UserProfile
): Promise<AnalysisResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms,
        generalNotes: freeText,
        profile,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Server responded with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API Error during symptom analysis:', error);
    throw error;
  }
}
