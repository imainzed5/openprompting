'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { InlineText } from './inline-text';

export interface ExplorerEntry {
  id: string;
  displayName: string;
  recommended: string[];
}

interface Preset {
  model: string;
  harness: string;
  task: string;
  label: string;
}

export function GuidanceExplorer({ models, harnesses, tasks, presets, defaultSelection }: { models: ExplorerEntry[]; harnesses: ExplorerEntry[]; tasks: ExplorerEntry[]; presets: Preset[]; defaultSelection: { model: string; harness: string; task: string } }) {
  const [selection, setSelection] = useState(defaultSelection);
  const byId = useMemo(() => ({
    models: new Map(models.map((entry) => [entry.id, entry])),
    harnesses: new Map(harnesses.map((entry) => [entry.id, entry])),
    tasks: new Map(tasks.map((entry) => [entry.id, entry])),
  }), [models, harnesses, tasks]);
  const chosen = {
    model: byId.models.get(selection.model) ?? models[0],
    harness: byId.harnesses.get(selection.harness) ?? harnesses[0],
    task: byId.tasks.get(selection.task) ?? tasks[0],
  };
  if (!chosen.model || !chosen.harness || !chosen.task) return null;
  function update(key: keyof typeof selection, value: string) {
    setSelection((current) => ({ ...current, [key]: value }));
  }
  function choosePreset(preset: Preset) {
    setSelection({ model: preset.model, harness: preset.harness, task: preset.task });
  }
  const columns = [
    ['Model', chosen.model, 'models', 'Model guidance'],
    ['Harness', chosen.harness, 'harnesses', 'Harness behavior'],
    ['Task', chosen.task, 'tasks', 'Task structure'],
  ] as const;
  return (
    <>
      <div className="presets" role="group" aria-label="Example combinations">{presets.map((preset) => <button className="preset" type="button" key={preset.label} onClick={() => choosePreset(preset)} aria-pressed={preset.model === chosen.model.id && preset.harness === chosen.harness.id && preset.task === chosen.task.id}>{preset.label}</button>)}</div>
      <div className="diagram">
      <div className="slot"><label className="slot__label" htmlFor="op-model">AI model</label><select id="op-model" value={chosen.model.id} onChange={(event) => update('model', event.target.value)}>{models.map((entry) => <option value={entry.id} key={entry.id}>{entry.displayName}</option>)}</select></div>
      <span className="op" aria-hidden="true">+</span>
      <div className="slot"><label className="slot__label" htmlFor="op-harness">Coding tool</label><select id="op-harness" value={chosen.harness.id} onChange={(event) => update('harness', event.target.value)}>{harnesses.map((entry) => <option value={entry.id} key={entry.id}>{entry.displayName}</option>)}</select></div>
      <span className="op" aria-hidden="true">+</span>
      <div className="slot"><label className="slot__label" htmlFor="op-task">What are you doing?</label><select id="op-task" value={chosen.task.id} onChange={(event) => update('task', event.target.value)}>{tasks.map((entry) => <option value={entry.id} key={entry.id}>{entry.displayName}</option>)}</select></div>
      <span className="arrow" aria-hidden="true">↓</span>
      <div className="guidance" id="op-output" aria-live="polite">
        <div className="guidance__head"><h3>Guidance for this setup</h3><span className="mono">{chosen.model.displayName} · {chosen.harness.displayName} · {chosen.task.displayName}</span></div>
        <div className="guidance__body">{columns.map(([label, entry, kind, role]) => <div className="guidance__col" key={kind}><h4>{label} — {entry.displayName}</h4><span className="k-label">{role}</span><ul>{entry.recommended.map((item) => <li key={item}><InlineText value={item} /></li>)}</ul><Link className="guidance__more" href={`/${kind}/${entry.id}`}>Open {entry.displayName} entry →</Link></div>)}</div>
      </div>
      </div>
    </>
  );
}
