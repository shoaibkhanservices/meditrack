# MediTrack — UI/UX Design Brief

**Version:** 1.0 | **Date:** June 2026

---

## 1. Design Philosophy

MediTrack sits in the healthcare space — a domain where trust, clarity, and calm are non-negotiable. The design should feel like a knowledgeable friend who is reassuring, never alarmist. Every design choice reinforces: "This app has your back."

| Principle | What it means | What to avoid |
|---|---|---|
| Clinical Trust | Clean whites, structured layouts, no decoration clutter | Loud colors, playful fonts, busy backgrounds |
| Calm Confidence | Spacious padding, measured typography scale, subtle animations | Jittery transitions, dense screens, small touch targets |
| Progressive Disclosure | Show only what the user needs at each step | Dumping all options on one screen |
| Accessible First | High contrast, large text defaults, keyboard-free body map | Relying only on color to convey urgency |

---

## 2. Color System

| Token Name | Hex Value | Usage |
|---|---|---|
| --color-primary | #1A56DB | Primary buttons, active states, links, brand accent |
| --color-primary-light | #DBEAFE | Info callouts, selected symptom highlight, card backgrounds |
| --color-primary-dark | #1E40AF | Hover/pressed primary button state |
| --color-emergency | #DC2626 | Emergency urgency banner, critical alerts |
| --color-urgent | #EA580C | See Doctor Today urgency state |
| --color-caution | #CA8A04 | Monitor at Home urgency state |
| --color-safe | #16A34A | Routine Checkup urgency state |
| --color-surface | #FFFFFF | Card backgrounds, modal backgrounds |
| --color-background | #F9FAFB | App background |
| --color-border | #E5E7EB | Dividers, card borders |
| --color-text-primary | #111827 | Headings, critical copy |
| --color-text-secondary | #6B7280 | Labels, metadata, disclaimers |
| --color-text-on-dark | #FFFFFF | Text on colored backgrounds |

---

## 3. Typography

| Style | Spec | Usage |
|---|---|---|
| Display/Hero | Inter 28pt Bold | Screen titles, onboarding headings |
| Heading 1 | Inter 22pt SemiBold | Section titles within screens |
| Heading 2 | Inter 18pt SemiBold | Card titles, subsection labels |
| Body Regular | Inter 16pt Regular | Main content text, descriptions |
| Body Small | Inter 14pt Regular | Secondary info, metadata, doctor addresses |
| Label | Inter 12pt Medium, UPPERCASE, 0.5px tracking | Tags, badges, category labels |
| Disclaimer | Inter 12pt Regular | Medical disclaimers — always gray, always visible |
| Button | Inter 16pt SemiBold | All buttons — consistent across app |

Font: Use Inter (free, Google Fonts). Fallback: -apple-system, Roboto, Arial.

---

## 4. Component Library

### 4.1 Buttons

| Variant | Style Spec | Usage |
|---|---|---|
| Primary | bg: --primary, text: white, radius: 12px, height: 52px, full-width | Main CTAs (Analyze, Sign In, Save) |
| Secondary | bg: transparent, border: 1.5px --primary, text: --primary, radius: 12px | Less important actions (Back, Cancel) |
| Destructive | bg: #FEE2E2, text: #DC2626, radius: 12px | Delete, Clear History |
| Icon Button | 40x40 rounded, bg: --primary-light, icon: --primary | Map controls, share, back |
| Disabled | opacity: 40%, non-interactive | Any button when prerequisites not met |

### 4.2 Cards

- Background: white, border: 1px --color-border, border-radius: 16px, shadow: 0 2px 8px rgba(0,0,0,0.06)
- Padding: 16px all sides
- Condition Card: includes confidence bar (colored progress bar, 0-100%), 2-line description, Learn More chip
- Doctor Card: left accent bar colored by distance urgency, 3-row info layout
- History Card: icon + urgency dot + session date + top finding

### 4.3 Urgency Banner

- Full-width, 72px height, rounded-bottom corners (16px), sticky at top of results
- Left side: circular icon (exclamation or checkmark)
- Center: urgency label (bold 18pt) + short action text (14pt regular)
- Right side: chevron pointing down (indicates scroll for details)
- Background: urgency color (see color system)

### 4.4 Body Map

- SVG-based anatomical figure (royalty-free outline style — no photo realism)
- Front / Back toggle at top (pill-style segmented control)
- Regions defined: Head, Neck, Chest, Abdomen, Left Arm, Right Arm, Left Leg, Right Leg, Upper Back, Lower Back
- Tap state: region fill changes to --color-primary-light with 2px --color-primary stroke
- Active region count badge on "Next" button

### 4.5 Severity Slider

- Custom slider: 1-10 track, thumb is circular with current value
- Track color: gradient green (#16A34A) → yellow (#CA8A04) → red (#DC2626)
- Below slider: labels "Mild" (left), "Moderate" (center), "Severe" (right)
- Haptic feedback on value change (light impact)

---

## 5. Interaction & Animation

| Interaction | Spec |
|---|---|
| Screen transition | Slide-in from right (push), fade-out on back (React Navigation default) |
| Bottom sheet open | Spring animation, 300ms, ease-out |
| Urgency banner appear | Fade in + slide down, 400ms, after results load |
| Confidence bar fill | Animated fill left-to-right, 600ms, staggered by 150ms per card |
| Loading pulse | Breathing scale animation (0.95 → 1.05), 1.2s infinite loop |
| Haptic | Light impact on: symptom select, severity slider change, save confirmation |
| Error shake | Horizontal shake (translateX ±8px, 3x), 300ms for form validation fails |

---

## 6. Screen Layout Grid

- Base unit: 4px
- Screen horizontal padding: 16px (mobile) / 24px (tablet)
- Section vertical spacing: 24px between major sections
- Card gap: 12px
- Safe area: always respect iOS notch / Android status bar via SafeAreaView
- Bottom tab height: 64px + safe area inset
