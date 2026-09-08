import { describe, expect, it } from 'vitest';
import { createProgram } from '../../src/cli-program.js';

const run = async (args: string[]): Promise<{ stdout: string; stderr: string; error?: unknown }> => {
  let stdout = '';
  let stderr = '';
  const output = {
    writeOut: (text: string): void => { stdout += text; },
    writeErr: (text: string): void => { stderr += text; },
  };
  const program = createProgram().exitOverride().configureOutput(output);
  for (const command of program.commands) command.exitOverride().configureOutput(output);
  try {
    await program.parseAsync(['node', 'openprompting', ...args]);
    return { stdout, stderr };
  } catch (error) {
    return { stdout, stderr, error };
  }
};

describe('CLI command contract', () => {
  it('shows help and examples successfully', async () => {
    const result = await run(['help']);
    expect(result.error).toBeUndefined();
    expect(result.stdout).toContain('Usage: openprompting');
    expect(result.stdout).toContain('openprompting new feature');
  });

  it.each(['setup', 'guide', 'new', 'doctor', 'compare'])('%s exposes command help', async (command) => {
    const result = await run([command, '--help']);
    expect(result.stdout).toContain(`Usage: openprompting ${command}`);
    expect((result.error as { exitCode?: number } | undefined)?.exitCode).toBe(0);
  });

  it('fails clearly for an unknown command', async () => {
    const result = await run(['unknown']);
    expect((result.error as { exitCode?: number } | undefined)?.exitCode).not.toBe(0);
    expect(result.stderr).toContain("unknown command 'unknown'");
  });

});
