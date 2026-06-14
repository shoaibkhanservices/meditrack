# MediTrack — Technical Requirements Document

**Version:** 1.0 | **Date:** June 2026

---

## 1. Technology Stack

| Layer | Technology | Justification |
|---|---|---|
| Mobile Frontend | React Native (Expo SDK 51+) | Cross-platform iOS/Android from one codebase; large ecosystem; good Expo Go DX |
| State Management | Zustand | Lightweight, no boilerplate; ideal for symptom/session state |
| Navigation | React Navigation v6 (Stack + Tab) | Industry standard for RN; well-documented |
| Maps | react-native-maps + OpenStreetMap tiles | Free, no API billing surprises; OSM is sufficient for POI lookups |
| Geocoding / POI | Nominatim API + Overpass API | Both free and open-source; no key required |
| AI Integration | Google Gemini API (gemini-2.0-flash) | State-of-art medical reasoning; responseSchema JSON output |
| Backend API | Node.js + Express (TypeScript) | Familiar to most JS devs; fast prototyping; easy deploy |
| Database | PostgreSQL (via Supabase) | Relational, row-level security, built-in auth, free tier |
| Auth | Supabase Auth (JWT) | OAuth ready, handles refresh tokens, integrates with DB |
| File Storage | Supabase Storage | PDF report storage; free tier generous |
| Offline DB | SQLite via expo-sqlite | Native performance; works fully offline |
| PDF Generation | react-native-html-to-pdf | Converts HTML report template to shareable PDF |
| CI/CD | GitHub Actions | Free for public repos; automate lint/test/build |

---

## 2. System Architecture

### 2.1 High-Level Architecture

> **Architecture Pattern:** Client-Server with Offline-First sync. The mobile client handles UI and caches data locally in SQLite. The Node.js API handles AI calls and doctor lookups. Supabase manages auth and persistent storage.

Component interaction flow:

1. User inputs symptoms on mobile client
2. Client validates and assembles a SymptomPayload object
3. Client sends POST /api/analyze to Node.js backend
4. Backend sanitizes payload, constructs prompt, calls Google Gemini API
5. Backend parses structured JSON response, stores session, returns to client
6. Client renders results; user taps Find Doctor
7. Client fetches location, calls Overpass API directly (no backend needed)
8. Map renders with doctor pins

### 2.2 API Contracts

#### POST /api/analyze

**Request Body (JSON)**
```json
{
  "symptoms": [{ "region": "chest", "symptom": "pain", "severity": 8, "duration": "2 days" }],
  "freeText": "Sharp pain when breathing",
  "userProfile": { "age": 34, "sex": "male", "conditions": ["hypertension"] }
}
```

**Response Body (JSON)**
```json
{
  "sessionId": "uuid",
  "urgencyLevel": "SEE_DOCTOR_TODAY",
  "urgencyColor": "orange",
  "conditions": [
    { "name": "Pleuritis", "confidence": 72, "description": "...", "learnMoreUrl": "..." }
  ],
  "recommendations": ["Rest and monitor breathing", "Avoid strenuous activity"],
  "keySymptoms": ["chest pain on inspiration"],
  "disclaimer": "This is not a medical diagnosis...",
  "emergencyContact": null
}
```

#### GET /api/doctors

**Query Parameters**
`lat={float}&lng={float}&specialty={string}&radius={meters, default 5000}`

**Response Body**
```json
{
  "doctors": [
    { "id": "osm:123", "name": "City Health Clinic", "specialty": "General Practice",
      "address": "12 Main St", "lat": 24.8, "lng": 67.0,
      "phone": "+92-21-5551234", "distanceKm": 1.2, "hours": "Mon-Fri 9am-5pm" }
  ]
}
```

### 2.3 Google Gemini API Integration

#### System Prompt Design

The AI is called with a carefully structured system prompt that enforces JSON output and medical safety guardrails:

```
You are a medical triage assistant. Analyze the symptoms and return ONLY valid JSON.

Rules:
1. Never diagnose definitively. Use probabilistic language.
2. If ANY of: chest pain, difficulty breathing, stroke symptoms, severe bleeding — set urgencyLevel to EMERGENCY.
3. Output must strictly follow this JSON schema: { urgencyLevel, conditions[], recommendations[], keySymptoms[], disclaimer }
4. conditions[] max 3 items, confidence must sum to <= 100.
5. All text must be readable by a non-medical adult.
```

### 2.4 Offline Fallback Engine

When offline, the app uses a local JavaScript decision tree stored as a JSON file bundled with the app. The tree maps symptom combinations to urgency levels only (no condition guessing offline, to avoid wrong conclusions without AI validation).

**Offline Logic Example**
```
IF chest pain AND severity >= 7 => EMERGENCY
IF fever AND duration > 3 days => SEE_DOCTOR_TODAY
IF headache AND severity <= 5 => MONITOR_AT_HOME
```

---

## 3. Data Flow & Security

### 3.1 Data Classification

| Data Type | Storage Location | Encryption |
|---|---|---|
| Symptom session (current) | Device memory (Zustand) | N/A (in-memory only) |
| Session history | SQLite (local) + Supabase (sync) | AES-256 at rest, TLS in transit |
| User profile | Supabase (auth.users + profiles table) | TLS + Supabase RLS |
| Generated PDF reports | Supabase Storage | Bucket-level encryption |
| API keys (Gemini) | Backend env vars only — NEVER in client bundle | Server env |

### 3.2 Authentication Flow

1. User registers — Supabase creates auth.users record, issues JWT + refresh token
2. Client stores tokens in expo-secure-store (hardware-backed on device)
3. Each API request includes `Authorization: Bearer {accessToken}`
4. Backend verifies JWT with Supabase public key — no extra DB call needed
5. Access token expires in 1 hour; silent refresh via refresh token
6. Guest mode: no auth — sessions stored locally only, not synced

### 3.3 Rate Limiting

- POST /api/analyze: 10 requests per user per hour (prevents abuse of AI API)
- GET /api/doctors: 30 requests per user per hour
- Unauthenticated requests: 3 analyze calls per IP per day

---

## 4. Environment & Config

| Variable | Description |
|---|---|
| GEMINI_API_KEY | Gemini API key — backend only |
| SUPABASE_URL | Supabase project URL |
| SUPABASE_ANON_KEY | Public Supabase key (safe in client) |
| SUPABASE_SERVICE_KEY | Backend-only admin key |
| NOMINATIM_BASE_URL | e.g., https://nominatim.openstreetmap.org |
| OVERPASS_BASE_URL | e.g., https://overpass-api.de/api/interpreter |
| JWT_SECRET | Backend signing secret (if custom JWT layer) |
| NODE_ENV | development / production |
