import type { Command } from 'commander';
import type { CliEnvironment } from '../cli-environment.js';
import { readConfig } from '../config/read.js';
import { loadKnowledge } from '../knowledge/load.js';
import { renderTaskPrompt } from '../resolver/prompt.js';
import { resolveTask } from '../resolver/setup.js';
import { loadTemplate } from '../templates/load.js';

export const addNewCommand = (program: Command, environment: CliEnvironment): void => {
  const command = program
    .command('new <task>')
    .description('Render a deterministic task prompt skeleton')
    .option('--profile <id>', 'override configured task routing');

  command.action(async (taskId: string, options: { profile?: string }) => {
    try {
      const knowledge = await loadKnowledge();
      const config = await readConfig(environment.cwd, knowledge, { required: false });
      const resolved = resolveTask(config, knowledge, taskId, options.profile);
      const template = await loadTemplate(taskId);
      environment.output.write(renderTaskPrompt(resolved, template));
    } catch (error) {
      command.error(error instanceof Error ? error.message : String(error), { exitCode: 2 });
    }
  });
};
