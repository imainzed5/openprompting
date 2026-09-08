import { loadKnowledge } from '../src/knowledge/load.js';

try {
  const index = await loadKnowledge();
  process.stdout.write(`Knowledge valid: ${index.models.size} model(s), ${index.harnesses.size} harness(es), ${index.tasks.size} task(s)\n`);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
