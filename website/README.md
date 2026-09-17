# openPrompting website

The public field guide is a Next.js App Router site. It keeps the approved
Muse Spark visual direction while rendering catalog pages from the repository's
canonical Markdown files.

## Architecture

- `app/` — App Router routes, metadata, sitemap, robots, and 404 handling.
- `components/` — shared shell, catalog rows/filtering, explorer, evidence,
  templates, and copy interactions.
- `lib/knowledge.ts` — typed build-time loader for `../knowledge` and
  `../templates`; malformed metadata fails the build with a file-specific error.
- `lib/markdown.ts` — restrained `remark`/`rehype` Markdown pipeline.
- `app/globals.css` — extracted visual system from the former Muse Spark site,
  with Tailwind CSS v4 available for local composition.

Adding a valid Markdown file to `knowledge/models/`, `knowledge/harnesses/`, or
`knowledge/tasks/` is enough for its directory row, detail route, metadata, and
sitemap entry to be generated. Tasks must have a matching `templates/<id>.md`.
Existing IDs are used as stable, deterministic route slugs.

## Development

```sh
pnpm install --ignore-workspace --no-optional
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

The loader reads the sibling repository checkout by default. Set
`OPENPROMPTING_REPO` when building against a different checkout.

## Deployment

### GitHub Pages

The site is configured as a Next.js static export. The production build writes
the deployable artifact to `out/` (when run from this directory), or
`website/out/` when run from the repository root. The repository workflow at
`.github/workflows/deploy-pages.yml` installs both lockfiles, validates the
knowledge base, builds the website, and publishes that artifact through
GitHub Pages.

In the repository settings, set Pages → Build and deployment → Source to
**GitHub Actions**. The initial site URL is:

`https://imainzed5.github.io/openprompting/`

The Pages workflow sets the site URL and Next.js base path for that project
subpath, so internal navigation, metadata, and static assets resolve correctly.
There is no custom-domain configuration yet. If a custom domain is added later,
update the Pages workflow's site URL/base-path settings and configure the domain
in GitHub Pages; the hosting workflow can remain the same.

GitHub Pages serves static files only. This site is compatible because its
repository content is read at build time and its filters/selectors run in the
browser. Runtime API routes, server actions, database access, and other server
features would require a different host.

### Vercel

The site remains compatible with Vercel as a static export. The repository
configuration points its build output at `website/out` and uses the same
repository-level build command.
