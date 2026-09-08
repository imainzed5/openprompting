import { readFile } from 'node:fs/promises';

const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
const requiredSnippets = [
  'npm install --global openprompting',
  'openprompting setup',
  'openprompting guide',
  'openprompting new feature',
  'openprompting doctor',
  'openprompting compare builder reviewer',
  'version: 1',
  'google-gemini-3-8-flash',
  'gemini-cli',
];

const missing = requiredSnippets.filter((snippet) => !readme.includes(snippet));
if (missing.length > 0) {
  process.stderr.write(`README verification failed; missing: ${missing.join(', ')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`README verification passed (${requiredSnippets.length} required V1 examples).\n`);
}
