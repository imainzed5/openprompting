import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { EvidenceCards } from '@/components/knowledge-content';
import { CLI_COMMANDS, PROMPTING_MATERIAL, REPO_URL, TERMINOLOGY, getCatalog } from '@/lib/knowledge';

export const metadata: Metadata = { title: 'Concepts, terminology, and evidence model', description: 'Definitions for openPrompting vocabulary, evidence classes, freshness bands, commands, and repository references.', alternates: { canonical: '/docs' } };

function CommandList() {
  return <div className="cli">{CLI_COMMANDS.map((command) => <div className="cli__row" key={command.cmd}><code className="cli__cmd">openprompting {command.cmd}</code><div className="cli__desc">{command.desc}<span className="cli__ex mono">{command.example}</span></div></div>)}</div>;
}

const docs = [
  ['Command reference', 'docs/commands/README.md', 'Selectors, resolution rules, output, and exit behavior.'],
  ['Models, harnesses, setups, and profiles', 'docs/concepts/models-harnesses-and-profiles.md', 'How layers compose and how task routing resolves.'],
  ['Knowledge and evidence', 'docs/concepts/knowledge-and-evidence.md', 'Entry format, evidence classes, and sourcing rules.'],
  ['V1 contracts', 'docs/release/V1_CONTRACTS.md', 'Stable executable, commands, config schema, and vocabulary.'],
  ['Migration from pre-V1 builds', 'docs/release/MIGRATION.md', 'What changed and how to move forward.'],
  ['Release notes 1.1.0', 'docs/release/RELEASE_NOTES_1.1.0.md', 'Expanded catalog: models, harnesses, tasks.'],
  ['Release notes 1.1.1', 'docs/release/RELEASE_NOTES_1.1.1.md', 'Documentation patch in the 1.1 line.'],
  ['Changelog', 'CHANGELOG.md', 'All notable changes, SemVer.'],
  ['Contributing', 'CONTRIBUTING.md', 'Entry template, source checks, PR expectations.'],
] as const;

export default async function DocsPage() {
  const catalog = await getCatalog();
  return <><PageHeader title="Docs" lede="Short, practical definitions for the terms openPrompting uses — plus the evidence model, freshness bands, commands, and links into the repository docs." /><section className="section"><div className="wrap"><div className="eyebrow">§ 01 — Terminology</div><h2 className="mt-2">The words that matter.</h2><dl className="concepts">{TERMINOLOGY.map(([term, definition]) => <div className="concept" key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl><div className="mt-8 prose-narrow"><h3>Prompting is not magic words.</h3><p className="mt-3 dim">Good prompting is generally less about phrasing and more about supplying an agent with useful material:</p><ul className="prose-list mt-3">{PROMPTING_MATERIAL.map(([term, definition]) => <li key={term}><strong>{term}</strong> — {definition}</li>)}</ul></div><section className="block" id="evidence"><h2>Evidence model</h2><div className="prose-narrow"><p className="dim">Each knowledge entry carries structured source metadata and a verification date. Every claim is classified into one of four evidence classes; entries also record <em>last verified</em> and per-source <em>last checked</em> dates.</p></div><EvidenceCards compact /></section><section className="block" id="freshness"><h2>Freshness bands</h2><div className="prose-narrow"><p className="dim">The CLI’s <span className="mono">doctor</span> command reads <em>last verified</em> as a maintenance signal — a prompt to review an entry, not a correctness verdict:</p><ul className="prose-list"><li><strong>0–60 days:</strong> current.</li><li><strong>61–120 days:</strong> review suggested.</li><li><strong>121+ days:</strong> stale.</li></ul><p className="dim">This site shows the same band on every entry. The catalog currently holds <strong>{catalog.models.length} models, {catalog.harnesses.length} harnesses, and {catalog.tasks.length} tasks</strong>.</p></div></section><section className="block" id="commands"><h2>Commands</h2><CommandList /><p className="small dim mt-4">Successful commands exit 0; failures exit nonzero. Only <span className="mono">setup</span> writes project state; <span className="mono">doctor</span> is read-only.</p></section><section className="block"><h2>Repository docs</h2><p className="dim prose-narrow">The reference lives with the code. These links open the current files on GitHub:</p><ul className="doclinks">{docs.map(([title, path, description]) => <li key={path}><a href={`${REPO_URL}/blob/main/${path}`} rel="noreferrer">{title} ↗</a><span>{description}</span></li>)}</ul></section></div></section></>;
}
