# rmikulec.github.io

My personal portfolio — a [Next.js](https://nextjs.org) site that is **statically
exported** and deployed to GitHub Pages.

## The self-populating idea

The site builds its project list from **`.portfolio` files scattered across my
GitHub repos**. Any repo (public *or* private) that contains a `.portfolio` JSON
file at its root shows up as a project. The site is just a renderer — each project
describes itself in its own repo.

At **build time** a script (`src/scripts/fetch-portfolio.ts`) authenticates with a
GitHub token, lists my repos, reads every `.portfolio` file, validates it, and
writes `src/data/projects.json`. The rest of the site is pure static HTML — no
GitHub API calls happen in the visitor's browser (so no rate limits, and private
repos can appear with only the details I chose to expose).

### The `.portfolio` schema

See [`docs/portfolio-example.json`](docs/portfolio-example.json). Fields:

| field         | required | notes                                                        |
| ------------- | -------- | ------------------------------------------------------------ |
| `name`        | ✓        | Project title                                                |
| `tagline`     | ✓        | One-liner shown on the card                                  |
| `description` |          | Markdown body shown on the project detail view               |
| `url`         | ✓        | Repo / canonical link                                        |
| `demo`        |          | Optional live-demo URL                                       |
| `tags`        |          | Array of tech tags, e.g. `["python", "nextjs"]`              |
| `color`       |          | Hex accent color for the card & detail page                  |
| `featured`    |          | Sort weight — lower shows first; omit to leave un-featured   |
| `status`      |          | `active` \| `wip` \| `archived`                              |

## Local development

```bash
cd src
cp ../.env.example .env.local   # paste a GitHub token (optional; public-only without it)
npm install
npm run dev                     # http://localhost:3000
```

`npm run dev`/`npm run build` run the fetch script first (via the `prebuild`/`predev`
hooks) to refresh `src/data/projects.json`.

## Deploy

Deployment is automated by GitHub Actions (`.github/workflows/deploy.yml`) on every
push to `main`, on a nightly schedule, and on `repository_dispatch` (so any repo can
trigger a rebuild when its `.portfolio` changes).

**One-time setup:** add a repo secret named `GH_PORTFOLIO_TOKEN` (a PAT with
`repo`/contents-read scope) so the build can read private repos, and enable GitHub
Pages → "GitHub Actions" as the source.

Manual deploy is still available:

```bash
cd src
npm run deploy        # next build + gh-pages -d out
```
