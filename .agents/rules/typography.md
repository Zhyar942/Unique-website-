# Typography & Font Standards Rule

## Mandatory Typography Constraints

1. **Kurdish Font (Zain)**:
   - For all Kurdish text (`lang="ku"`), the font must always be **Zain**.
   - Declared as `font-family: 'Zain', var(--font-kurdish) !important;`.
   - Never replace or fallback Kurdish text to other fonts unless explicitly instructed.

2. **Font Weight Normal Everywhere**:
   - In **every language** (Kurdish, Arabic, English) and in **every situation** (headings `h1`–`h6`, body, buttons, links, cards, titles, tags, counters, badges):
   - Always use `font-weight: normal` (400).
   - **Never** use bold (`700`, `800`, `900`, `bold`, `bolder`) or medium (`500`, `600`) font weights.
   - Any new component, style, or page must strictly maintain `font-weight: normal`.
