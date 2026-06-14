import { Router, Request, Response } from 'express';
import { analyzeSymptoms, SymptomEntry, UserProfile } from '../services/gemini';

const router = Router();

interface AnalyzeRequestBody {
  symptoms: SymptomEntry[];
  generalNotes?: string;
  profile?: UserProfile;
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { symptoms, generalNotes = '', profile } = req.body as AnalyzeRequestBody;

    // Validation
    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({
        error: 'Invalid request body. "symptoms" must be a valid array.',
      });
    }

    if (symptoms.length === 0) {
      return res.status(400).json({
        error: 'No symptoms provided. At least one symptom is required for analysis.',
      });
    }

    // Call service to perform analysis
    console.log(`[Analyze] Evaluating ${symptoms.length} symptoms...`);
    const result = await analyzeSymptoms(symptoms, generalNotes, profile);

    return res.json(result);
  } catch (error) {
    console.error('Error handling analyze request:', error);
    return res.status(500).json({
      error: 'An internal error occurred during symptom analysis.',
    });
  }
});

export default router;
