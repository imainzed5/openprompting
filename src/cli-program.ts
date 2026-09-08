import { Command } from 'commander';
import type { CliEnvironment } from './cli-environment.js';
import { processEnvironment } from './cli-environment.js';
import { addGuideCommand } from './commands/guide.js';
import { addCompareCommand } from './commands/compare.js';
import { addDoctorCommand } from './commands/doctor.js';
import { addHelpCommand } from './commands/help.js';
import { addNewCommand } from './commands/new.js';
import { addSetupCommand } from './commands/setup.js';

export const createProgram = (environment: CliEnvironment = processEnvironment()): Command => {
  const program = new Command();
  program
    .name('openprompting')
    .description('Source-backed guidance for AI models, harnesses, and recurring tasks')
    .version('1.0.0')
    .showHelpAfterError()
    .addHelpText(
      'after',
      `\nExamples:\n  openprompting help\n  openprompting setup\n  openprompting guide --profile reviewer\n  openprompting new feature\n  openprompting doctor\n  openprompting compare builder reviewer\n`,
    );

  addHelpCommand(program);
  addSetupCommand(program, environment);
  addGuideCommand(program, environment);
  addNewCommand(program, environment);
  addDoctorCommand(program, environment);
  addCompareCommand(program, environment);

  return program;
};
