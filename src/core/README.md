# 📁 `src/core/` — Core Team Territory

> **Owner: Core/Data Team**
> UI team should NOT modify files here.

## What Lives Here

| File/Folder | Purpose |
|-------------|---------|
| `index.ts` | **Public API barrel** — the only import UI team needs |
| `../data/politicians.ts` | Politician data schema + static mock dataset |
| `../hooks/usePoliticians.ts` | Data fetching hooks (React Query) |
| `../i18n/translations.ts` | Translation keys for all 10 languages |
| `../i18n/i18n-provider.tsx` | React context provider |

## The Contract

The Core team exposes everything the UI needs via `src/core/index.ts`:

```typescript
// UI team does this:
import { usePoliticians, useI18n, gradeScore, type DetailedPoliticianData } from '@/core';

// NOT this (internal path, fragile):
import { usePoliticians } from '../../hooks/usePoliticians';
```

## Adding New Translation Keys

1. Add the key + English value to the `en` block in `translations.ts`
2. Add the translated value to every other language block (or it falls back to English)
3. Notify UI team of the new key so they can use it

## Adding New Politician Fields

1. Update the `DetailedPoliticianData` interface in `politicians.ts`
2. Populate the field in the data array
3. Re-export any new types from `core/index.ts`
4. Notify UI team so they can render it

## Data Sources

All data is sourced from publicly available Indian government records:
- **ECI** (election commission affidavits via MyNeta)
- **PRS Legislative Research** (parliament data)
- **ECI Electoral Bond Disclosures** (SBI/ECI 2024 disclosure)
- **India Kanoon** (court case tracking)
