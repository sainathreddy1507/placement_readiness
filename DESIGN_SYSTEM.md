# KodNest Premium Build System

Design system for a serious B2C product. Calm, intentional, coherent, confident.

---

## Design philosophy

- **Calm, intentional, coherent, confident**
- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon colors, no animation noise
- One mind designed it — no visual drift

---

## Color system (max 4)

| Role      | Token            | Value     |
|-----------|------------------|-----------|
| Background| `--kn-background`| `#F7F6F3` |
| Primary text | `--kn-text`  | `#111111` |
| Accent    | `--kn-accent`    | `#8B0000` (deep red) |
| Success   | `--kn-success`   | `#4A6B4A` (muted green) |
| Warning   | `--kn-warning`   | `#8B7355` (muted amber) |

Additional: `--kn-text-muted`, `--kn-border`, `--kn-border-focus` (semantic aliases).

---

## Typography

- **Headings:** Serif (Source Serif 4), large, confident, generous spacing
- **Body:** Sans-serif (Inter), 16–18px, line-height 1.6–1.8
- **Text blocks:** max-width 720px (`--kn-text-max-width`)
- No decorative fonts, no random sizes

---

## Spacing (strict scale)

Use only: **8px, 16px, 24px, 40px, 64px**

Tokens: `--kn-space-1` (8) through `--kn-space-5` (64). Never use random values (e.g. 13px, 27px).

---

## Global layout structure

Every page follows:

1. **Top Bar** — Left: project name · Center: Step X / Y · Right: status badge (Not Started / In Progress / Shipped)
2. **Context Header** — Large serif headline, one-line subtext, clear purpose
3. **Primary Workspace (70%)** + **Secondary Panel (30%)**
4. **Proof Footer** — Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed (each requires proof input)

---

## Components

- **Primary button:** solid deep red (`--kn-accent`)
- **Secondary button:** outlined, same hover and radius
- **Inputs:** clean borders, no heavy shadows, clear focus state
- **Cards:** subtle border, no drop shadows, balanced padding
- **Transitions:** 150–200ms, ease-in-out (`--kn-transition`: 175ms), no bounce, no parallax

---

## Error & empty states

- **Errors:** Explain what went wrong and how to fix; never blame the user
- **Empty states:** Provide next action; never feel dead

---

## File structure

```
src/
  design-system/
    tokens.css    # CSS custom properties
    base.css      # Resets, typography, focus
    index.js      # JS token exports
  components/
    TopBar, ContextHeader, WorkspaceLayout, ProofFooter, PageLayout
    StatusBadge, Button, Input, Card
    SecondaryPanel, CopyablePrompt, EmptyState, ErrorMessage
```

Import tokens and base in app root: `tokens.css`, then `base.css`.
