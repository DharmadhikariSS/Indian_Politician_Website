/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MERA NETA — Core Public API
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the ONLY file the UI team needs to import from when they need
 * data, types, hooks, or utilities.
 *
 * UI team usage:
 *   import { usePoliticians, type DetailedPoliticianData, useI18n } from '@/core';
 *
 * Rules:
 *   - UI team: Only import from this file (not from deep internal paths)
 *   - Core team: Make breaking changes here visible by updating this barrel
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Data Types ───────────────────────────────────────────────────────────────
export type {
  DetailedPoliticianData,
  NewsArticle,
  ConflictAlert,
} from '../data/politicians';

// ── Data (Read-only reference data) ──────────────────────────────────────────
export { mockPoliticians } from '../data/politicians';

// ── Hooks ─────────────────────────────────────────────────────────────────────
export { usePoliticians, usePolitician } from '../hooks/usePoliticians';
export { useDynamicTranslation, useDynamicTranslationArray } from '../hooks/useDynamicTranslation';

// ── i18n ─────────────────────────────────────────────────────────────────────
export { useI18n, LANGUAGES } from '../i18n/translations';
export type { Language, LangMeta } from '../i18n/translations';
export { I18nProvider } from '../i18n/i18n-provider';

// ── Utilities ─────────────────────────────────────────────────────────────────
/**
 * Format a number in Crores as a readable Indian number string.
 * Example: formatCrore(1234.5) => "₹1,234.5 Cr"
 */
export function formatCrore(value: number): string {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
}

/**
 * Grade a politician's integrity score into a letter grade.
 * A+ = 90+, A = 80+, B = 70+, C = 50+, D = 30+, F = below 30
 */
export function gradeScore(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 50) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

/**
 * Returns a CSS color token for a party abbreviation.
 * Usage: style={{ color: getPartyColor('BJP') }}
 */
export function getPartyColor(party: string): string {
  const map: Record<string, string> = {
    BJP: '#FF6B00',   // Saffron
    INC: '#0055A5',   // Congress blue
    AAP: '#00B2FF',   // AAP teal
    SP: '#E31F26',    // Samajwadi red
    AITC: '#229A50',  // Trinamool green
    DMK: '#E3262B',   // DMK red
    TDP: '#FFDC00',   // TDP yellow
    BSP: '#1E3A8A',   // BSP blue
    NCP: '#00629B',   // NCP dark blue
    JDU: '#00913A',   // JDU green
    SHS: '#F5821F',   // Shiv Sena orange
    CPI: '#CC0000',   // CPI red
    MK: '#00A94F',    // Makkal Katchi
  };
  return map[party] ?? '#6B7280'; // default gray
}

/**
 * Returns the risk level color CSS variable name.
 */
export function getRiskColor(level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): string {
  const map = {
    LOW: 'var(--color-success-green)',
    MEDIUM: 'var(--color-warning-amber)',
    HIGH: 'var(--color-danger-red)',
    CRITICAL: 'var(--color-danger-red)',
  };
  return map[level];
}
