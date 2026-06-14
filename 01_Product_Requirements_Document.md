# MediTrack — Product Requirements Document

**Version:** 1.0 | **Date:** June 2026

---

## 1. Product Overview

MediTrack is a mobile-first health assistant application that helps users identify potential medical conditions based on self-reported symptoms. It uses AI to provide structured, non-diagnostic insights, urgency guidance, and nearby physician recommendations. It is designed for everyday users who need quick triage help before deciding whether to seek professional care.

> **Core Value Proposition:** "I feel sick — what should I do next?" MediTrack answers this question reliably, safely, and accessibly for users who cannot immediately reach a doctor.

### 1.1 Problem Statement

When people feel unwell, they face three friction points:

- Uncertainty about severity — is this serious enough to see a doctor?
- Poor symptom-search results — generic web searches return alarming or inaccurate results.
- Discovery friction — even when a doctor is needed, finding the right specialist nearby is slow.

### 1.2 Target Users

| User Type | Description | Primary Need |
|---|---|---|
| General Adult | 18-55 year old smartphone user, mild to moderate health literacy | Quick triage & next steps |
| Parent / Caregiver | Monitoring symptoms for children or elderly family members | Safety guidance & urgency flag |
| Remote Area User | Limited local medical access, low bandwidth | Offline symptom guidance |
| Student / Young Professional | Cost-conscious, prefers self-service before clinic visit | Cheap first-opinion alternative |

### 1.3 Out of Scope (v1.0)

- Actual medical diagnosis — the app provides informational suggestions only
- Prescription or treatment recommendations
- Integration with EHR / hospital systems
- Insurance or billing features
- Real-time doctor consultations (telemedicine)
- Pediatric-specific symptom models

---

## 2. Functional Requirements

### 2.1 Symptom Input Module

| Requirement ID | Description |
|---|---|
| FR-SYM-01 | User can select body region from an interactive anatomical body map (front and back view, tap to activate region) |
| FR-SYM-02 | For each selected region, app shows a contextual symptom checklist (e.g., tapping 'chest' shows: pain, tightness, palpitations, shortness of breath) |
| FR-SYM-03 | User can rate symptom severity on a 1–10 slider for each symptom |
| FR-SYM-04 | User can input symptom duration (hours, days, weeks) via a picker |
| FR-SYM-05 | User can add free-text description (max 500 chars) to supplement symptoms |
| FR-SYM-06 | User can mark existing conditions (diabetes, hypertension, asthma) from a pre-defined list |
| FR-SYM-07 | App validates that at least one symptom is selected before proceeding to analysis |

### 2.2 AI Analysis Engine

| Requirement ID | Description |
|---|---|
| FR-AI-01 | On symptom submission, app calls the AI backend and returns a structured response within 5 seconds on a 4G connection |
| FR-AI-02 | AI response includes: top 3 possible conditions with confidence percentages |
| FR-AI-03 | AI response includes: urgency level (Emergency / See Doctor Today / Monitor at Home / Routine Checkup) |
| FR-AI-04 | AI response includes: 2–4 recommended next actions in plain language |
| FR-AI-05 | AI response includes: key symptoms that influenced the assessment |
| FR-AI-06 | AI always appends a disclaimer that this is not a medical diagnosis |
| FR-AI-07 | If urgency level is 'Emergency', the app immediately shows emergency contact info (local ambulance number) before the full report |

### 2.3 Results & Insights Screen

| Requirement ID | Description |
|---|---|
| FR-RES-01 | Results display as a card-based layout: Urgency Banner (top), Condition Cards, Recommendations, Disclaimer |
| FR-RES-02 | Each condition card shows: condition name, confidence %, brief description (2 sentences), and a 'Learn More' link to a reputable source (Mayo Clinic / WHO) |
| FR-RES-03 | Urgency banner is color-coded: Red = Emergency, Orange = See Doctor Today, Yellow = Monitor, Green = Routine |
| FR-RES-04 | User can tap 'Find Doctor' to navigate to the nearby doctor feature |
| FR-RES-05 | User can save the session report to their history |
| FR-RES-06 | User can share the report as a PDF via device share sheet |

### 2.4 Nearby Doctor Finder

| Requirement ID | Description |
|---|---|
| FR-MAP-01 | App uses OpenStreetMap + Nominatim API to display doctors/clinics on a free map |
| FR-MAP-02 | Doctors are filtered by specialty relevant to the detected condition (e.g., cardiologist for chest pain) |
| FR-MAP-03 | Each doctor card shows: name, specialty, address, distance, phone number, and operating hours |
| FR-MAP-04 | User can get directions via the device's default maps app (Google Maps or Apple Maps deep link) |
| FR-MAP-05 | App requests device location permission with a clear explanation of why it is needed |
| FR-MAP-06 | If location is denied, user can enter a postcode/city manually |

### 2.5 User Account & History

| Requirement ID | Description |
|---|---|
| FR-ACC-01 | User can register with email + password or continue as a guest (limited history) |
| FR-ACC-02 | Registered users have a symptom history with date, symptoms, and AI result stored locally and synced to server |
| FR-ACC-03 | User can delete individual history entries or all history |
| FR-ACC-04 | User can set a profile (age, sex, pre-existing conditions) that is sent with each AI query to improve accuracy |
| FR-ACC-05 | User can export full health history as a PDF |

### 2.6 Offline Mode

| Requirement ID | Description |
|---|---|
| FR-OFF-01 | Symptom checklist and body map work fully offline (data bundled with app) |
| FR-OFF-02 | Offline AI fallback: a rule-based triage engine using a local decision tree provides urgency guidance when no internet is available |
| FR-OFF-03 | App clearly indicates when offline mode is active and results may be less accurate |
| FR-OFF-04 | Offline history is synced to server when connection is restored |

---

## 3. Non-Functional Requirements

### 3.1 Performance

- AI response latency: < 5 seconds on 4G, < 15 seconds on 3G
- App cold start: < 3 seconds on mid-range Android (2GB RAM, 2019+)
- Map tile loading: < 2 seconds in-viewport on Wi-Fi
- App bundle size: < 25 MB initial download

### 3.2 Security & Privacy

- All health data encrypted at rest (AES-256) and in transit (TLS 1.3)
- No health data shared with third-party advertisers
- GDPR-compliant data handling (user consent, right to delete)
- JWT authentication with refresh token rotation
- No PII stored in logs

### 3.3 Accessibility

- WCAG 2.1 AA compliance
- Font size scalable; minimum tap target 44x44pt
- Screen reader (TalkBack / VoiceOver) compatible for all core flows
- High-contrast mode support

### 3.4 Localization (Future)

v1.0 ships English only. Architecture must support i18n (use locale-based string files from day one).

---

## 4. Assumptions

1. The AI backend is built using a third-party LLM API (Gemini gemini-2.0-flash via Google), not a custom-trained medical model.
2. Doctor data comes from OpenStreetMap's Overpass API, which covers clinics/hospitals in most urban areas.
3. The app targets Android and iOS through a single React Native codebase.
4. v1.0 does not require regulatory approval (not a medical device) because it explicitly disclaims diagnostic use.
5. Backend is hosted on a serverless/cloud platform (e.g., Railway, Render, or Supabase).
