// ============================================================
// MediTrack Symptom Definitions
// ============================================================

export interface SymptomOption {
  id: string;
  name: string;
  description?: string;
}

export const bodyRegionSymptoms: Record<string, SymptomOption[]> = {
  head: [
    { id: 'headache', name: 'Headache', description: 'Pain or pressure in the head' },
    { id: 'dizziness', name: 'Dizziness', description: 'Feeling lightheaded or unsteady' },
    { id: 'blurred_vision', name: 'Blurred Vision' },
    { id: 'ear_pain', name: 'Ear Pain' },
    { id: 'sore_throat', name: 'Sore Throat' },
    { id: 'runny_nose', name: 'Runny Nose' },
    { id: 'sinus_pressure', name: 'Sinus Pressure' },
  ],
  neck: [
    { id: 'neck_pain', name: 'Neck Pain' },
    { id: 'stiffness', name: 'Stiffness' },
    { id: 'swollen_lymph', name: 'Swollen Lymph Nodes' },
    { id: 'difficulty_swallowing', name: 'Difficulty Swallowing' },
  ],
  chest: [
    { id: 'chest_pain', name: 'Chest Pain', description: 'Pain, tightness or pressure in chest' },
    { id: 'palpitations', name: 'Palpitations', description: 'Racing or pounding heartbeat' },
    { id: 'shortness_of_breath', name: 'Shortness of Breath' },
    { id: 'cough', name: 'Cough' },
    { id: 'wheezing', name: 'Wheezing' },
  ],
  abdomen: [
    { id: 'stomach_pain', name: 'Stomach Pain' },
    { id: 'nausea', name: 'Nausea' },
    { id: 'vomiting', name: 'Vomiting' },
    { id: 'bloating', name: 'Bloating' },
    { id: 'diarrhea', name: 'Diarrhea' },
    { id: 'constipation', name: 'Constipation' },
    { id: 'heartburn', name: 'Heartburn' },
  ],
  left_arm: [
    { id: 'arm_pain_left', name: 'Arm Pain' },
    { id: 'numbness_left', name: 'Numbness or Tingling' },
    { id: 'weakness_left', name: 'Weakness' },
    { id: 'swelling_left', name: 'Swelling' },
  ],
  right_arm: [
    { id: 'arm_pain_right', name: 'Arm Pain' },
    { id: 'numbness_right', name: 'Numbness or Tingling' },
    { id: 'weakness_right', name: 'Weakness' },
    { id: 'swelling_right', name: 'Swelling' },
  ],
  left_leg: [
    { id: 'leg_pain_left', name: 'Leg Pain' },
    { id: 'numbness_leg_left', name: 'Numbness or Tingling' },
    { id: 'swelling_leg_left', name: 'Swelling' },
    { id: 'joint_pain_left', name: 'Joint Pain' },
    { id: 'cramps_left', name: 'Muscle Cramps' },
  ],
  right_leg: [
    { id: 'leg_pain_right', name: 'Leg Pain' },
    { id: 'numbness_leg_right', name: 'Numbness or Tingling' },
    { id: 'swelling_leg_right', name: 'Swelling' },
    { id: 'joint_pain_right', name: 'Joint Pain' },
    { id: 'cramps_right', name: 'Muscle Cramps' },
  ],
  upper_back: [
    { id: 'upper_back_pain', name: 'Upper Back Pain' },
    { id: 'shoulder_pain', name: 'Shoulder Pain' },
    { id: 'muscle_tension', name: 'Muscle Tension' },
  ],
  lower_back: [
    { id: 'lower_back_pain', name: 'Lower Back Pain' },
    { id: 'sciatica', name: 'Sciatica / Radiating Pain' },
    { id: 'hip_pain', name: 'Hip Pain' },
    { id: 'stiffness_back', name: 'Stiffness' },
  ],
};

export const durationOptions = [
  { value: 'just_started', label: 'Just started' },
  { value: 'hours', label: 'A few hours' },
  { value: '1_3_days', label: '1-3 days' },
  { value: '4_7_days', label: '4-7 days' },
  { value: '1_2_weeks', label: '1-2 weeks' },
  { value: 'more_2_weeks', label: 'More than 2 weeks' },
] as const;

export const preExistingConditions = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Heart Disease',
  'Allergies',
  'Thyroid Disorder',
  'Arthritis',
  'Other',
] as const;
