'use client';

import { useState } from 'react';

export function CopyButton({ value, light = false, label = 'Copy' }: { value: string; light?: boolean; label?: string }) {
  const [status, setStatus] = useState<'idle' | 'done' | 'failed'>('idle');
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus('done');
    } catch {
      setStatus('failed');
    }
    window.setTimeout(() => setStatus('idle'), 1400);
  }
  const text = status === 'done' ? 'Copied' : status === 'failed' ? 'Copy failed' : label;
  return <button className={`codeblock__copy${light ? ' codeblock__copy--light' : ''}`} type="button" onClick={copy} aria-label={label === 'Copy' ? `Copy: ${value}` : label}>{text}</button>;
}
