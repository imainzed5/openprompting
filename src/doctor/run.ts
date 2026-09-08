import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { OpenPromptingConfig } from '../config/types.js';
import { readConfig } from '../config/read.js';
import { configPathFor } from '../config/path.js';
import { knowledgeFreshness } from '../knowledge/freshness.js';
import { loadKnowledge, type LoadKnowledgeOptions } from '../knowledge/load.js';
import { resolveGuide } from '../resolver/setup.js';
import type { DiagnosticLevel, DiagnosticResult, DoctorReport } from './types.js';

export interface DoctorOptions extends LoadKnowledgeOptions {
  now?: Date;
  profile?: string;
}

const result = (level: DiagnosticLevel, check: string, message: string): DiagnosticResult => ({ level, check, message });

const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const packageChecks = async (projectRoot: string): Promise<DiagnosticResult[]> => {
  const path = join(projectRoot, 'package.json');
  if (!await exists(path)) return [result('INFO', 'package', 'No package.json detected; validation script inspection was skipped.')];
  let value: unknown;
  try {
    value = JSON.parse(await readFile(path, 'utf8')) as unknown;
  } catch (error) {
    return [result('WARN', 'package', `package.json exists but is not valid JSON: ${error instanceof Error ? error.message : String(error)}`)];
  }
  const scripts = typeof value === 'object' && value !== null && 'scripts' in value && typeof value.scripts === 'object' && value.scripts !== null
    ? value.scripts as Record<string, unknown>
    : {};
  const checks = [result('PASS', 'package', `package.json detected at ${path}.`)];
  for (const name of ['test', 'lint', 'build', 'typecheck']) {
    checks.push(typeof scripts[name] === 'string'
      ? result('PASS', `script:${name}`, `Script '${name}' is declared (not executed).`)
      : result('WARN', `script:${name}`, `No '${name}' script detected.`));
  }
  return checks;
};

export const runDoctor = async (projectRoot: string, options: DoctorOptions = {}): Promise<DoctorReport> => {
  const results: DiagnosticResult[] = [];
  const now = options.now ?? new Date();
  let knowledge;
  try {
    knowledge = await loadKnowledge(options);
    results.push(result('PASS', 'knowledge', `Knowledge loaded: ${knowledge.models.size} model(s), ${knowledge.harnesses.size} harness(es), ${knowledge.tasks.size} task(s).`));
    for (const entry of knowledge.all.values()) {
      const freshness = knowledgeFreshness(entry.metadata.last_verified, now);
      results.push(result(
        freshness.status === 'current' ? 'PASS' : 'WARN',
        `freshness:${entry.metadata.id}`,
        `${entry.metadata.id} was verified ${freshness.ageDays} day(s) ago: ${freshness.status}.`,
      ));
    }
  } catch (error) {
    results.push(result('FAIL', 'knowledge', error instanceof Error ? error.message : String(error)));
  }

  let config: OpenPromptingConfig | undefined;
  const configPath = configPathFor(projectRoot);
  if (!await exists(configPath)) {
    results.push(result('FAIL', 'config', `No config found at ${configPath}. Run 'openprompting setup'.`));
  } else if (knowledge) {
    try {
      config = await readConfig(projectRoot, knowledge);
      results.push(result('PASS', 'config', `Config version 1 is valid at ${configPath}.`));
    } catch (error) {
      results.push(result('FAIL', 'config', `${error instanceof Error ? error.message : String(error)} Back up the file and migrate it to the version 1 setups/profiles/defaults format.`));
    }
  } else {
    results.push(result('FAIL', 'config', 'Config references cannot be validated because knowledge did not load.'));
  }

  if (config && knowledge) {
    for (const [setupId, setup] of Object.entries(config.setups)) {
      results.push(result('PASS', `setup:${setupId}`, `Setup '${setupId}' resolves model '${setup.model}' with harness '${setup.harness}'.`));
    }
    const profiles = Object.entries(config.profiles ?? {});
    if (profiles.length === 0) results.push(result('INFO', 'profiles', 'No profiles configured; a single setup can still resolve by fallback.'));
    for (const [profileId, profile] of profiles) {
      results.push(result('PASS', `profile:${profileId}`, `Profile '${profileId}' references setup '${profile.uses}'.`));
    }
    const routes = Object.entries(config.defaults?.tasks ?? {});
    if (routes.length === 0) results.push(result('INFO', 'routing', 'No task-specific profile routes configured.'));
    for (const [taskId, profileId] of routes) {
      results.push(result('PASS', `route:${taskId}`, `Task '${taskId}' routes to profile '${profileId}'.`));
    }

    if (options.profile) {
      try {
        const resolved = resolveGuide(config, knowledge, { profile: options.profile });
        results.push(result('PASS', `selected-profile:${options.profile}`, `Profile '${options.profile}' resolves setup '${resolved.setupId}', model '${resolved.model?.metadata.id}', and harness '${resolved.harness?.metadata.id}'.`));
      } catch (error) {
        results.push(result('FAIL', `selected-profile:${options.profile}`, error instanceof Error ? error.message : String(error)));
      }
    }

    const harnessIds = new Set(Object.values(config.setups).map((setup) => setup.harness));
    for (const harnessId of [...harnessIds].sort()) {
      const harness = knowledge.harnesses.get(harnessId);
      for (const filename of harness?.metadata.instruction_files ?? []) {
        const path = join(projectRoot, filename);
        results.push(await exists(path)
          ? result('INFO', `instruction:${harnessId}:${filename}`, `${filename} detected for harness '${harnessId}'.`)
          : result('WARN', `instruction:${harnessId}:${filename}`, `${filename} was not found for harness '${harnessId}'.`));
      }
    }
  }

  results.push(...await packageChecks(projectRoot));
  return { results, hasFailures: results.some((item) => item.level === 'FAIL') };
};
