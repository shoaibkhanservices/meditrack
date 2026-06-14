// ============================================================
// MediTrack Symptom Store (Zustand)
// ============================================================

import { create } from 'zustand';
import type { SymptomEntry } from '../types';

interface SymptomState {
  selectedRegions: string[];
  symptoms: SymptomEntry[];
  freeText: string;

  toggleRegion: (region: string) => void;
  addSymptom: (symptom: SymptomEntry) => void;
  removeSymptom: (symptomId: string) => void;
  updateSymptom: (symptomId: string, updates: Partial<SymptomEntry>) => void;
  setFreeText: (text: string) => void;
  reset: () => void;
  getSymptomsByRegion: (region: string) => SymptomEntry[];
}

export const useSymptomStore = create<SymptomState>((set, get) => ({
  selectedRegions: [],
  symptoms: [],
  freeText: '',

  toggleRegion: (region) =>
    set((state) => ({
      selectedRegions: state.selectedRegions.includes(region)
        ? state.selectedRegions.filter((r) => r !== region)
        : [...state.selectedRegions, region],
    })),

  addSymptom: (symptom) =>
    set((state) => ({
      symptoms: [...state.symptoms, symptom],
    })),

  removeSymptom: (symptomId) =>
    set((state) => ({
      symptoms: state.symptoms.filter((s) => s.symptomId !== symptomId),
    })),

  updateSymptom: (symptomId, updates) =>
    set((state) => ({
      symptoms: state.symptoms.map((s) =>
        s.symptomId === symptomId ? { ...s, ...updates } : s
      ),
    })),

  setFreeText: (text) => set({ freeText: text }),

  reset: () => set({ selectedRegions: [], symptoms: [], freeText: '' }),

  getSymptomsByRegion: (region) =>
    get().symptoms.filter((s) => s.region === region),
}));
