export const STORAGE_KEYS = {
  mode: 'ai-sidekick.mode',
  input: 'ai-sidekick.input',
  output: 'ai-sidekick.output',
  history: 'ai-sidekick.history',
  autoCopyOpen: 'ai-sidekick.autoCopyOpen',
  customTemplates: 'ai-sidekick.customTemplates',
  activeTab: 'ai-sidekick.activeTab'
};

export function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
