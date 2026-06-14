// ============================================================
// MediTrack Shared Types
// ============================================================

export type UrgencyLevel =
  | 'EMERGENCY'
  | 'SEE_DOCTOR_TODAY'
  | 'MONITOR_AT_HOME'
  | 'ROUTINE_CHECKUP';

export interface SymptomEntry {
  region: string;
  symptomId: string;
  symptomName: string;
  severity: number;
  duration: string;
  freeText?: string;
}

export interface Condition {
  name: string;
  confidence: number;
  description: string;
  learnMoreUrl?: string;
  tags?: string[];
}

export interface AnalysisResult {
  sessionId: string;
  urgencyLevel: UrgencyLevel;
  urgencyColor: string;
  conditions: Condition[];
  recommendations: string[];
  keySymptoms: string[];
  disclaimer: string;
  emergencyContact?: string | null;
}

export interface UserProfile {
  age?: number;
  sex?: 'male' | 'female' | 'prefer_not_to_say';
  conditions?: string[];
}
