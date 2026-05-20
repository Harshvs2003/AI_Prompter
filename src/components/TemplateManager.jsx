import React, { useMemo, useState } from 'react';
import { DEFAULT_TEMPLATES } from '../templates/promptTemplates';

function TemplateManager({ templates, setTemplates, currentMode, setCurrentMode, showToast }) {
  const modes = useMemo(() => Object.keys(templates), [templates]);
  const [newModeName, setNewModeName] = useState('');

  const updateTemplate = (mode, nextValue) => {
    setTemplates((prev) => ({ ...prev, [mode]: nextValue }));
  };

  const createMode = () => {
    const trimmed = newModeName.trim();
    if (!trimmed) return;
    if (templates[trimmed]) {
      showToast('Mode name already exists');
      return;
    }

    setTemplates((prev) => ({
      ...prev,
      [trimmed]: `You are a helpful coding mentor.\n\nTask:\nHelp with the user request below.\n\nContext:\n{{content}}`
    }));
    setCurrentMode(trimmed);
    setNewModeName('');
    showToast('New mode created');
  };

  const deleteMode = (mode) => {
    if (modes.length <= 1) {
      showToast('At least one mode is required');
      return;
    }

    const next = { ...templates };
    delete next[mode];
    setTemplates(next);

    if (currentMode === mode) {
      setCurrentMode(Object.keys(next)[0]);
    }

    showToast('Mode deleted');
  };

  const resetDefaults = () => {
    setTemplates(DEFAULT_TEMPLATES);
    setCurrentMode('Explain Error');
    showToast('Templates reset to default');
  };

  return (
    <section className="space-y-3">
      <div className="rounded-md border border-panelBorder bg-panelSoft p-3">
        <p className="text-xs text-slate-300">
          Create custom modes and edit templates. Use <span className="text-cyan-300">{'{{content}}'}</span> where pasted input should appear.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input
          value={newModeName}
          onChange={(e) => setNewModeName(e.target.value)}
          placeholder="New mode name"
          className="rounded-md border border-panelBorder bg-panelSoft px-2 py-2 text-sm text-slate-100 outline-none focus:border-accent"
        />
        <button
          onClick={createMode}
          className="rounded-md bg-cyan-700 px-3 py-2 text-xs font-medium text-cyan-50 hover:bg-cyan-600"
        >
          Add Mode
        </button>
      </div>

      <div className="space-y-3">
        {modes.map((mode) => (
          <div key={mode} className="rounded-md border border-panelBorder bg-slate-950/60 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <input
                value={mode}
                readOnly
                className="w-full rounded border border-panelBorder bg-panelSoft px-2 py-1 text-xs text-slate-100"
              />
              <button
                onClick={() => deleteMode(mode)}
                className="rounded border border-panelBorder px-2 py-1 text-[11px] text-rose-300 hover:border-rose-500"
              >
                Delete
              </button>
            </div>

            <textarea
              value={templates[mode]}
              onChange={(e) => updateTemplate(mode, e.target.value)}
              className="custom-scroll min-h-36 w-full resize-y rounded-md border border-panelBorder bg-panelSoft p-2 text-xs text-slate-200 outline-none focus:border-accent"
            />
          </div>
        ))}
      </div>

      <button
        onClick={resetDefaults}
        className="w-full rounded-md border border-panelBorder bg-panelSoft px-3 py-2 text-xs text-slate-200 hover:border-amber-400"
      >
        Reset to Default Templates
      </button>
    </section>
  );
}

export default TemplateManager;
