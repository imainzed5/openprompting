import { readFile } from 'node:fs/promises';

const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
const requiredSnippets = [
  'npm install --global openprompting',
  'openprompting@1.1.1',
  'openprompting setup',
  'openprompting guide',
  'openprompting new feature',
  'openprompting doctor',
  'openprompting compare builder reviewer',
  'version: 1',
  'openprompting new planning',
  'openprompting new research',
  'openprompting new testing',
  'openprompting new migration',
  'openai-gpt-5-3-codex',
  'anthropic-claude-opus-5',
  'github-copilot-cli',
  'opencode',
  'aider',
  'google-gemini-3-8-flash',
  'gemini-cli',
  'RELEASE_NOTES_1.1.1.md',
];

const missing = requiredSnippets.filter((snippet) => !readme.includes(snippet));
if (missing.length > 0) {
  process.stderr.write(`README verification failed; missing: ${missing.join(', ')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`README verification passed (${requiredSnippets.length} required snippets).\n`);
}
