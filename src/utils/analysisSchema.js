/**
 * Canonical analysis entry schema and normalizers.
 * All saved entries use this shape; legacy entries are normalized on read.
 *
 * Standardized entry shape:
 * {
 *   id, createdAt, updatedAt,
 *   company: string | "",
 *   role: string | "",
 *   jdText: string,
 *   extractedSkills: { coreCS, languages, web, data, cloud, testing, other: string[] },
 *   roundMapping: [{ roundTitle, focusAreas[], whyItMatters }],
 *   checklist: [{ roundTitle, items[] }],
 *   plan7Days: [{ day, focus, tasks[] }],
 *   questions: string[],
 *   baseScore: number,
 *   skillConfidenceMap: { [skill]: "know" | "practice" },
 *   finalScore: number,
 *   companyIntel?: object | null
 * }
 */

const EXTRACTED_SKILLS_KEYS = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing', 'other'];

const DEFAULT_OTHER_SKILLS = ['Communication', 'Problem solving', 'Basic coding', 'Projects'];

export function getEmptyExtractedSkills() {
  return Object.fromEntries(EXTRACTED_SKILLS_KEYS.map((k) => [k, []]));
}

export function normalizeExtractedSkills(extracted) {
  const out = getEmptyExtractedSkills();
  if (!extracted || typeof extracted !== 'object') return out;
  const categories = extracted.categories && typeof extracted.categories === 'object' ? extracted.categories : {};
  const map = {
    coreCS: 'coreCS',
    languages: 'languages',
    web: 'web',
    data: 'data',
    cloudDevOps: 'cloud',
    testing: 'testing',
  };
  for (const [oldKey, newKey] of Object.entries(map)) {
    const cat = categories[oldKey];
    out[newKey] = Array.isArray(cat?.skills) ? [...cat.skills] : [];
  }
  if (extracted.generalFresher || Object.values(out).every((arr) => arr.length === 0)) {
    out.other = [...DEFAULT_OTHER_SKILLS];
  }
  return out;
}

export function normalizeRoundMapping(roundMapping) {
  if (!Array.isArray(roundMapping)) return [];
  return roundMapping.map((r) => ({
    roundTitle: r.roundTitle ?? r.title ?? `Round ${r.roundNumber ?? 0}`,
    focusAreas: Array.isArray(r.focusAreas) ? r.focusAreas : (r.description ? [r.description] : []),
    whyItMatters: r.whyItMatters ?? '',
  }));
}

export function normalizeChecklist(checklist) {
  if (!Array.isArray(checklist)) return [];
  return checklist.map((c) => ({
    roundTitle: c.roundTitle ?? c.round ?? '',
    items: Array.isArray(c.items) ? c.items : [],
  }));
}

export function normalizePlan7Days(plan) {
  if (!Array.isArray(plan)) return [];
  return plan.map((p) => ({
    day: typeof p.day === 'number' ? p.day : 0,
    focus: p.focus ?? p.title ?? '',
    tasks: Array.isArray(p.tasks) ? p.tasks : (Array.isArray(p.items) ? p.items : []),
  }));
}

/**
 * Validate history entry so corrupted ones are skipped. Ensures required fields exist
 * and extractedSkills is safe to normalize (object or undefined).
 */
export function validateEntry(entry) {
  if (!entry || typeof entry !== 'object') return false;
  if (!entry.id || typeof entry.id !== 'string') return false;
  if (typeof entry.jdText !== 'string') return false;
  if (typeof entry.createdAt !== 'string') return false;
  if (entry.extractedSkills !== undefined) {
    if (typeof entry.extractedSkills !== 'object' || entry.extractedSkills === null || Array.isArray(entry.extractedSkills)) return false;
  }
  try {
    normalizeExtractedSkills(entry.extractedSkills);
  } catch {
    return false;
  }
  return true;
}

/**
 * Build canonical entry for saving. Use result from runAnalysis + company/role + companyIntel + roundMapping.
 */
