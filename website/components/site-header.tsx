'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  ['Models', '/models', 'models'],
  ['Harnesses', '/harnesses', 'harnesses'],
  ['Tasks', '/tasks', 'tasks'],
  ['Docs', '/docs', 'docs'],
  ['Contribute', '/contributing', 'contributing'],
] as const;

export function SiteHeader({ active = '' }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = active || links.find(([, href]) => pathname === href || pathname.startsWith(`${href}/`))?.[2] || '';
  return (
    <header className="topbar" role="banner">
      <div className="topbar__inner">
        <Link className="brand" href="/" aria-label="openPrompting home" onClick={() => setOpen(false)}>
          <span className="brand__mark" aria-hidden="true">&gt;_</span>
          <span className="brand__name">openPrompting</span>
        </Link>
        <button
          className="navtoggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="navtoggle__bar" aria-hidden="true" />
          <span className="navtoggle__bar" aria-hidden="true" />
        </button>
        <nav id="primary-nav" className="nav" aria-label="Primary" data-open={open ? 'true' : undefined}>
          {links.map(([label, href, key]) => (
            <Link key={key} href={href} aria-current={current === key ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <a className="nav__gh" href="https://github.com/imainzed5/openprompting" rel="noreferrer">GitHub&nbsp;↗</a>
          <Link className="btn btn--sm btn--ink" href="/start" onClick={() => setOpen(false)}>Install</Link>
        </nav>
      </div>
    </header>
  );
}
