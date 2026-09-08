import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

interface PackedFile {
  path: string;
}

interface PackResult {
  filename: string;
  files: PackedFile[];
}

interface PackageManifest {
  version: string;
  bin: Record<string, string>;
}

const packageManagerInvocation = (command: string, args: string[]): [string, string[]] => {
  if (command === 'pnpm' && process.env.npm_execpath) {
    return [process.execPath, [process.env.npm_execpath, ...args]];
  }

  if (command === 'npm') {
    const executableDirectory = path.dirname(process.execPath);
    const candidates = process.platform === 'win32'
      ? [path.join(executableDirectory, 'node_modules', 'npm', 'bin', 'npm-cli.js')]
      : [
          path.resolve(executableDirectory, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
          path.resolve(executableDirectory, '..', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
        ];
    const npmCli = candidates.find((candidate) => existsSync(candidate));
    if (npmCli) return [process.execPath, [npmCli, ...args]];
  }

  return [command, args];
};

const run = (command: string, args: string[], cwd: string): string => {
  const [executable, executableArgs] = packageManagerInvocation(command, args);
  const result = spawnSync(executable, executableArgs, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed (${result.status ?? 'no status'})\n${result.stdout}${result.stderr}`,
    );
  }
  return `${result.stdout}${result.stderr}`;
};

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const scratch = await mkdtemp(path.join(tmpdir(), 'openprompting-package-'));

try {
  const sourcePackage = JSON.parse(
    await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'),
  ) as PackageManifest;
  const packedOutput = run('pnpm', ['pack', '--json', '--pack-destination', scratch], repositoryRoot);
  const packed = JSON.parse(packedOutput) as PackResult;
  const paths = new Set(packed.files.map((file) => file.path.replaceAll('\\', '/')));
  const required = [
    'dist/cli.js',
    'dist/index.js',
    'README.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'LICENSE',
    'docs/commands/README.md',
    'docs/concepts/knowledge-and-evidence.md',
    'docs/release/V1_CONTRACTS.md',
    'schemas/config.schema.json',
    'templates/feature.md',
    'knowledge/models/google-gemini-3-8-flash.md',
    'knowledge/harnesses/gemini-cli.md',
    'knowledge/tasks/feature.md',
  ];
  const forbidden = [
    'src/',
    'tests/',
    '.github/',
    'docs/milestones/',
    'docs/phase-prompts/',
    'docs/PLANNING.md',
    'node_modules/',
  ];
  const missing = required.filter((item) => !paths.has(item));
  const junk = [...paths].filter(
    (item) => item.endsWith('/.gitkeep') || forbidden.some((prefix) => item.startsWith(prefix)),
  );
  if (missing.length > 0 || junk.length > 0) {
    throw new Error(`Package audit failed. Missing: ${missing.join(', ') || 'none'}. Forbidden: ${junk.join(', ') || 'none'}.`);
  }

  const consumer = path.join(scratch, 'consumer');
  await mkdir(consumer);
  await writeFile(path.join(consumer, 'package.json'), '{"private":true}\n');
  run('npm', ['install', '--ignore-scripts', packed.filename], consumer);

  const cli = path.join(consumer, 'node_modules', 'openprompting', 'dist', 'cli.js');
  const invoke = (...args: string[]): string => run(process.execPath, [cli, ...args], consumer);
  const version = invoke('--version');
  if (version.trim() !== sourcePackage.version) throw new Error(`Packed CLI version mismatch: ${version}`);
  invoke('help');

  const configDirectory = path.join(consumer, '.openprompting');
  await mkdir(configDirectory);
  await writeFile(
    path.join(configDirectory, 'config.yml'),
    `version: 1
setups:
  gpt-codex:
    model: openai-gpt-6-astra
    harness: codex
  claude-review:
    model: anthropic-claude-sonnet-5
    harness: claude-code
profiles:
  builder:
    uses: gpt-codex
    role: implementation
  reviewer:
    uses: claude-review
    role: review
defaults:
  profile: builder
  tasks:
    review: reviewer
`,
  );
  invoke('setup', '--check');
  invoke('guide');
  invoke('guide', '--profile', 'reviewer');
  invoke('guide', '--model', 'google-gemini-3-8-flash');
  invoke('guide', '--harness', 'gemini-cli');
  invoke('guide', 'codex');
  invoke('new', 'feature');
  invoke('new', 'review', '--profile', 'reviewer');
  invoke('doctor');
  invoke('doctor', '--profile', 'reviewer');
  const comparison = invoke('compare', 'builder', 'reviewer');
  if (!comparison.includes('No universal winner is inferred.')) {
    throw new Error('Packed compare output omitted the no-ranking guarantee.');
  }
  invoke('compare', 'gpt-codex', 'claude-review');
  invoke('compare', 'openai-gpt-6-astra', 'anthropic-claude-sonnet-5');
  invoke('compare', 'codex', 'gemini-cli');

  const installedPackage = JSON.parse(
    await readFile(path.join(consumer, 'node_modules', 'openprompting', 'package.json'), 'utf8'),
  ) as { version?: string; bin?: Record<string, string> };
  if (
    installedPackage.version !== sourcePackage.version
    || installedPackage.bin?.openprompting !== sourcePackage.bin.openprompting
  ) {
    throw new Error('Installed package metadata does not match the frozen V1 contract.');
  }

  process.stdout.write(`Packed artifact verified: ${paths.size} files; install and V1 command journey passed.\n`);
} finally {
  await rm(scratch, { recursive: true, force: true });
}
