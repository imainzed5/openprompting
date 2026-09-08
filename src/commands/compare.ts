import type { Command } from 'commander';
import type { CliEnvironment } from '../cli-environment.js';
import { compareEntities } from '../compare/resolve.js';
import { renderComparison } from '../compare/render.js';
import { readConfig } from '../config/read.js';
import { loadKnowledge } from '../knowledge/load.js';

export const addCompareCommand = (program: Command, environment: CliEnvironment): void => {
  const command = program
    .command('compare <a> <b>')
    .description('Compare profiles, setups, models, or harnesses using documented evidence');
  command.action(async (leftId: string, rightId: string) => {
    try {
      const knowledge = await loadKnowledge();
      const config = await readConfig(environment.cwd, knowledge, { required: false });
      environment.output.write(renderComparison(compareEntities(leftId, rightId, config, knowledge)));
    } catch (error) {
      command.error(error instanceof Error ? error.message : String(error), { exitCode: 2 });
    }
  });
};
