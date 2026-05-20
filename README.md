# AI Sidekick

AI Sidekick is a lightweight floating Electron desktop companion for developers.
It helps you generate high-quality prompts for debugging and learning workflows without leaving your coding setup.

## Stack

- Electron
- React
- Vite
- TailwindCSS
- JavaScript

## Features

- Always-on-top floating window
- Draggable custom header and resizable sidebar layout
- Prompt modes for learning and debugging
- Smart prompt generation from pasted errors/code/questions
- Clipboard quick paste + copy prompt
- One-click ChatGPT open (`https://chatgpt.com`)
- Optional auto-copy prompt before opening ChatGPT
- Prompt history with local persistence
- Clear actions and copy/generate/open keyboard shortcuts
- OCR-ready architecture placeholder (`src/services/ocrService.js`)

## Project Structure

```text
.
â”œâ”€â”€ electron/
â”‚   â”œâ”€â”€ main.js
â”‚   â””â”€â”€ preload.js
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ Header.jsx
â”‚   â”‚   â”œâ”€â”€ HistoryList.jsx
â”‚   â”‚   â”œâ”€â”€ ModeSelector.jsx
â”‚   â”‚   â”œâ”€â”€ PromptInput.jsx
â”‚   â”‚   â”œâ”€â”€ PromptPreview.jsx
â”‚   â”‚   â””â”€â”€ Toast.jsx
â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â””â”€â”€ usePersistentState.js
â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ ocrService.js
â”‚   â”‚   â””â”€â”€ promptService.js
â”‚   â”œâ”€â”€ styles/
â”‚   â”‚   â””â”€â”€ index.css
â”‚   â”œâ”€â”€ templates/
â”‚   â”‚   â””â”€â”€ promptTemplates.js
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â””â”€â”€ storage.js
â”‚   â”œâ”€â”€ App.jsx
â”‚   â””â”€â”€ main.jsx
â”œâ”€â”€ index.html
â”œâ”€â”€ package.json
â”œâ”€â”€ postcss.config.cjs
â”œâ”€â”€ tailwind.config.cjs
â””â”€â”€ vite.config.js
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Run in development mode

```bash
npm run dev
```

This starts:
- Vite dev server on port `5173`
- Electron window connected to that dev server

## Build

```bash
npm run build
```

This creates the renderer production bundle in `dist/`.

## Run Electron App (with built assets)

```bash
npm run start
```

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter` -> Generate prompt
- `Ctrl/Cmd + Shift + C` -> Copy generated prompt
- `Ctrl/Cmd + Shift + O` -> Open ChatGPT
- `Ctrl/Cmd + L` -> Clear input/output

## Security Notes

- `contextIsolation` enabled
- `nodeIntegration` disabled
- Renderer uses a minimal secure preload bridge for IPC

## Future Extensions

- OCR implementation in `ocrService.js`
- Screenshot capture pipeline
- VS Code extension bridge
- local AI model integration
- automatic error/context detection
