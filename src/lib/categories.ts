/**
 * Single source of truth for blog & portfolio category vocabularies.
 *
 * These `as const` arrays drive:
 *   - the Zod schemas in `src/content.config.ts`
 *   - the literal types re-exported from `src/lib/types.ts`
 *   - the filter buttons in `src/hooks/useFilter.tsx`
 *
 * Semantic authority: `docs/blog-plan/categories.md`.
 * Add a new category here (once) to have it available everywhere.
 */

export const BLOG_CATEGORIES = ["PM", "diy", "growth"] as const;
export type blogCategoryType = (typeof BLOG_CATEGORIES)[number];

export const PORTFOLIO_CATEGORIES = ["robotics", "analytics", "gameplay", "software", "ai", "hardware"] as const;
export type portfolioCategoryType = (typeof PORTFOLIO_CATEGORIES)[number];

export const GEAR_CATEGORIES = ["compute", "mobile", "wearable", "reading", "travel", "home", "network"] as const;
export type gearCategoryType = (typeof GEAR_CATEGORIES)[number];
