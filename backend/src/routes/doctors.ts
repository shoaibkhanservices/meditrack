import { Router, Request, Response } from 'express';
import { fetchNearbyClinics } from '../services/overpass';

const router = Router();

interface DoctorsRequestQuery {
  lat?: string;
  lng?: string;
  specialty?: string;
  radius?: string;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const { lat, lng, specialty, radius } = req.query as DoctorsRequestQuery;

    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing coordinates. "lat" and "lng" query parameters are required.',
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusMeters = radius ? parseInt(radius) : 5000;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates. "lat" and "lng" must be numeric values.',
      });
    }

    console.log(`[Doctors] Fetching clinics around lat=${latitude}, lng=${longitude}, specialty=${specialty || 'any'}`);
    const clinics = await fetchNearbyClinics(latitude, longitude, specialty, radiusMeters);

    return res.json({
      doctors: clinics,
    });
  } catch (error) {
    console.error('Error handling doctors request:', error);
    return res.status(500).json({
      error: 'An internal error occurred during clinic lookup.',
    });
  }
});

export default router;
