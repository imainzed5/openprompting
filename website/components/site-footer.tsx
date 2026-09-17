import Link from 'next/link';

export function SiteFooter({ repoUrl }: { repoUrl: string }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col footer__col--brand">
          <span className="footer__mark">&gt;_</span>
          <p className="footer__pitch">A local-first, source-backed field guide for the model, harness, and task you are actually using.</p>
          <span className="footer__meta">Open source · MIT licensed</span>
        </div>
        <nav className="footer__col" aria-label="Catalog">
          <h2 className="footer__h">Browse</h2>
          <Link href="/models">Models</Link>
          <Link href="/harnesses">Harnesses</Link>
          <Link href="/tasks">Tasks</Link>
        </nav>
        <nav className="footer__col" aria-label="Learn">
          <h2 className="footer__h">Learn</h2>
          <Link href="/docs">Concepts</Link>
          <Link href="/docs#evidence">Evidence model</Link>
          <Link href="/contributing">Contributing</Link>
        </nav>
        <nav className="footer__col" aria-label="Install">
          <h2 className="footer__h">Install</h2>
          <code className="footer__code">npm i -g openprompting</code>
          <Link href="/start">Getting started →</Link>
          <a href={`${repoUrl}/releases`} rel="noreferrer">Releases ↗</a>
        </nav>
      </div>
      <div className="footer__base">
        <span>Local-first. No account, no API key, no telemetry.</span>
        <span className="mono">© openPrompting contributors</span>
      </div>
    </footer>
  );
}
