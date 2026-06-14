---
name: Clinical Trust & Calm Confidence
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737686'
  outline-variant: '#c3c5d7'
  surface-tint: '#1353d8'
  primary: '#003fb1'
  on-primary: '#ffffff'
  primary-container: '#1a56db'
  on-primary-container: '#d4dcff'
  inverse-primary: '#b5c4ff'
  secondary: '#516070'
  on-secondary: '#ffffff'
  secondary-container: '#d5e4f8'
  on-secondary-container: '#576676'
  tertiary: '#852b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ad3b00'
  on-tertiary-container: '#ffd4c5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00174d'
  on-primary-fixed-variant: '#003dab'
  secondary-fixed: '#d5e4f8'
  secondary-fixed-dim: '#b9c8db'
  on-secondary-fixed: '#0e1d2b'
  on-secondary-fixed-variant: '#3a4858'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802a00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  emergency: '#DC2626'
  urgent: '#EA580C'
  caution: '#CA8A04'
  safe: '#16A34A'
  primary-dark: '#1E40AF'
  border: '#E5E7EB'
  text-primary: '#111827'
  text-secondary: '#6B7280'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  heading-1:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  heading-2:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-regular:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-small:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-uppercase:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
  disclaimer:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  button-text:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  gap-xs: 4px
  gap-sm: 8px
  gap-md: 12px
  gap-lg: 16px
  margin-mobile: 16px
  margin-tablet: 24px
  section-spacing: 24px
---

## Brand & Style

The design system is built upon the dual pillars of **Clinical Trust** and **Calm Confidence**. It aims to transform the anxiety often associated with medical symptoms into a structured, reliable, and reassuring experience. The personality is that of a "knowledgeable friend"—authoritative yet approachable, never alarmist.

The visual style follows a **Corporate / Modern** aesthetic with a lean toward high-utility healthcare interfaces. It prioritizes clarity over decoration, utilizing generous white space, a strictly governed grid, and a high-contrast palette to ensure information is scannable even during moments of physical distress. 

**Design Principles:**
- **Medical Precision:** Use crisp borders and structured layouts to imply rigorous data handling.
- **Visual Reassurance:** Employ soft primary blues and rounded corners (12px to 16px) to soften the "clinical" edge, making the app feel safe and human.
- **Urgency Hierarchy:** High-contrast color signaling is reserved exclusively for triage guidance, ensuring the user's attention is directed immediately to the most critical action.

## Colors

The palette is strategically divided between **Brand/Utility** and **Triage/Urgency**. The default mode is `light`, utilizing a pristine white surface (`#FFFFFF`) on a subtle off-white background (`#F9FAFB`) to create a sense of depth and cleanliness.

### Triage Palette
These colors are used exclusively for urgency banners, confidence bars, and status indicators. They follow a standard traffic-light mental model to ensure instant recognition:
- **Emergency (#DC2626):** Critical alerts and immediate action.
- **Urgent (#EA580C):** "See doctor today" status.
- **Caution (#CA8A04):** Monitoring and home-care guidance.
- **Safe (#16A34A):** Routine checkups or non-critical findings.

### Brand Palette
- **Primary (#1A56DB):** Used for main CTAs and active states.
- **Secondary/Light (#DBEAFE):** Used for subtle backgrounds of cards or selected regions in the body map.

## Typography

This design system uses **Inter** exclusively to leverage its exceptional legibility and systematic, utilitarian feel. The hierarchy is designed for rapid information retrieval.

- **Scale:** Headings use semi-bold weights to anchor the eye, while body text uses a standard 16px base for optimal readability on mobile devices.
- **Labels:** Small caps/uppercase labels with slight tracking (0.5px) are used for metadata and category tags to differentiate them from functional body text.
- **Disclaimers:** These are always rendered in `text-secondary` (#6B7280) to remain present without distracting from primary insights.
- **Responsive:** On mobile devices, the `display-hero` size should scale down to 24px to ensure headlines do not wrap awkwardly.

## Layout & Spacing

The layout uses a **4px base unit** to ensure a consistent rhythm across all components.

- **Grid Model:** A fluid layout is used for mobile screens with a fixed 16px horizontal margin. For tablet and desktop, the content conforms to a centered max-width container with 24px margins.
- **Vertical Rhythm:** Major sections (e.g., Symptoms vs. Doctor Recommendations) are separated by 24px. Smaller elements within a card use 8px or 12px gaps.
- **Touch Targets:** All interactive elements (buttons, slider thumbs, body map regions) must maintain a minimum hit area of 44x44px.

## Elevation & Depth

This design system utilizes **Tonal Layers** combined with **Ambient Shadows** to create a focused, medical-grade interface.

- **Surfaces:** The primary background uses `neutral-color` (#F9FAFB). Interactive cards are elevated on white surfaces (#FFFFFF).
- **Shadows:** Cards use a very soft, diffused shadow: `0px 2px 8px rgba(0, 0, 0, 0.06)`. This provides enough depth to distinguish cards from the background without feeling overly "heavy" or distracting.
- **Borders:** A consistent 1px border (`#E5E7EB`) is used on all containers to reinforce the "structured" and "clinical" nature of the product.
- **Active States:** Selection (like choosing a body part) is indicated by a tonal shift to `primary-light` (#DBEAFE) rather than an increase in shadow.

## Shapes

The shape language is defined as **Rounded**, striking a balance between the precision of sharp corners and the friendliness of fully rounded pill shapes.

- **Standard Radius:** 8px (0.5rem) for most small UI elements.
- **Large Radius (rounded-lg):** 16px (1rem) for containers, condition cards, and urgency banners.
- **Button Radius:** 12px (0.75rem) to provide a distinct, comfortable "tap" feel that contrasts slightly with the cards.

## Components

### Buttons
- **Primary:** Full-width, height 52px, background `#1A56DB`, text `#FFFFFF`. Used for "Analyze" and "Sign In."
- **Secondary:** Transparent background with 1.5px `#1A56DB` border.
- **Destructive:** Light red background (`#FEE2E2`) with `#DC2626` text.

### Condition Cards
- **Structure:** 16px padding, 1px border, 16px corner radius.
- **Confidence Bar:** A custom progress bar where the fill color corresponds to the urgency level (e.g., Green for safe, Red for emergency).
- **Interactions:** The "Learn More" element is a small chip-style link.

### Urgency Banners
- **Location:** Sticky at the top of results.
- **Style:** 72px height, colors mapped to the Triage Palette. Includes a circular icon on the left (e.g., a white exclamation mark for emergency).

### Severity Slider
- **Visuals:** A custom track featuring a gradient transition from Safe (#16A34A) to Caution (#CA8A04) to Emergency (#DC2626).
- **Feedback:** The thumb should display the current numeric value (1-10) and provide light haptic impact upon value change.

### Body Map
- **Style:** Minimalist SVG outline. Tapped regions should fill with `primary-light` and receive a 2px `primary` stroke to clearly indicate selection.

### Inputs
- **Text Fields:** 12px corner radius, `#E5E7EB` border, 16px padding. In focus, the border transitions to `primary` (#1A56DB).