# 🎨 UI Team Guide — Mera Neta

> **Owner: UI/Frontend Team**
> You own everything in `src/components/`, `src/pages/`, and `src/index.css`.

## Quick Start for UI Team

### 1. Import ONLY from `@/core`

```typescript
// ✅ Correct — use the public API barrel
import {
  usePoliticians,
  useI18n,
  gradeScore,
  getPartyColor,
  formatCrore,
  type DetailedPoliticianData,
} from '@/core';

// ❌ Never import from internal data paths directly
import { mockPoliticians } from '../data/politicians';  // DON'T DO THIS
```

### 2. All Text Must Go Through `t()`

Every user-visible string must use the translation hook:

```typescript
const { t } = useI18n();

// ✅ Correct
<h1>{t('hero_title_1')}</h1>
<button>{t('pin_cta')}</button>

// ❌ Never hardcode English
<h1>Know Your Neta</h1>
<button>Find My Neta</button>
```

### 3. Check Available Translation Keys

All translation keys are defined in `src/i18n/translations.ts`.
Search for your key before asking Core team to add a new one.

Common keys:
- `nav_home`, `nav_browse`, `nav_rankings`, `nav_compare` — Navigation
- `hero_title_1`, `hero_title_2`, `hero_subtitle`, `hero_badge` — Hero section
- `pin_title`, `pin_cta`, `pin_gps`, `pin_mp`, `pin_mla` — PIN finder
- `tab_overview`, `tab_financials`, `tab_criminal`, `tab_career` — Profile tabs
- `filter_state`, `filter_party`, `filter_role`, `filter_all_states` — Filters
- `stat_tracked`, `stat_cases`, `stat_growth` — Statistics

### 4. Design Tokens (CSS Variables)

Use only the CSS custom properties defined in `src/index.css`:

```css
/* Colors */
var(--color-accent-gold)     /* Primary brand gold */
var(--color-success-green)   /* Good/clean politicians */
var(--color-danger-red)      /* High-risk/criminal */
var(--color-warning-amber)   /* Caution/moderate risk */
var(--color-info-blue)       /* Informational */

/* Backgrounds */
var(--color-bg-primary)      /* Main page background */
var(--color-bg-elevated)     /* Cards, elevated surfaces */
var(--color-bg-secondary)    /* Secondary sections */

/* Text */
var(--color-text-primary)    /* Main text */
var(--color-text-secondary)  /* Subtitles, descriptions */
var(--color-text-muted)      /* Timestamps, labels */
```

### 5. Reusable Components

```
src/components/ui/
  Button.tsx              — Primary/secondary/ghost variants
  Card.tsx                — Glass-effect card container
  Badge.tsx               — Status badges with color variants
  IntegrityScoreGauge.tsx — Circular score gauge
  LanguageSwitcher.tsx    — Language dropdown (already in Layout)
  CareerTimeline.tsx      — Political career visualization
  NewsFeed.tsx            — News article stream
  CitizenActionPanel.tsx  — RTI/Grievance action panel
  PoliticianCard.tsx      — Card for Browse/Rankings views
```

### 6. Adding a New Page

1. Create `src/pages/YourPage.tsx`
2. Import data with `usePoliticians()` from `@/core`
3. Import translations with `useI18n()` from `@/core`
4. Add the route in `src/App.tsx`
5. Add nav link key to `Layout.tsx`

### 7. CSS Class Utilities

Utility classes defined in `src/index.css`:
- `.glass-panel` — Translucent glass effect
- `.glass-elevated` — More prominent glass card
- `.glass-danger` — Red-tinted danger card
- `.glass-success` — Green-tinted success card
- `.gradient-text-hero` — Gold gradient text (for H1)
- `.tag-danger` / `.tag-success` / `.tag-warning` / `.tag-gold` — Status badges
- `.press-effect` — Button press animation
- `.hover-glow` — Hover glow effect
- `.live-dot` — Pulsing green live indicator
- `.section-enter` — Fade-in animation on scroll
