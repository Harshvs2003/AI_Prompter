import { DEFAULT_TEMPLATES, buildPrompt, getPromptModes } from '../templates/promptTemplates';

export function generatePrompt({ mode, input, templates }) {
  const effectiveTemplates = templates || DEFAULT_TEMPLATES;
  return buildPrompt(mode, input, effectiveTemplates);
}

export function getModes(templates) {
  return getPromptModes(templates || DEFAULT_TEMPLATES);
}
