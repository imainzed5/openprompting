import type { DoctorReport } from './types.js';

export const renderDoctor = (report: DoctorReport): string => {
  const counts = new Map<string, number>();
  for (const item of report.results) counts.set(item.level, (counts.get(item.level) ?? 0) + 1);
  const lines = report.results.map((item) => `${item.level.padEnd(4)} ${item.message}`);
  lines.push('', `Summary: ${counts.get('PASS') ?? 0} PASS, ${counts.get('INFO') ?? 0} INFO, ${counts.get('WARN') ?? 0} WARN, ${counts.get('FAIL') ?? 0} FAIL`);
  return `${lines.join('\n')}\n`;
};
