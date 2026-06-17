# MediTrack — Implementation Plan

**Version:** 1.0 | **Date:** June 2026

---

## 1. Build Strategy

MediTrack is built in 6 phases over an estimated 14-week solo developer timeline. Each phase ends with a working, testable deliverable. The AI coding agent should implement phases in order — later phases depend on earlier ones.

> **Golden Rule:** Build the thinnest possible vertical slice first. By end of Phase 1, a user should be able to enter symptoms and see an AI response — even if it looks ugly. Polish comes after core logic works.

---

## 2. Phase Breakdown

### Phase 1 — Foundation & Core AI (Weeks 1-2)

**Goal:** App boots, user enters symptoms, AI responds. Nothing is stored.

| Task | Details | Acceptance Criteria |
|---|---|---|
| P1-01: Project Setup | `npx create-expo-app meditrack --template blank-typescript`. Install dependencies: zustand, react-navigation, axios, expo-sqlite, expo-location, expo-secure-store | App runs on Expo Go without errors |
| P1-02: Navigation Shell | Set up Root Stack + Bottom Tab Navigator. Placeholder screens for all 3 tabs. | Tapping tabs switches screens |
| P1-03: Body Map Screen | Build SVG body map component with tap regions. State: selectedRegions[] | Tapping a region highlights it; multiple selections work |
| P1-04: Symptom Detail Screen | Paginated card UI per symptom. Severity slider, duration picker, free text. | Can complete all symptoms and reach "Analyze" button |
| P1-05: Backend Setup | Node.js + Express + TypeScript. Single route: POST /api/analyze. Connect Google Gemini API. | curl to /api/analyze returns structured JSON |
| P1-06: AI Integration | Implement system prompt, call Gemini API, parse JSON response, return to client. | End-to-end: symptoms in → AI response out |
| P1-07: Results Screen | Build results screen with hardcoded data first, then wire to API response. | Urgency banner, condition cards, recommendations render correctly |

### Phase 2 — Auth, Storage & History (Weeks 3-4)

**Goal:** Users can register, log in, and view past sessions.

| Task | Details | Acceptance Criteria |
|---|---|---|
| P2-01: Supabase Setup | Create project, run migrations for all 5 tables, enable RLS policies. | Tables exist with correct columns; RLS active |
| P2-02: Auth Screens | Login, Register, ForgotPassword screens. Connect to Supabase Auth. | User can register + login + token stored securely |
| P2-03: Auth Gate | Splash screen reads token. Routes to auth or app accordingly. | Returning user goes straight to Home Tab |
| P2-04: Session Saving | After AI response, save session to Supabase + local SQLite. | Session appears in History tab after analysis |
| P2-05: History Screen | List of past sessions. Tap to view. Long press to delete. | History shows past sessions; delete works |
| P2-06: Profile Screen | Pre-existing conditions toggles. Age/sex fields. Save to Supabase profiles. | Profile data persists across app restarts |
| P2-07: Profile → AI | Pass user profile in AI analyze request for better accuracy. | API receives and uses profile data in prompt |

### Phase 3 — Maps & Doctor Finder (Weeks 5-6)

**Goal:** After results, user can find nearby doctors on a map.

| Task | Details | Acceptance Criteria |
|---|---|---|
| P3-01: Location Permission | Request location with expo-location. Handle denied case (manual entry). | Location granted/denied handled gracefully |
| P3-02: Overpass API Query | Build query to find clinics/hospitals near coordinates. Filter by specialty tag. | Returns list of real POIs from OSM |
| P3-03: Map Screen | react-native-maps with OSM tiles. Plot doctor pins. Bottom sheet list. | Map shows real nearby clinics |
| P3-04: Doctor Cards | Name, specialty, distance, phone, hours. "Get Directions" deep link. | Directions open in device maps app |
| P3-05: Filter by Specialty | Map AI urgency → relevant specialty (e.g., 'chest' → 'Cardiologist'). Filter OSM results. | Relevant specialty shown by default; user can override |

### Phase 4 — Offline Mode & Polish (Weeks 7-9)

**Goal:** App works offline with reasonable quality; UI is polished and production-ready.

| Task | Details | Acceptance Criteria |
|---|---|---|
| P4-01: Offline Detection | NetInfo hook detects network state. Show banner when offline. | Banner appears when airplane mode enabled |
| P4-02: Local Decision Tree | Build offline_triage.json and JavaScript evaluator for urgency-only offline mode. | Offline urgency guidance works without network |
| P4-03: Offline Sync | On reconnect, sync unsynced SQLite sessions to Supabase. | Sessions created offline appear in server History after reconnect |
| P4-04: PDF Export | react-native-html-to-pdf. Generate report from session data. Share via device share sheet. | PDF is generated and shareable |
| P4-05: Emergency Modal | Full-screen red modal with local emergency number when urgency = EMERGENCY. | Emergency modal appears before results for critical cases |
| P4-06: UI Polish | Implement full color system, typography scale, card shadows, animations per design brief. | App matches design brief visually |
| P4-07: Accessibility | Test with VoiceOver + TalkBack. Add accessibilityLabel to all interactive elements. | Core flow navigable via screen reader |

### Phase 5 — Testing, Security & Hardening (Weeks 10-11)

