import Link from 'next/link';

export function PageHeader({ title, lede }: { title: string; lede: string }) {
  return <header className="pagehead"><div className="wrap"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Index</Link><span className="sep" aria-hidden="true">/</span><span aria-current="page">{title}</span></nav><h1 className="mt-4">{title}</h1>{lede && <p className="lede">{lede}</p>}</div></header>;
}
