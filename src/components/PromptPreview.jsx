import React from 'react';

function PromptPreview({ value, onChange, isEdited }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-300">Generated prompt (editable)</label>
        <span className="text-[11px] text-cyan-300">{isEdited ? 'Edited version ready to copy' : 'Latest generated version'}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Generate a prompt to edit and copy it here."
        className="custom-scroll min-h-52 w-full resize-y whitespace-pre-wrap rounded-md border border-panelBorder bg-slate-950/70 p-3 text-xs leading-5 text-slate-200 outline-none focus:border-accent"
      />
    </div>
  );
}

export default PromptPreview;
