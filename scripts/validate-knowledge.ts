import { loadKnowledge } from '../src/knowledge/load.js';
import { validateTaskTemplateIntegrity } from '../src/knowledge/integrity.js';

try {
  const index = await loadKnowledge();
  await validateTaskTemplateIntegrity(index);
  process.stdout.write(`Knowledge valid: ${index.models.size} model(s), ${index.harnesses.size} harness(es), ${index.tasks.size} task(s)\n`);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
