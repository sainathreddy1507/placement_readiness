const STORAGE_KEY = 'prp_test_checklist';

const DEFAULT_STATE = [false, false, false, false, false, false, false, false, false, false];

export function getTestChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_STATE];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 10) return [...DEFAULT_STATE];
    return parsed.map((v) => Boolean(v));
  } catch {
    return [...DEFAULT_STATE];
  }
}

export function setTestChecklist(checks) {
  const list = Array.isArray(checks) && checks.length === 10
    ? checks.map((v) => Boolean(v))
    : [...DEFAULT_STATE];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch {
    return getTestChecklist();
  }
}

export function updateTestChecklistItem(index, checked) {
  const list = getTestChecklist();
  if (index < 0 || index >= 10) return list;
  list[index] = Boolean(checked);
  return setTestChecklist(list);
}

export function resetTestChecklist() {
  return setTestChecklist(DEFAULT_STATE);
}

export function areAllTestsPassed() {
  const list = getTestChecklist();
  return list.length === 10 && list.every(Boolean);
}
