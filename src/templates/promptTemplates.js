export const DEFAULT_TEMPLATES = {
  'Explain Error': `You are a patient debugging mentor.\n\nTask:\nExplain the error in beginner-friendly language and help fix it.\n\nOutput format:\n1) What the error means\n2) Likely root causes\n3) Minimal fix\n4) Improved fix\n5) How to avoid this in the future\n\nContext from developer:\n{{content}}`,

  'Teach Concept': `You are a clear and practical coding teacher.\n\nTask:\nTeach the concept behind the following code/question.\n\nOutput format:\n1) Simple definition\n2) Real-world analogy\n3) Short code example\n4) Common mistakes\n5) Mini practice exercise\n\nContext:\n{{content}}`,

  'Why This Works': `You are explaining a code solution deeply.\n\nTask:\nBreak down exactly why this works and why each line matters.\n\nOutput format:\n1) Problem this solves\n2) Line-by-line reasoning\n3) Hidden assumptions\n4) Complexity/performance notes\n5) Safer alternatives\n\nCode/context:\n{{content}}`,

  'Hint Only': `You are a mentor giving guidance without full answers.\n\nTask:\nGive hints only. Do not provide a full solution.\n\nOutput format:\n1) First hint\n2) Second hint\n3) Third hint\n4) What to try next\n\nProblem/context:\n{{content}}`,

  'Debug This': `You are a senior engineer debugging code with the user.\n\nTask:\nDebug this systematically and propose fixes.\n\nOutput format:\n1) What appears broken\n2) Reproduction checklist\n3) Potential causes ranked by confidence\n4) Fix options\n5) Verification steps\n\nCode/error/context:\n{{content}}`,

  'Optimize Code': `You are a performance-focused software engineer.\n\nTask:\nOptimize this code while preserving behavior.\n\nOutput format:\n1) Current bottlenecks\n2) Faster version\n3) Memory impact\n4) Readability tradeoffs\n5) Bench/testing approach\n\nCode/context:\n{{content}}`,

  'Beginner Friendly Explanation': `You are teaching a complete beginner.\n\nTask:\nExplain this in very simple language with no jargon unless defined.\n\nOutput format:\n1) Plain English overview\n2) Glossary of terms\n3) Tiny example\n4) Step-by-step walkthrough\n5) Quick recap\n\nInput:\n{{content}}`,

  'Step-by-Step Learning': `You are building a short learning plan for a developer.\n\nTask:\nTurn this topic/problem into a practical step-by-step learning flow.\n\nOutput format:\n1) Starting point\n2) Step sequence\n3) Practice checkpoint per step\n4) Common blockers\n5) Final challenge\n\nContext:\n{{content}}`,

  'Explain Internals': `You are a systems-minded software mentor.\n\nTask:\nExplain internal mechanics behind this code/tooling behavior.\n\nOutput format:\n1) Internal flow\n2) Key components involved\n3) Data/control flow\n4) Edge cases\n5) Debug tips\n\nContext:\n{{content}}`
};

export function getPromptModes(templates) {
  return Object.keys(templates || {});
}

export function buildPrompt(mode, content, templates = DEFAULT_TEMPLATES) {
  const safeContent = (content || '').trim() || 'No content provided. Ask clarifying questions before answering.';
  const fallbackTemplate = templates['Debug This'] || DEFAULT_TEMPLATES['Debug This'];
  const selectedTemplate = templates[mode] || fallbackTemplate;

  if (!selectedTemplate.includes('{{content}}')) {
    return `${selectedTemplate}\n\nContext:\n${safeContent}`;
  }

  return selectedTemplate.replace(/\{\{content\}\}/g, safeContent);
}
