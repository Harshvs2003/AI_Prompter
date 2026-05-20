import React from 'react';

function PromptInput({ value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-300">Paste code, errors, or question</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste stack traces, code blocks, or questions here..."
        className="custom-scroll min-h-44 w-full resize-y rounded-md border border-panelBorder bg-panelSoft p-3 text-sm text-slate-100 outline-none focus:border-accent"
      />
    </div>
  );
}

export default PromptInput;
