import type { Command } from 'commander';
import type { CliEnvironment } from '../cli-environment.js';
import { renderDoctor } from '../doctor/render.js';
import { runDoctor } from '../doctor/run.js';

export const addDoctorCommand = (program: Command, environment: CliEnvironment): void => {
  const command = program
    .command('doctor')
    .description('Run read-only local openPrompting diagnostics')
    .option('--profile <id>', 'verify one configured profile explicitly');
  command.action(async (options: { profile?: string }) => {
    const report = await runDoctor(environment.cwd, {
      now: environment.now(),
      ...(options.profile ? { profile: options.profile } : {}),
    });
    environment.output.write(renderDoctor(report));
    if (report.hasFailures) environment.setExitCode(1);
  });
};
