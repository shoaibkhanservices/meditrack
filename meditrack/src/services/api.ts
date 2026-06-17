import type { SymptomEntry, AnalysisResult, UserProfile } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 6000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function analyzeSymptomsApi(
  symptoms: SymptomEntry[],
  freeText: string,
  profile?: UserProfile
): Promise<AnalysisResult> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms,
        generalNotes: freeText,
        profile,
      }),
    }, 6000);

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

export interface ClinicInfo {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phone: string | null;
  address: string;
  hours: string;
  distanceKm: number;
  specialty: string;
}

export async function getDoctorsApi(
  lat: number,
  lng: number,
  specialty?: string,
  radius?: number
): Promise<ClinicInfo[]> {
  try {
    const url = new URL(`${API_BASE_URL}/doctors`);
    url.searchParams.append('lat', lat.toString());
    url.searchParams.append('lng', lng.toString());
    if (specialty) url.searchParams.append('specialty', specialty);
    if (radius) url.searchParams.append('radius', radius.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Server responded with status ${response.status}`
      );
    }

    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error('API Error during doctor lookup:', error);
    throw error;
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function chatWithAssistantApi(messages: ChatMessage[]): Promise<ChatMessage> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    }, 10000);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Server responded with status ${response.status}`
      );
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('API Error during chat with assistant:', error);
    throw error;
  }
}
