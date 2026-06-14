# MediTrack — App Flow Document

**Version:** 1.0 | **Date:** June 2026

---

## 1. Navigation Structure

MediTrack uses a two-level navigation model: a Root Stack (handles Auth vs App separation) and a Bottom Tab Navigator (core app screens).

**Root Stack Screens**
```
SplashScreen → AuthGate → [AuthStack: Login, Register, ForgotPassword]
                        OR [AppTabs: Home, History, Profile]
```

**App Tabs**
- Tab 1: Home (Symptom Entry + Results)
- Tab 2: History (Past Sessions)
- Tab 3: Profile (User settings, pre-conditions)

**Modal Screens (overlays)**
- DoctorMapModal
- ReportPreviewModal
- ConditionDetailModal
- EmergencyAlertModal

---

## 2. Screen-by-Screen Flow

### Screen 1: Splash Screen

- Duration: 1.5 seconds
- Actions: Check auth token in expo-secure-store
- Decision: Token valid? → go to Home Tab | Token invalid/missing? → go to AuthGate
- Show: MediTrack logo + tagline + loading animation

### Screen 2: AuthGate

- Shows: "Welcome to MediTrack" hero image, two CTAs
- CTA 1: "Sign In" → Login Screen
- CTA 2: "Get Started Free" → Register Screen
- CTA 3 (text link): "Continue as Guest" → Home Tab (guest mode flag set)

### Screen 3: Login

- Inputs: Email, Password
- Action: "Sign In" button → POST to Supabase Auth → success → Home Tab
- Link: "Forgot password?" → ForgotPassword screen
- Link: "Create account" → Register screen
- Error states: "Invalid credentials", "User not found", "Network error"

### Screen 4: Register

- Inputs: Full Name, Email, Password, Confirm Password
- Optional: Age, Sex (improves AI accuracy — shown as "recommended")
- Action: "Create Account" → Supabase register → email verification → Login
- Validation: Password min 8 chars, email format, passwords match

### Screen 5: Home — Step 1 (Body Map)

This is the app's hero screen. A full-body SVG map (front/back toggle) is centered on screen.

- User taps a body region (head, chest, abdomen, arms, legs, back)
- Tapped region highlights in blue
- Multiple regions can be selected simultaneously
- Bottom sheet slides up showing symptom checklist for that region
- Header shows: "How are you feeling today?"
- Footer shows: "Next: Describe Symptoms" button (disabled until min 1 symptom selected)

### Screen 6: Home — Step 2 (Symptom Details)

For each selected symptom, user fills in details via a paginated card interface (one symptom per card, swipe to next).

- Symptom name (pre-filled from step 1)
- Severity slider: 1 (Mild) to 10 (Severe)
- Duration picker: Just started / Hours / 1-3 days / 4-7 days / 1-2 weeks / More than 2 weeks
- Optional free text: "Describe it in your words (optional)"
- Progress indicator: "Symptom 2 of 3"
- "Add more symptoms" link returns to body map to add additional regions
- CTA: "Analyze My Symptoms" → loading state → Results Screen

### Screen 7: Loading / Analysis

- Full-screen loading animation with rotating pulse icon
- Copy: "Analyzing your symptoms..." then "Consulting medical knowledge..."
- Timeout: if AI call exceeds 15s → show error with retry option
- No back navigation allowed during loading (prevent partial sessions)

### Screen 8: Results Screen

Scrollable screen with card layout. Top-down structure:

1. URGENCY BANNER — full-width, color-coded, icon + urgency label + one-line action
2. SECTION: "What might be going on" — 1-3 Condition Cards
3. Each card: condition name, confidence bar, 2-sentence description, "Learn More" →
4. SECTION: "What to do now" — icon-list of 2-4 recommendations
5. SECTION: "Find a Doctor Nearby" — map preview thumbnail + "View Doctors" CTA
6. SECTION: Disclaimer — gray text, small, always visible
7. FAB: "Save Report" (bottom right floating button)

**Emergency Flow**
```
IF urgencyLevel == EMERGENCY:
1. Before results load, show EmergencyAlertModal fullscreen (red)
2. Display local emergency number prominently
3. "Call Now" deep links to dialer
4. "I understand, continue" dismisses to results
```

### Screen 9: Doctor Map (Modal)

- Full-screen map with pin markers for nearby doctors/clinics
- Bottom sheet list below map: doctor cards sorted by distance
- Each card: name, specialty tag, distance, phone, hours
- Tap card: expands details + "Get Directions" button (opens device maps)
- Map filter: slider for radius (1km / 5km / 10km / 20km)
- Permission: if location not granted, show permission request dialog first

### Screen 10: History Tab

- Chronological list of past sessions (most recent first)
- Each item: date, top symptom region icon, urgency badge, top condition name
- Tap: opens read-only Results view for that session
- Long-press: delete option
- Empty state: "No sessions yet — start by checking your symptoms"
- Guest mode: shows local history with note "Sign in to sync across devices"

### Screen 11: Profile Tab

- User info: name, email (non-editable), age, sex
- Medical profile: pre-existing conditions toggle list (Diabetes, Hypertension, Asthma, Heart Disease, Allergies, Other)
- Settings: Notifications toggle, Clear all history, Export PDF, Sign Out
- Guest mode: shows "Create account to save your profile"

---

## 3. Key Decision Trees

### 3.1 Symptom → Urgency Decision

```
Chest pain + severity >= 7 OR breathing difficulty → EMERGENCY
Fever > 3 days OR severe headache → SEE_DOCTOR_TODAY
Mild persistent symptoms > 1 week → ROUTINE_CHECKUP
All other combinations → MONITOR_AT_HOME
```

### 3.2 Offline vs Online Routing

```
IF network available:
  → call POST /api/analyze (full AI response)
ELSE:
  → run local decision tree
  → show "Offline Mode" banner
  → sync to AI when back online (optional)
```
