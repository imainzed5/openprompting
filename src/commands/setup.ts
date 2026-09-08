import type { Command } from 'commander';
import type { CliEnvironment } from '../cli-environment.js';
import { ConfigError, SetupCancelledError } from '../config/errors.js';
import { configPathFor } from '../config/path.js';
import { ConsolePrompter } from '../config/prompter.js';
import { readConfig } from '../config/read.js';
import { setupProject } from '../config/setup.js';
import { loadKnowledge } from '../knowledge/load.js';

export const addSetupCommand = (program: Command, environment: CliEnvironment): void => {
  const command = program
    .command('setup')
    .description('Create or update local model and harness configuration')
    .option('--check', 'validate the existing config without changing it');

  command.action(async (options: { check?: boolean }) => {
    let prompter: ConsolePrompter | undefined;
    try {
      const knowledge = await loadKnowledge();
      if (options.check) {
        await readConfig(environment.cwd, knowledge);
        environment.output.write(`Config valid: ${configPathFor(environment.cwd)}\n`);
        return;
      }
      prompter = new ConsolePrompter(environment.input, environment.output);
      const result = await setupProject(environment.cwd, knowledge, prompter);
      environment.output.write(`Config written: ${result.path}\n`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      command.error(message, { exitCode: error instanceof ConfigError || error instanceof SetupCancelledError ? 2 : 1 });
    } finally {
      prompter?.close();
    }
  });
};
