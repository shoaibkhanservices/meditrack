import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingAnalysis from '../../components/LoadingAnalysis/LoadingAnalysis';
import { useSessionStore } from '../../stores/sessionStore';
import { useSymptomStore } from '../../stores/symptomStore';
import { useAuthStore } from '../../stores/authStore';
import { analyzeSymptomsApi } from '../../services/api';
import { saveSession } from '../../services/supabaseService';

export default function Analyzing() {
  const navigate = useNavigate();
  const setResult = useSessionStore((state) => state.setResult);
  const addToHistory = useSessionStore((state) => state.addToHistory);
  const setError = useSessionStore((state) => state.setError);
  const symptoms = useSymptomStore((state) => state.symptoms);
  const freeText = useSymptomStore((state) => state.freeText);

  useEffect(() => {
    let active = true;

    // Helper to race a promise against a timeout
    function promiseWithTimeout<T>(promise: Promise<T>, ms: number, timeoutError: Error): Promise<T> {
      let timeoutId: any;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(timeoutError);
        }, ms);
      });
      return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
    }

    async function performAnalysis() {
      try {
        console.log('Sending symptom entries to backend for analysis...');
        
        // Retrieve current active user profile information
        const { user, isGuest } = useAuthStore.getState();
        const profile = isGuest
          ? undefined
          : {
              age: user?.age,
              sex: user?.sex,
              conditions: user?.conditions,
            };

        let result;
        try {
          console.log('Attempting backend API analysis...');
          result = await analyzeSymptomsApi(symptoms, freeText, profile);
        } catch (apiError) {
          if (!active) return;
          console.warn('Backend API connection failed. Falling back to local frontend Mock AI:', apiError);
          const { generateMockTriage } = await import('../../services/mockAi');
          result = generateMockTriage(symptoms, freeText);
        }

        if (!active) return;

        // Save session (try Supabase first with a timeout fallback, then try local mock fallback)
        try {
          const userEmail = isGuest ? 'guest' : user?.email || 'unknown';
          console.log('Saving session to database...');
          await promiseWithTimeout(
            saveSession(userEmail, result, symptoms),
            4000,
            new Error('Database save operation timed out')
          );
        } catch (saveError) {
          if (active) {
            console.warn('Failed to save session to Supabase database. Saving locally in mock localStorage:', saveError);
            try {
              const { saveSessionMock } = await import('../../services/supabaseMock');
              const userEmail = isGuest ? 'guest' : user?.email || 'unknown';
              await saveSessionMock(userEmail, result);
            } catch (mockSaveErr) {
              console.error('Failed to save mock session:', mockSaveErr);
            }
          }
        }

        if (!active) return;
        setResult(result);
        addToHistory(result);
        navigate('/results');
      } catch (error: any) {
        if (!active) return;
        console.error('Analysis critical error:', error);
        setError(error.message || 'Failed to complete triage analysis.');
        navigate('/results');
      }
    }

    // Add a slight minimum delay so user gets the nice loading experience
    const delayTimer = setTimeout(() => {
      performAnalysis();
    }, 2500);

    return () => {
      active = false;
      clearTimeout(delayTimer);
    };
  }, [symptoms, freeText, setResult, addToHistory, setError, navigate]);

  return <LoadingAnalysis />;
}
