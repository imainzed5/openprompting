import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@/components/knowledge-content';
import { NPM_INSTALL } from '@/lib/knowledge';
import { PageHeader } from '@/components/page-header';

export const metadata: Metadata = { title: 'Get started', description: 'Install openPrompting, configure your setup, read guidance, and create a deterministic task prompt.', alternates: { canonical: '/start' } };

const steps = [
  ['Install', 'Global install via npm. Node.js 20 or newer is required. No post-install network calls.', NPM_INSTALL],
  ['Configure', 'Record the model and harness you are using, with optional profiles and task routes. Previews YAML before writing.', 'openprompting setup'],
  ['Browse guidance', 'Read the guidance for the resolved model and harness, with evidence and sources.', 'openprompting guide'],
  ['Create a task prompt', 'Render an editable, structured prompt skeleton for the task at hand.', 'openprompting new planning'],
  ['Inspect configuration', 'Run read-only diagnostics over config, routing, instruction files, and knowledge freshness.', 'openprompting doctor'],
] as const;

export default function StartPage() {
  return <><PageHeader title="Get started" lede="openPrompting is a CLI. Node.js and a terminal are enough — no account, no API key, no editor plugin." /><section className="section"><div className="wrap"><ol className="steps">{steps.map(([title, description, command], index) => <li className="step" key={title}><div className="step__n">{String(index + 1).padStart(2, '0')}</div><div><div className="step__t">{title}</div><div className="step__d">{description}</div></div><div className="step__code"><CodeBlock command={command} /></div></li>)}</ol><div className="two-col mt-8"><div className="panel"><h3>What runs locally</h3><ul><li>Guidance resolution reads from the local knowledge base.</li><li>Configuration is stored in project-local <span className="mono">.openprompting/config.yml</span>.</li><li>No model calls, no telemetry, no account.</li></ul></div><div className="panel panel--avoid"><h3>What openPrompting is not</h3><ul><li>Not a collection of one-thousand prompts.</li><li>Not a model-powered prompt generator.</li><li>Not a leaderboard, SaaS platform, or orchestration product.</li></ul></div></div><div className="mt-8"><Link className="btn" href="/models">Browse the catalog →</Link></div></div></section></>;
}
