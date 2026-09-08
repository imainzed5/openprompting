export type DiagnosticLevel = 'PASS' | 'INFO' | 'WARN' | 'FAIL';

export interface DiagnosticResult {
  level: DiagnosticLevel;
  check: string;
  message: string;
}

export interface DoctorReport {
  results: DiagnosticResult[];
  hasFailures: boolean;
}
