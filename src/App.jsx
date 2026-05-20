import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import PromptInput from './components/PromptInput';
import PromptPreview from './components/PromptPreview';
import HistoryList from './components/HistoryList';
import TemplateManager from './components/TemplateManager';
import Toast from './components/Toast';
import { DEFAULT_TEMPLATES } from './templates/promptTemplates';
import { generatePrompt, getModes } from './services/promptService';
import { usePersistentState } from './hooks/usePersistentState';
import { STORAGE_KEYS } from './utils/storage';

const CHATGPT_URL = 'https://chatgpt.com';

function App() {
  const [mode, setMode] = usePersistentState(STORAGE_KEYS.mode, 'Explain Error');
  const [input, setInput] = usePersistentState(STORAGE_KEYS.input, '');
  const [output, setOutput] = usePersistentState(STORAGE_KEYS.output, '');
  const [history, setHistory] = usePersistentState(STORAGE_KEYS.history, []);
  const [autoCopyOpen, setAutoCopyOpen] = usePersistentState(STORAGE_KEYS.autoCopyOpen, true);
  const [chatgptOpenMode, setChatgptOpenMode] = usePersistentState(STORAGE_KEYS.chatgptOpenMode, 'same-window');
  const [templates, setTemplates] = usePersistentState(STORAGE_KEYS.customTemplates, DEFAULT_TEMPLATES);
  const [activeTab, setActiveTab] = usePersistentState(STORAGE_KEYS.activeTab, 'sidekick');

  const [toast, setToast] = useState({ show: false, message: '' });
  const [isOutputEdited, setIsOutputEdited] = useState(false);

  const modes = useMemo(() => getModes(templates), [templates]);
  const canGenerate = useMemo(() => input.trim().length > 0, [input]);

  useEffect(() => {
    if (!modes.includes(mode)) {
      setMode(modes[0] || 'Explain Error');
    }
  }, [mode, modes, setMode]);

  const pushHistory = useCallback(
    (nextMode, nextInput, nextOutput) => {
      const record = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        mode: nextMode,
        input: nextInput,
        output: nextOutput
      };

      setHistory((prev) => [record, ...prev].slice(0, 30));
    },
    [setHistory]
  );

  const showToast = useCallback((message) => {
    setToast({ show: true, message });
  }, []);

  const generate = useCallback(() => {
    const prompt = generatePrompt({ mode, input, templates });
    setOutput(prompt);
    setIsOutputEdited(false);
    pushHistory(mode, input, prompt);
    showToast('Prompt generated');
  }, [mode, input, templates, setOutput, pushHistory, showToast]);

  const copyPrompt = useCallback(async () => {
    if (!output.trim()) return;
    await window.electronAPI.writeClipboardText(output);
    showToast(isOutputEdited ? 'Edited prompt copied to clipboard' : 'Generated prompt copied to clipboard');
  }, [output, isOutputEdited, showToast]);

  const openChatGPT = useCallback(async () => {
    if (autoCopyOpen && output.trim()) {
      await window.electronAPI.writeClipboardText(output);
      showToast('Copied latest prompt and opened ChatGPT');
    }
    if (chatgptOpenMode === 'same-window' && window.electronAPI.openChatGPTWindow) {
      await window.electronAPI.openChatGPTWindow();
      return;
    }
    await window.electronAPI.openExternal(CHATGPT_URL);
  }, [autoCopyOpen, output, showToast, chatgptOpenMode]);

  const quickPaste = useCallback(async () => {
    const text = await window.electronAPI.readClipboardText();
    if (text && text.trim()) {
      setInput(text);
      showToast('Pasted from clipboard');
    }
  }, [setInput, showToast]);

  const clearAll = useCallback(() => {
    setInput('');
    setOutput('');
    setIsOutputEdited(false);
    showToast('Input and output cleared');
  }, [setInput, setOutput, showToast]);

  const onUseHistory = useCallback(
    (entry) => {
      setMode(entry.mode);
      setInput(entry.input);
      setOutput(entry.output);
      setIsOutputEdited(false);
      showToast('Loaded from history');
    },
    [setMode, setInput, setOutput, showToast]
  );

  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && key === 'enter') {
        e.preventDefault();
        generate();
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'c') {
        e.preventDefault();
        copyPrompt();
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'o') {
        e.preventDefault();
        openChatGPT();
      }

      if ((e.ctrlKey || e.metaKey) && key === 'l') {
        e.preventDefault();
        clearAll();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [generate, copyPrompt, openChatGPT, clearAll]);

  return (
    <div className="flex h-full w-full flex-col border border-panelBorder bg-slate-900/80">
      <Header />

      <main className="custom-scroll flex-1 space-y-3 overflow-auto p-3">
        <div className="grid grid-cols-2 gap-2 rounded-md border border-panelBorder bg-panelSoft p-1">
          <button
            onClick={() => setActiveTab('sidekick')}
            className={`rounded px-2 py-2 text-xs ${activeTab === 'sidekick' ? 'bg-cyan-700 text-cyan-50' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            Sidekick
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`rounded px-2 py-2 text-xs ${activeTab === 'templates' ? 'bg-cyan-700 text-cyan-50' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            Templates
          </button>
        </div>

        {activeTab === 'sidekick' && (
          <>
            <ModeSelector mode={mode} setMode={setMode} modes={modes} />
            <PromptInput value={input} onChange={setInput} />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={quickPaste}
                className="rounded-md border border-panelBorder bg-panelSoft px-2 py-2 text-xs text-slate-200 hover:border-accent"
              >
                Quick Paste
              </button>
              <button
                onClick={generate}
                disabled={!canGenerate}
                className="rounded-md bg-cyan-700 px-2 py-2 text-xs font-medium text-cyan-50 hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate Prompt
              </button>

              <button
                onClick={copyPrompt}
                disabled={!output.trim()}
                className="rounded-md border border-panelBorder bg-panelSoft px-2 py-2 text-xs text-slate-200 hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isOutputEdited ? 'Copy Edited Prompt' : 'Copy Prompt'}
              </button>
              <button
                onClick={openChatGPT}
                className="rounded-md border border-accentSoft bg-accentSoft/20 px-2 py-2 text-xs text-cyan-100 hover:bg-accentSoft/35"
              >
                Open ChatGPT
              </button>
            </div>

            <div className="flex items-center justify-between rounded-md border border-panelBorder bg-panelSoft px-2 py-2">
              <label className="text-xs text-slate-300" htmlFor="auto-copy-open">
                Auto-copy before opening ChatGPT
              </label>
              <input
                id="auto-copy-open"
                type="checkbox"
                checked={autoCopyOpen}
                onChange={(e) => setAutoCopyOpen(e.target.checked)}
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-panelBorder bg-panelSoft px-2 py-2">
              <label className="text-xs text-slate-300" htmlFor="chatgpt-open-mode">
                Open ChatGPT in
              </label>
              <select
                id="chatgpt-open-mode"
                value={chatgptOpenMode}
                onChange={(e) => setChatgptOpenMode(e.target.value)}
                className="rounded border border-panelBorder bg-slate-800 px-2 py-1 text-xs text-slate-100 outline-none focus:border-accent"
              >
                <option value="same-window">Same GPT Window</option>
                <option value="new-tab">New Browser Tab</option>
              </select>
            </div>

            <PromptPreview
              value={output}
              onChange={(value) => {
                setOutput(value);
                setIsOutputEdited(true);
              }}
              isEdited={isOutputEdited}
            />

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <p>Ctrl/Cmd + Enter: Generate</p>
              <p>Ctrl/Cmd + Shift + C: Copy</p>
              <p>Ctrl/Cmd + Shift + O: Open ChatGPT</p>
              <p>Ctrl/Cmd + L: Clear</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={clearAll}
                className="rounded-md border border-panelBorder bg-panelSoft px-2 py-2 text-xs text-slate-200 hover:border-rose-400"
              >
                Clear Input/Output
              </button>
              <button
                onClick={() => {
                  setHistory([]);
                  showToast('History cleared');
                }}
                className="rounded-md border border-panelBorder bg-panelSoft px-2 py-2 text-xs text-slate-200 hover:border-rose-400"
              >
                Clear History
              </button>
            </div>

            <HistoryList items={history} onUse={onUseHistory} onClearHistory={() => setHistory([])} />
          </>
        )}

        {activeTab === 'templates' && (
          <TemplateManager
            templates={templates}
            setTemplates={setTemplates}
            currentMode={mode}
            setCurrentMode={setMode}
            showToast={showToast}
          />
        )}
      </main>

      <Toast message={toast.message} show={toast.show} onDone={() => setToast({ show: false, message: '' })} />
    </div>
  );
}

export default App;
