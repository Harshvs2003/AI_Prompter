import React from 'react';

function HistoryList({ items, onUse, onClearHistory }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-slate-300">Prompt history</label>
        <button
          onClick={onClearHistory}
          className="rounded border border-panelBorder px-2 py-1 text-[11px] text-slate-300 hover:border-rose-500 hover:text-rose-300"
        >
          Clear history
        </button>
      </div>

      <div className="custom-scroll max-h-36 space-y-2 overflow-auto">
        {items.length === 0 && <p className="text-xs text-slate-500">No history yet.</p>}

        {items.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onUse(entry)}
            className="w-full rounded-md border border-panelBorder bg-panelSoft px-2 py-2 text-left text-xs text-slate-200 hover:border-accent"
          >
            <p className="font-medium text-slate-100">{entry.mode}</p>
            <p className="mt-1 truncate text-slate-400">{entry.input}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryList;
