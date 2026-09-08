export type FreshnessStatus = 'current' | 'review suggested' | 'stale';

export interface Freshness {
  ageDays: number;
  status: FreshnessStatus;
}

export const knowledgeFreshness = (lastVerified: string, now = new Date()): Freshness => {
  const verified = new Date(`${lastVerified}T00:00:00Z`);
  const ageDays = Math.max(0, Math.floor((now.getTime() - verified.getTime()) / 86_400_000));
  return {
    ageDays,
    status: ageDays <= 60 ? 'current' : ageDays <= 120 ? 'review suggested' : 'stale',
  };
};
