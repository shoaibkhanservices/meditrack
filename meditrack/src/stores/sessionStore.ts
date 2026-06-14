// ============================================================
// MediTrack Session Store (Zustand)
// ============================================================

import { create } from 'zustand';
import type { AnalysisResult } from '../types';

interface SessionState {
  currentResult: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  history: AnalysisResult[];

  setResult: (result: AnalysisResult) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (result: AnalysisResult) => void;
  clearHistory: () => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentResult: null,
  isAnalyzing: false,
  error: null,
  history: [],

  setResult: (result) =>
    set({ currentResult: result, isAnalyzing: false, error: null }),

  setAnalyzing: (isAnalyzing) =>
    set({ isAnalyzing, error: null }),

  setError: (error) =>
    set({ error, isAnalyzing: false }),

  addToHistory: (result) =>
    set((state) => ({ history: [result, ...state.history] })),

  clearHistory: () =>
    set({ history: [] }),

  reset: () =>
    set({ currentResult: null, isAnalyzing: false, error: null }),
}));
