import { SKILL_CATEGORIES, CATEGORY_KEYS } from './skillCategories';

/**
 * Extract skills from JD text (case-insensitive). Returns skills grouped by category.
 * If no category matches, returns { generalFresher: true } and empty groups.
 */
export function extractSkillsFromJD(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return { categories: {}, generalFresher: true };
  }

  const text = jdText.toLowerCase();
  const categories = {};

  for (const key of CATEGORY_KEYS) {
    const { label, keywords } = SKILL_CATEGORIES[key];
    const found = [];
    for (const kw of keywords) {
      const lower = kw.toLowerCase().trim();
      // Word boundary style: avoid "JavaScript" matching inside "TypeScript"
      const regex = new RegExp(`\\b${escapeRegex(lower)}\\b`, 'gi');
      if (regex.test(jdText)) found.push(kw.trim());
    }
    if (found.length > 0) {
      categories[key] = { label, skills: [...new Set(found)] };
    }
  }

  const hasAny = Object.keys(categories).length > 0;
  return {
    categories,
    generalFresher: !hasAny,
  };
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Flat list of all detected skill names (for checklist/question generation).
 */
export function getAllDetectedSkills(extracted) {
  const list = [];
  if (extracted.generalFresher) return list;
  for (const cat of Object.values(extracted.categories)) {
    list.push(...(cat.skills || []));
  }
  return [...new Set(list)];
}

export function getDetectedCategoryKeys(extracted) {
  if (extracted.generalFresher) return [];
  return Object.keys(extracted.categories);
}
