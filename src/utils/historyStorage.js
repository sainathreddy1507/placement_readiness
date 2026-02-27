const STORAGE_KEY = 'placement_readiness_history';

/**
 * History entry shape:
 * { id, createdAt, company, role, jdText, extractedSkills, plan, checklist, questions, readinessScore }
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry) {
  const list = getHistory();
  const newEntry = {
    ...entry,
    id: entry.id || `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: entry.createdAt || new Date().toISOString(),
  };
  list.unshift(newEntry);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newEntry;
  } catch (e) {
    console.error('Failed to save history', e);
    return null;
  }
}

export function getHistoryEntryById(id) {
  const list = getHistory();
  return list.find((e) => e.id === id) || null;
}

export function deleteHistoryEntry(id) {
  const list = getHistory().filter((e) => e.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}
