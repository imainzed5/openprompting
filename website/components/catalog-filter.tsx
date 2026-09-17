'use client';

import { useMemo, useState } from 'react';
import type { CatalogEntry } from '@/lib/content-types';
import { KnowledgeRow } from './knowledge-row';

export function CatalogFilter({ entries, kind, label, empty }: { entries: CatalogEntry[]; kind: 'models' | 'harnesses' | 'tasks'; label: string; empty: string }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return entries;
    return entries.filter((entry) => `${entry.displayName} ${entry.id} ${'provider' in entry ? entry.provider : ''} ${entry.body}`.toLowerCase().includes(normalized));
  }, [entries, query]);
  return (
    <div className="toolbar-wrap">
      <div className="toolbar" role="search">
        <label className="search">
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <span className="sr-only">{label}</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${label}…`} autoComplete="off" />
        </label>
        <span className="toolbar__count" aria-live="polite">{filtered.length} / {entries.length}</span>
      </div>
      <ul className="indexlist">
        {filtered.map((entry) => <KnowledgeRow key={entry.id} entry={entry} kind={kind} />)}
      </ul>
      {!filtered.length && <div className="empty">{empty}</div>}
    </div>
  );
}