export function toCanonicalEntry(raw) {
  const now = new Date().toISOString();
  const extracted = normalizeExtractedSkills(raw.extractedSkills);
  const roundMapping = normalizeRoundMapping(raw.roundMapping);
  const checklist = normalizeChecklist(raw.checklist);
  const plan7Days = normalizePlan7Days(raw.plan);
  const questions = Array.isArray(raw.questions) ? raw.questions : [];
  const baseScore = typeof raw.baseScore === 'number' ? raw.baseScore : (typeof raw.baseReadinessScore === 'number' ? raw.baseReadinessScore : 0);
  const finalScore = typeof raw.finalScore === 'number' ? raw.finalScore : (typeof raw.readinessScore === 'number' ? raw.readinessScore : baseScore);
  const skillConfidenceMap = raw.skillConfidenceMap && typeof raw.skillConfidenceMap === 'object' ? raw.skillConfidenceMap : {};

  return {
    id: raw.id || `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: raw.createdAt || now,
    updatedAt: raw.updatedAt || now,
    company: typeof raw.company === 'string' ? raw.company : '',
    role: typeof raw.role === 'string' ? raw.role : '',
    jdText: typeof raw.jdText === 'string' ? raw.jdText : '',
    extractedSkills: extracted,
    roundMapping,
    checklist,
    plan7Days,
    questions,
    baseScore,
    skillConfidenceMap,
    finalScore,
    companyIntel: raw.companyIntel ?? null,
  };
}

/**
 * Normalize legacy or canonical entry for UI (Results/History). Returns canonical shape.
 * Defensive: never throws; invalid input yields a safe default shape.
 */
export function normalizeEntry(entry) {
  if (!entry || !entry.id) return null;
  try {
    const extracted = normalizeExtractedSkills(entry.extractedSkills);
    const plan7Days = entry.plan7Days ?? normalizePlan7Days(entry.plan);
    const plan = Array.isArray(entry.plan) && entry.plan.length > 0
      ? entry.plan
      : plan7Days.map((p) => ({ day: p.day, title: p.focus, items: p.tasks || [] }));
    const baseScore = typeof entry.baseScore === 'number' ? entry.baseScore : (typeof entry.baseReadinessScore === 'number' ? entry.baseReadinessScore : 0);
    const finalScore = typeof entry.finalScore === 'number' ? entry.finalScore : (typeof entry.readinessScore === 'number' ? entry.readinessScore : baseScore);
    return {
      ...entry,
      company: typeof entry.company === 'string' ? entry.company : '',
      role: typeof entry.role === 'string' ? entry.role : '',
      jdText: typeof entry.jdText === 'string' ? entry.jdText : '',
      extractedSkills: extracted,
      roundMapping: normalizeRoundMapping(entry.roundMapping).map((r, i) => ({
        ...r,
        roundNumber: i + 1,
        title: r.roundTitle,
        description: (r.focusAreas && r.focusAreas[0]) || '',
      })),
      checklist: normalizeChecklist(entry.checklist).map((c) => ({ ...c, round: c.roundTitle, items: c.items || [] })),
      plan7Days,
      plan,
      questions: Array.isArray(entry.questions) ? entry.questions : [],
      baseScore,
      finalScore,
      readinessScore: finalScore,
      skillConfidenceMap: entry.skillConfidenceMap && typeof entry.skillConfidenceMap === 'object' ? entry.skillConfidenceMap : {},
      updatedAt: entry.updatedAt || entry.createdAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** For UI: turn canonical extractedSkills into { key: { label, skills } }. */
const CATEGORY_LABELS = {
  coreCS: 'Core CS',
  languages: 'Languages',
  web: 'Web',
  data: 'Data',
  cloud: 'Cloud/DevOps',
  testing: 'Testing',
  other: 'Other',
};

export function toDisplayCategories(extractedSkills) {
  if (!extractedSkills || typeof extractedSkills !== 'object') return {};
  const out = {};
  for (const key of EXTRACTED_SKILLS_KEYS) {
    const arr = extractedSkills[key];
    if (Array.isArray(arr) && arr.length > 0) {
      out[key] = { label: CATEGORY_LABELS[key] || key, skills: arr };
    }
  }
  return out;
}

/** Convert canonical extractedSkills back to legacy { categories, generalFresher } for getRoundMapping/getCompanyIntel. */
export function toLegacyExtracted(extractedSkills) {
  if (!extractedSkills || typeof extractedSkills !== 'object') {
    return { categories: {}, generalFresher: true };
  }
  const categories = {};
  const keyToCat = { cloud: 'cloudDevOps' };
  for (const key of EXTRACTED_SKILLS_KEYS) {
    const arr = extractedSkills[key];
    if (!Array.isArray(arr) || arr.length === 0) continue;
    const catKey = keyToCat[key] || key;
    categories[catKey] = { label: CATEGORY_LABELS[key] || key, skills: arr };
  }
  return {
    categories,
    generalFresher: Object.keys(categories).length === 0,
  };
}

export { DEFAULT_OTHER_SKILLS };
