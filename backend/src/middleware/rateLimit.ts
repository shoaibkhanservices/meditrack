import rateLimit from 'express-rate-limit';

// Rate limiter for symptom analysis and chatbot queries (protects Gemini API quota)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests. Please try again after 15 minutes.',
  },
});

// Rate limiter for clinic/doctor finder (queries OSM Overpass API)
export const doctorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many doctor lookups. Please try again after 15 minutes.',
  },
});
