import Link from 'next/link';
import type { Catalog, CatalogEntry, KnowledgeKind, Source } from '@/lib/content-types';
import { EVIDENCE_DESCRIPTIONS, EVIDENCE_ORDER, formatDate, providerLabel, slugFor } from '@/lib/knowledge';
import { bulletsOf, parseTemplate, renderMarkdown, sectionByName, splitSections, summaryText, templatePlain } from '@/lib/markdown';
import { CopyButton } from './copy-button';
import { InlineText } from './inline-text';

export function FreshnessChip({ entry }: { entry: CatalogEntry }) {
  const { status } = entry.freshness;
  const className = status === 'current' ? 'chip chip--acc' : status === 'stale' ? 'chip chip--ink' : 'chip';
  const label = status === 'current' ? 'Current' : status === 'stale' ? 'Stale' : 'Review suggested';
  return <span className={className}>{label} · verified {formatDate(entry.lastVerified)}</span>;
}

export function CodeBlock({ command, large = false }: { command: string; large?: boolean }) {
  return (
    <div className="codeblock">
      <CopyButton value={command} />
      <pre className={`code${large ? ' code--lg' : ''}`} tabIndex={0}><span className="p" aria-hidden="true">$</span>{command}</pre>
    </div>
  );
}

export async function MarkdownContent({ markdown, className = 'prose' }: { markdown: string; className?: string }) {
  const html = await renderMarkdown(markdown);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export async function ContentBlock({ title, markdown = '', id, children }: { title: string; markdown?: string; id?: string; children?: React.ReactNode }) {
  return (
    <section className="block" id={id}>
      <h2>{title}</h2>
      {children ?? (markdown.trim() ? <MarkdownContent markdown={markdown} /> : <p className="small dim">None recorded.</p>)}
    </section>
  );
}

export function KnowledgeMetadata({ kind, entry }: { kind: KnowledgeKind; entry: CatalogEntry }) {
  const identifierLabel = kind === 'models' ? 'Model ID' : kind === 'harnesses' ? 'Harness ID' : 'Task ID';
  return (
    <aside className="detail__aside" aria-label="Entry metadata">
      <ul className="meta">
        {entry.type !== 'task' && <li><span className="k">Provider</span><span className="v">{providerLabel(entry.provider)}</span></li>}
        <li><span className="k">{identifierLabel}</span><span className="v mono">{entry.id}</span></li>
        <li><span className="k">Status</span><span className="v">{entry.status}</span></li>
        <li><span className="k">Freshness</span><span className="v"><FreshnessChip entry={entry} /></span></li>
        <li><span className="k">Evidence</span><span className="v">{entry.evidence.length} claim{entry.evidence.length === 1 ? '' : 's'}</span></li>
        <li><span className="k">Sources</span><span className="v">{entry.sources.length} linked</span></li>
        {kind === 'tasks' && <li><span className="k">Template</span><span className="v mono">templates/{entry.id}.md</span></li>}
        <li><span className="k">Entry</span><span className="v mono">{entry.entryPath}</span></li>
      </ul>
    </aside>
  );
}

export function EvidenceBadges({ entry }: { entry: CatalogEntry }) {
  const used = Array.from(new Set(entry.evidence.map((item) => item.class)));
  const ordered = [...EVIDENCE_ORDER.filter((item) => used.includes(item)), ...used.filter((item) => !EVIDENCE_ORDER.includes(item))];
  return <div className="chips" role="list" aria-label="Evidence classes used">{ordered.map((item) => <span className={`ev ev--${item}`} role="listitem" key={item}>{item}</span>)}</div>;
}

export function EvidenceList({ entry }: { entry: CatalogEntry }) {
  const sources = new Map(entry.sources.map((source) => [source.id, source]));
  return (
    <ul className="ev-list">
      {entry.evidence.map((evidence, index) => {
        const source = evidence.source ? sources.get(evidence.source) : undefined;
        return (
          <li className="ev-item" key={`${evidence.class}-${index}`}>
            <span className="ev-item__badge"><span className={`ev ev--${evidence.class}`}>{evidence.class}</span></span>
            <span className="ev-item__claim">
              {evidence.claim}
              {source && <><br /><a className="src-link" href={source.url} rel="noreferrer">{source.title} ↗</a></>}
              {!source && evidence.reproduction && <><br /><span className="src-link">Reproduction: {evidence.reproduction}</span></>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <ul className="sources">
      <li className="sources__head" aria-hidden="true"><span>Source</span><span>Last checked</span></li>
      {sources.map((source) => <li key={source.id}><span className="src-title"><a href={source.url} rel="noreferrer">{source.title} ↗</a></span><span className="src-meta mono">checked {formatDate(source.lastChecked)}</span></li>)}
    </ul>
  );
}

export function InstructionFiles({ files }: { files: string[] }) {
  if (!files.length) return <p className="small dim">No instruction files declared in this entry.</p>;
  return <><div className="chips">{files.map((file) => <span className="chip chip--ink" key={file}>{file}</span>)}</div><p className="small dim mt-3">Repository-level instruction files this harness reads. Treat their effective permissions as part of the setup.</p></>;
}

export function PromptTemplate({ entry }: { entry: Extract<CatalogEntry, { type: 'task' }> }) {
  const fields = parseTemplate(entry.templateRaw);
  if (!fields.length) return <p className="small dim">No template fields parsed.</p>;
  const plain = templatePlain(fields);
  return (
    <>
      <div className="template">
        <div className="template__head">
          <h3>Prompt skeleton — deterministic, no model call</h3>
          <CopyButton value={plain} light label="Copy prompt skeleton" />
        </div>
        <pre tabIndex={0}>{fields.map((field) => <span key={field.heading}><span className="field">{field.heading}</span>{'\n'}<span className="hint">{field.hint ? `[${field.hint}]` : '[describe…]'}</span>{'\n\n'}</span>)}</pre>
      </div>
      <p className="small dim mt-3">From <code className="mono">templates/{entry.id}.md</code>. Placeholders describe what to fill in; nothing here invents project facts.</p>
    </>
  );
}

export function KnowledgeEntryHeader({ kind, entry, summary }: { kind: KnowledgeKind; entry: CatalogEntry; summary: string }) {
  const label = kind === 'models' ? 'Models' : kind === 'harnesses' ? 'Harnesses' : 'Tasks';
  return (
    <header className="pagehead">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Index</Link><span className="sep" aria-hidden="true">/</span><Link href={`/${kind}`}>{label}</Link><span className="sep" aria-hidden="true">/</span><span aria-current="page">{entry.displayName}</span></nav>
        <h1 className="mt-4">{entry.displayName}</h1>
        {summary && <p className="lede">{summary}</p>}
      </div>
    </header>
  );
}

export function NeighborNav({ kind, catalog, entry }: { kind: KnowledgeKind; catalog: Catalog; entry: CatalogEntry }) {
  const list = catalog[kind];
  if (list.length < 2) return null;
  const index = list.findIndex((item) => item.id === entry.id);
  const previous = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  const noun = kind === 'models' ? 'model' : kind === 'harnesses' ? 'harness' : 'task';
  return <nav className="neighbors" aria-label={`More ${kind}`}><Link href={`/${kind}/${slugFor(previous)}`}><span className="neighbors__k">← Previous {noun}</span><span className="neighbors__n">{previous.displayName}</span></Link><Link href={`/${kind}/${slugFor(next)}`}><span className="neighbors__k">Next {noun} →</span><span className="neighbors__n">{next.displayName}</span></Link></nav>;
}

function sectionMarkdown(entry: CatalogEntry, name: string): string {
  const section = sectionByName(splitSections(entry.body), name);
  return section?.lines.join('\n').trim() ?? '';
}

export async function KnowledgeDetail({ kind, entry, catalog }: { kind: KnowledgeKind; entry: CatalogEntry; catalog: Catalog }) {
  const sections = splitSections(entry.body);
  const summary = summaryText(sections);
  const recommended = sectionMarkdown(entry, 'Recommended');
  const avoid = sectionMarkdown(entry, 'Avoid');
  const context = sectionMarkdown(entry, 'Context and tool-use notes');
  const limits = sectionMarkdown(entry, 'Known limitations');
  return (
    <>
      <KnowledgeEntryHeader kind={kind} entry={entry} summary={summary} />
      <div className="wrap"><div className="detail"><div>
        <ContentBlock title={kind === 'tasks' ? 'Purpose' : 'Summary'} markdown={summary} />
        {kind === 'harnesses' && <ContentBlock title="Instruction files" markdown=""><InstructionFiles files={entry.instructionFiles} /></ContentBlock>}
        <ContentBlock title="Recommended" markdown={recommended} />
        <ContentBlock title="Avoid" markdown={avoid} />
        {kind === 'tasks' && <section className="block"><h2>Prompt skeleton</h2><PromptTemplate entry={entry as Extract<CatalogEntry, { type: 'task' }>} /></section>}
        {context && <ContentBlock title="Context & tool use" markdown={context} />}
        {limits && <ContentBlock title="Known limitations" markdown={limits} />}
        <section className="block"><h2>Evidence</h2><EvidenceBadges entry={entry} /><EvidenceList entry={entry} /></section>
        <section className="block"><h2>Sources</h2><SourceList sources={entry.sources} /></section>
        <NeighborNav kind={kind} catalog={catalog} entry={entry} />
      </div><KnowledgeMetadata kind={kind} entry={entry} /></div></div>
    </>
  );
}

export function EvidenceCards({ compact = false }: { compact?: boolean }) {
  return <div className={`ev-grid${compact ? ' ev-grid--2' : ''}`}>{EVIDENCE_ORDER.map((item) => <div className="ev-card" key={item}><span className="tag"><span className={`ev ev--${item}`}>{item}</span></span><h4>{item.charAt(0).toUpperCase() + item.slice(1)}</h4><p>{EVIDENCE_DESCRIPTIONS[item]}</p></div>)}</div>;
}

export function SelectionPreview({ entry }: { entry: CatalogEntry }) {
  const sections = splitSections(entry.body);
  const recs = bulletsOf(sections, 'Recommended');
  return <div className="preview"><div className="preview__left"><div className="eyebrow">{entry.type === 'model' ? 'Model' : entry.type === 'harness' ? 'Harness' : 'Task'}</div><h3 className="mt-2 preview__name">{entry.displayName}</h3><p className="mt-3 small dim">{summaryText(sections)}</p><div className="mt-6"><ul className="meta">{entry.type !== 'task' && <li><span className="k">Provider</span><span className="v">{providerLabel(entry.provider)}</span></li>}<li><span className="k">Status</span><span className="v">{entry.status}</span></li><li><span className="k">Evidence</span><span className="v">{entry.evidence.length} claims · {entry.sources.length} sources</span></li><li><span className="k">Freshness</span><span className="v"><FreshnessChip entry={entry} /></span></li></ul></div>{entry.instructionFiles.length > 0 && <div className="mt-3"><span className="k-label">Instruction files</span><div className="chips">{entry.instructionFiles.map((file) => <span className="chip chip--ink" key={file}>{file}</span>)}</div></div>}<div className="mt-6"><Link className="btn btn--ghost btn--sm" href={`/${entry.type === 'model' ? 'models' : entry.type === 'harness' ? 'harnesses' : 'tasks'}/${slugFor(entry)}`}>Open entry →</Link></div></div><div className="preview__right"><section className="block"><h2>Recommended</h2><ul className="rec-list">{recs.map((item) => <li key={item}><InlineText value={item} /></li>)}</ul></section><section className="block"><h2>Evidence</h2><EvidenceList entry={entry} /></section></div></div>;
}
