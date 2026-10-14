# UNIQUE FURNITURE DESIGN SYSTEM
**Architectural Minimalism + Refined Neumorphism + 60/30/10 Color Rule**

---

## 1. The 60 / 30 / 10 Visual Composition Rule

Treat the 60/30/10 rule as a macro visual composition standard:

### 60% — Dominant Canvas (Warm Architectural Neutral)
- **Token**: `--bg-primary: #FAF8F5`, `--bg-secondary: #F4F0EA`, `--bg-surface: #FAF8F5`
- **Application**: Page backgrounds, large layout sections, card base surfaces, and spatial canvas.
- **Philosophy**: Avoids sterile, clinical pure white (#ffffff) across open areas. Creates a warm, hospitable gallery atmosphere tailored for luxury furniture photography.

### 30% — Secondary Depth (Charcoal & Deep Neutrals)
- **Token**: `--text-primary: #18181B`, `--color-charcoal: #18181B`, `--color-charcoal-deep: #050505`, `--bg-dark: #18181B`
- **Application**: Primary headlines, body typography, navigation text, footer canvas, structural borders, and dark secondary controls.
- **Philosophy**: Establishes high contrast, architectural weight, readability, and timeless elegance.

### 10% — Brand Accent (Official Unique Furniture Orange)
- **Token**: `--brand-orange: #FF6600` (Hover: `#E55C00`, Active: `#CC5200`, Tint: `rgba(255, 102, 0, 0.08)`)
- **Extraction**: Extracted directly from the official Unique Furniture master logo SVG.
- **Application**: Active navigation indicator, primary hero actions, selected filter states, focus rings, status checkmarks, and micro-accents.
- **Rule**: Never overuse the accent. Orange remains scarce and valuable to guide user interaction.

### Contextual Color: WhatsApp Green
- **Token**: `--whatsapp-green: #25D366` (Hover: `#1EBD5A`)
- **Application**: Contextual only for WhatsApp customer connection and direct inquiry triggers. NOT part of the general site palette.

---

## 2. Refined Neumorphic Surface System

All neumorphic surfaces follow **one virtual light source** positioned from the **upper-left (-135°)**:
- **Top-left**: Light highlight (`--neu-highlight`)
- **Bottom-right**: Soft warm shadow (`--neu-shadow`)

```css
:root {
  /* Light Source Highlights and Shadows */
  --neu-highlight: rgba(255, 255, 255, 0.92);
  --neu-shadow: rgba(188, 178, 165, 0.42);
  --neu-shadow-sm: rgba(188, 178, 165, 0.32);
  --neu-inset-shadow: rgba(178, 167, 153, 0.36);
  --neu-inset-highlight: rgba(255, 255, 255, 0.88);

  /* Shared Design Tokens */
  --shadow-raised: 3px 3px 7px var(--neu-shadow), -2.5px -2.5px 6px var(--neu-highlight);
  --shadow-raised-sm: 2px 2px 5px var(--neu-shadow-sm), -1.5px -1.5px 4px var(--neu-highlight);
  --shadow-pressed: inset 2px 2px 4.5px var(--neu-inset-shadow), inset -2px -2px 4px var(--neu-inset-highlight);
  --shadow-pressed-subtle: inset 1.5px 1.5px 3px var(--neu-inset-shadow), inset -1px -1px 2.5px var(--neu-inset-highlight);
  --shadow-floating: 6px 10px 22px rgba(0, 0, 0, 0.08), -3px -3px 9px var(--neu-highlight);
}
```

### Responsive Calibration
On mobile screens (`@media (max-width: 768px)`), shadow offsets and blur are scaled down by ~30% (`1.5px–2px`) to ensure crisp tactile geometry without muddying high-DPI displays.

---

## 3. Surface Hierarchy

- **Level 0 (Base Canvas)**: Page body and major background sections (`--bg-primary`).
- **Level 1 (Interactive Controls)**: Buttons, search triggers, language selectors, filter tabs, inputs (`--shadow-raised-sm` default, `--shadow-pressed` on active).
- **Level 2 (Floating Overlays)**: Language dropdowns, search modal, contact popover, bottom drawer (`--shadow-floating`).

---

## 4. Micro-Interactions & Tactile Feedback

### Timing & Curves
- **Button Press**: `80–120ms` (`--duration-press: 110ms`)
- **Hover Transitions**: `120–160ms` (`--duration-hover: 150ms`)
- **Dropdown Opens**: `160–200ms` (`--duration-dropdown: 190ms`)
- **Sheet Slide**: `220–280ms` (`--duration-sheet: 260ms`)
- **Curve**: `cubic-bezier(0.16, 1, 0.3, 1)` (natural deceleration, zero bounce/cartoons).

### Interactive Component States
| Element | Default | Hover | Focus-Visible | Active / Pressed |
| :--- | :--- | :--- | :--- | :--- |
| **Secondary Button** | `--shadow-raised-sm` | `--shadow-raised`, light tint | 2px Brand Orange ring | Scale 0.985 + `--shadow-pressed` |
| **Primary Charcoal** | `--shadow-dark-raised-sm` | `--shadow-dark-raised` | 2px Brand Orange ring | Scale 0.985 + `--shadow-dark-pressed` |
| **Brand Orange CTA** | `--shadow-orange-raised` | Slightly lighter orange + shadow | 2px white / orange ring | Scale 0.985 + `--shadow-orange-pressed` |
| **Form Inputs** | `--shadow-pressed-subtle` | Subtle border darkening | Inset shadow + 3px orange ring | Inset shadow held |
| **Link with Arrow** | Text normal | Arrow shifts 2–4px in reading direction | Underline / ring | Opacity 0.85 |
| **Header Nav** | Neutral text | Text charcoal | Outline ring | Thin 2px orange line indicator |

---

## 5. Typography Standards & Mandatory Rules

- **Kurdish Font**: **Zain** (`'Zain'`, `Noto Sans Arabic`, system-ui).
- **Arabic Font**: **Zain**, Noto Sans Arabic.
- **Latin Font**: Plus Jakarta Sans, Playfair Display (editorial accents).
- **Mandatory Font Weight Rule**:
  - **Always use `font-weight: normal` (400) in EVERY language and EVERY situation.**
  - Headings (`h1`–`h6`), buttons, navigation, product titles, cards, body copy, and metadata all strictly render with `font-weight: normal`. Bold and medium font-weights are prohibited across all viewports.
- **Fluid Scale**:
  - `h1`: `clamp(1.85rem, 4.2vw, 3.4rem)` — Weight normal
  - `h2`: `clamp(1.4rem, 2.8vw, 2.4rem)` — Weight normal
  - `h3`: `clamp(1.1rem, 1.8vw, 1.45rem)` — Weight normal
  - Body: `clamp(0.92rem, 0.95vw, 1.02rem)` — Weight normal, Line-height 1.65–1.7

---

## 6. Accessibility & Contrast Safeguards

- Pure neumorphism without contrast borders is **strictly prohibited**.
- Controls always include `1px solid var(--border-subtle)` for defined perimeter affordance.
- All body text maintains minimum 4.5:1 WCAG contrast against background.
- Focus rings are explicit and high contrast (`2px solid var(--brand-orange)`).
- Full support for `prefers-reduced-motion: reduce`.

---

## 7. Iconly Icon System Guidelines

- **Style**: Light (clean line stroke).
- **Sizes**:
  - `14px / 16px`: Tags, indicators, inline link arrows.
  - `18px`: Standard buttons, inputs, dropdown chevrons.
  - `20px / 22px`: Mobile header toggles, prominent actions.
- Touch target standard: minimum `44px × 44px` on all mobile controls.
