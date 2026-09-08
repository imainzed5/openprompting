import type { Command } from 'commander';
import type { CliEnvironment } from '../cli-environment.js';
import { readConfig } from '../config/read.js';
import { loadKnowledge } from '../knowledge/load.js';
import { renderGuide } from '../resolver/guide.js';
import { resolveGuide, type GuideSelectors } from '../resolver/setup.js';

export const addGuideCommand = (program: Command, environment: CliEnvironment): void => {
  const command = program
    .command('guide [knowledge-id]')
    .description('Display resolved model and harness guidance')
    .option('--profile <id>', 'resolve a configured profile')
    .option('--model <id>', 'show model guidance')
    .option('--harness <id>', 'show harness guidance');

  command.action(async (knowledgeId: string | undefined, options: { profile?: string; model?: string; harness?: string }) => {
    try {
      const knowledge = await loadKnowledge();
      const needsConfig = Boolean(options.profile) || (!knowledgeId && !options.model && !options.harness);
      const config = needsConfig ? await readConfig(environment.cwd, knowledge, { required: false }) : undefined;
      const selectors: GuideSelectors = {};
      if (knowledgeId) selectors.knowledgeId = knowledgeId;
      if (options.profile) selectors.profile = options.profile;
      if (options.model) selectors.model = options.model;
      if (options.harness) selectors.harness = options.harness;
      environment.output.write(renderGuide(resolveGuide(config, knowledge, selectors), environment.now()));
    } catch (error) {
      command.error(error instanceof Error ? error.message : String(error), { exitCode: 2 });
    }
  });
};
