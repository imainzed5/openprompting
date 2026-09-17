import Link from 'next/link';
import type { CatalogEntry, KnowledgeKind } from '@/lib/content-types';
import { formatDate, providerLabel, slugFor } from '@/lib/presentation';
import { parseTemplate, splitSections, summaryText } from '@/lib/markdown-utils';

function FreshnessChip({ entry }: { entry: CatalogEntry }) {
  const { status } = entry.freshness;
  const className = status === 'current' ? 'chip chip--acc' : status === 'stale' ? 'chip chip--ink' : 'chip';
  const label = status === 'current' ? 'Current' : status === 'stale' ? 'Stale' : 'Review suggested';
  return <span className={className}>{label} · verified {formatDate(entry.lastVerified)}</span>;
}

export function KnowledgeRow({ entry, kind }: { entry: CatalogEntry; kind: KnowledgeKind }) {
  const summary = summaryText(splitSections(entry.body));
  const provider = 'provider' in entry ? providerLabel(entry.provider) : '';
  const sub = kind === 'tasks' && entry.type === 'task'
    ? `Task · ${parseTemplate(entry.templateRaw).length} template fields`
    : `${provider} · ${entry.status}`;
  return (
    <li>
      <Link className="row" href={`/${kind}/${slugFor(entry)}`}>
        <div>
          <div className="row__title">{entry.displayName}</div>
          <div className="row__sub">{sub}</div>
          <div className="row__id mono">{entry.id}</div>
        </div>
        <div className="row__desc">{summary}</div>
        <div className="row__meta">
          {kind === 'harnesses' && entry.instructionFiles.length > 0 ? (
            <span className="row__files">{entry.instructionFiles.map((file) => <span className="chip chip--ink" key={file}>{file}</span>)}</span>
          ) : kind === 'tasks' ? (
            <span className="chips"><span className="chip">{entry.evidence.length} claims · {entry.sources.length} sources</span></span>
          ) : kind === 'models' ? (
            <span className="chips"><span className="chip">{provider}</span></span>
          ) : (
            <span className="chip">No declared files</span>
          )}
          <FreshnessChip entry={entry} />
        </div>
      </Link>
    </li>
  );
}
