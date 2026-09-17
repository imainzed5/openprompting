import Link from 'next/link';

export default function NotFound() {
  return <section className="section"><div className="wrap notfound"><div className="eyebrow eyebrow--center">404</div><h1 className="mt-4">Not in the catalog.</h1><p className="lede mt-4">That entry does not exist. It may have been renamed, or it may not be part of the current knowledge base.</p><div className="mt-6 cta-row cta-row--center"><Link className="btn" href="/">Return to index</Link></div></div></section>;
}
