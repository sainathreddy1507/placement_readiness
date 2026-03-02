const STORAGE_KEY = 'placement_readiness_history';
import { validateEntry, toCanonicalEntry, normalizeEntry } from './analysisSchema';

function getRawList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Returns { entries: valid entries only, skippedCount: number of corrupted skipped }.
 * If any entry was skipped, repairs storage by writing back only valid entries.
 */
export function getHistoryWithSkipped() {
  const raw = getRawList();
  const entries = [];
  let skippedCount = 0;
  for (const entry of raw) {
    if (validateEntry(entry)) {
      entries.push(entry);
    } else {
      skippedCount += 1;
    }
  }
  if (skippedCount > 0) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to repair history', e);
    }
  }
  return { entries, skippedCount };
}

/** Returns only valid history entries (array). */
export function getHistory() {
  const { entries } = getHistoryWithSkipped();
  return entries;
}

export function saveToHistory(entry) {
  const { entries } = getHistoryWithSkipped();
  const canonical = toCanonicalEntry({
    ...entry,
    id: entry.id || undefined,
    createdAt: entry.createdAt || undefined,
    company: entry.company ?? '',
    role: entry.role ?? '',
    jdText: entry.jdText ?? '',
    extractedSkills: entry.extractedSkills,
    roundMapping: entry.roundMapping,
    checklist: entry.checklist,
    plan: entry.plan,
    plan7Days: entry.plan7Days,
    questions: entry.questions,
    baseScore: entry.baseScore ?? entry.baseReadinessScore,
    finalScore: entry.finalScore ?? entry.readinessScore,
    skillConfidenceMap: entry.skillConfidenceMap ?? {},
    companyIntel: entry.companyIntel,
  });
  const list = [canonical, ...entries];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return canonical;
  } catch (e) {
    console.error('Failed to save history', e);
    return null;
  }
}

export function getHistoryEntryById(id) {
  const entries = getHistory();
  const entry = entries.find((e) => e.id === id) || null;
  return entry ? normalizeEntry(entry) : null;
}

export function updateHistoryEntry(updatedEntry) {
  if (!updatedEntry || !updatedEntry.id) return null;
  const entries = getHistory();
  const index = entries.findIndex((e) => e.id === updatedEntry.id);
  if (index === -1) return null;
  const existing = entries[index];
  const merged = { ...existing, ...updatedEntry };
  const now = new Date().toISOString();
  merged.updatedAt = now;
  entries[index] = merged;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return normalizeEntry(merged);
  } catch (e) {
    console.error('Failed to update history', e);
    return null;
  }
}

export function deleteHistoryEntry(id) {
  const entries = getHistory().filter((e) => e.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}
