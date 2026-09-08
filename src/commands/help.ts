import type { Command } from 'commander';

export const addHelpCommand = (program: Command): void => {
  program
    .command('help')
    .description('Show commands and common examples')
    .action(() => program.outputHelp());
};
