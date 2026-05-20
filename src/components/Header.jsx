import React from 'react';

function Header() {
  return (
    <div className="drag-region flex items-center justify-between border-b border-panelBorder px-3 py-2">
      <div>
        <h1 className="text-sm font-semibold text-slate-100">AI Sidekick</h1>
        <p className="text-[11px] text-slate-400">Developer learning helper</p>
      </div>

      <div className="no-drag flex gap-1">
        <button
          onClick={() => window.electronAPI.minimizeWindow()}
          className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-600"
          aria-label="Minimize"
        >
          _
        </button>
        <button
          onClick={() => window.electronAPI.closeWindow()}
          className="rounded bg-rose-800 px-2 py-1 text-xs text-rose-100 hover:bg-rose-700"
          aria-label="Close"
        >
          X
        </button>
      </div>
    </div>
  );
}

export default Header;
