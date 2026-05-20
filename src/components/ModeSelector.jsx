import React from 'react';

function ModeSelector({ mode, setMode, modes }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-300">Prompt mode</label>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="w-full rounded-md border border-panelBorder bg-panelSoft px-2 py-2 text-sm text-slate-100 outline-none focus:border-accent"
      >
        {modes.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ModeSelector;
