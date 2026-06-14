import { useEffect, useRef } from 'react';
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
  const hasCalled = useRef(false);

  useEffect(() => {
    // Avoid double-calling in StrictMode
    if (hasCalled.current) return;
    hasCalled.current = true;

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

        // Call the backend API (passing the user profile for accurate clinical context)
        const result = await analyzeSymptomsApi(symptoms, freeText, profile);

        // Auto-save the assessment to the history database
        const userEmail = isGuest ? 'guest' : user?.email || 'unknown';
        await saveSession(userEmail, result, symptoms);

        setResult(result);
        addToHistory(result);
        navigate('/results');
      } catch (error: any) {
        console.error('Analysis failed:', error);
        setError(error.message || 'Failed to analyze symptoms.');
        navigate('/results');
      }
    }

    // Add a slight minimum delay so user gets the nice loading experience
    const delayTimer = setTimeout(() => {
      performAnalysis();
    }, 2500);

    return () => clearTimeout(delayTimer);
  }, [symptoms, freeText, setResult, addToHistory, setError, navigate]);

  return <LoadingAnalysis />;
}