**Goal:** Ensure the application is secure against prompt injection, rate-limited against abuse, covered by unit/integration tests, and fully compliant with privacy and clinical disclaimer requirements.

| Task | Details | Acceptance Criteria |
|---|---|---|
| P5-01: Rate Limiting | Add `express-rate-limit` to Express backend. Configure per-IP/user limits for `/api/analyze` (e.g. 10 requests/hour) and `/api/doctors` (e.g. 30 requests/hour). | 11th analyze request in 1 hour returns HTTP 429 |
| P5-02: Input Sanitization | Sanitize frontend symptoms and free-text inputs prior to backend transmission. Filter out prompt injection keywords (e.g., "ignore previous instructions") to maintain safety boundaries. | Prompts containing bypass attempts are blocked/cleaned; AI logic holds |
| P5-03: Unit & Integration Tests | Set up a test suite using Vitest/Jest. Write tests for state stores, API timeout fallbacks, leaflet coordinate parsers, and backend Gemini response cleaning. | Tests pass cleanly with no warning outputs |
| P5-04: Security & RLS Audit | Perform audit of Supabase Row Level Security (RLS) policies on `profiles`, `sessions`, `symptoms`, and `conditions` tables to prevent unauthorized access. | Users can only access/write their own records; guest records stay local |
| P5-05: Clinical Disclaimer Review | Legal-clinical verification of triage disclaimers. Ensure all recommendations emphasize "non-diagnostic information only" and make dial buttons clear. | Disclaimer banner and Emergency Modal visible and readable in all triage states |

### Phase 6 — Production Deployment, CI/CD & PWA (Weeks 12-14)

**Goal:** Deploy frontend/backend services, set up CI/CD pipelines, package as a Progressive Web App (PWA) for home screen installation, and establish monitoring.

| Task | Details | Acceptance Criteria |
|---|---|---|
| P6-01: Backend Production Deploy | Deploy Express API to Railway or Render. Configure environment variables (e.g. `GEMINI_API_KEY`, `PORT`) and enforce SSL. | GET `/health` and POST `/api/analyze` respond over secure HTTPS |
| P6-02: Frontend Vercel Deploy | Deploy React SPA to Vercel. Set `VITE_API_URL` pointing to production API and wire Supabase client variables. | Frontend loads and completes end-to-end symptom triage on live Vercel URL |
| P6-03: Progressive Web App (PWA) | Add manifest.json, custom icons, and register service workers. Configure caching of core static assets for offline startup. | App is installable on iOS/Android home screen; launches with standalone UI shell |
| P6-04: CI/CD Automation | Set up GitHub Actions workflow to run lint, type-check (`tsc`), and unit tests automatically on every pull request. | Failed tests or compile warnings block pull request merges |
| P6-05: Analytics & Monitoring | Add privacy-focused telemetry (e.g. Sentry/loggers) to capture client-side runtime errors and API timeouts without tracking PII. | Frontend/backend errors log to monitoring dashboard for quick troubleshooting |


---

## 3. File Structure

```
meditrack/
├── app/                     # React Native screens
│   ├── (tabs)/
│   │   ├── index.tsx        # Home (body map entry point)
│   │   ├── history.tsx
│   │   └── profile.tsx
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── results.tsx
│   └── doctors.tsx
├── components/
│   ├── BodyMap.tsx
│   ├── SymptomCard.tsx
│   ├── UrgencyBanner.tsx
│   ├── ConditionCard.tsx
│   ├── DoctorCard.tsx
│   └── SeveritySlider.tsx
├── stores/
│   ├── symptomStore.ts      # Zustand store
│   └── sessionStore.ts
├── services/
│   ├── api.ts               # Backend API calls
│   ├── supabase.ts          # Supabase client
│   ├── offlineTriage.ts     # Local decision tree
│   └── locationService.ts
├── assets/
│   └── body_map.svg
├── constants/
│   ├── symptoms.ts          # Symptom lists per region
│   └── colors.ts
└── backend/
    ├── src/
    │   ├── routes/
    │   │   ├── analyze.ts
    │   │   ├── doctors.ts
    │   │   └── sessions.ts
    │   ├── services/
    │   │   ├── gemini.ts
    │   │   └── overpass.ts
    │   └── middleware/
    │       ├── auth.ts
    │       └── rateLimit.ts
    └── supabase/
        └── migrations/      # SQL migration files
```

---

## 4. Dependency List

| Package | Purpose |
|---|---|
| expo ~51 | React Native framework + managed workflow |
| react-navigation/native + stack + bottom-tabs | App navigation |
| zustand | State management |
| @supabase/supabase-js | Auth + DB + storage client |
| expo-location | Device GPS |
| expo-sqlite | Local offline database |
| expo-secure-store | Secure token storage |
| react-native-maps | Map rendering |
| react-native-html-to-pdf | PDF generation |
| @react-native-community/netinfo | Network status detection |
| axios | HTTP client (backend calls) |
| express + cors + helmet | Backend framework + security |
| express-rate-limit | Backend rate limiting |
| @google/generative-ai | Google Gemini API client |
| typescript | Type safety across all files |
| jest + @testing-library/react-native | Unit + component testing |
