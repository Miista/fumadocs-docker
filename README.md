# fumadocs-wrapper

A Docker image that runs a [Fumadocs](https://fumadocs.dev) documentation site. Drop in a folder of Markdown files and get a full-featured docs site — search, sidebar, syntax highlighting, dark mode — with no build step required.

## The problem

Running a documentation site normally requires a build step: install dependencies, run a bundler, serve static output. Any time you add or edit a file you either rebuild or maintain a separate dev server setup.

## How it works

This image ships a pre-configured Fumadocs + Next.js app. At runtime you mount a directory of `.md` or `.mdx` files into `/content`. The app reads that directory, auto-generates navigation from the folder structure, and serves the site in development mode with hot reload.

**Live content** — edits to existing files are reflected in the browser within a second or two, no restart needed. New files added to the mounted directory are also picked up automatically; the dev server detects them and updates the sidebar without a container restart.

## Usage

```yaml
services:
  docs:
    image: ghcr.io/miista/fumadocs-docker:latest
    volumes:
      - ./my-docs:/content:ro
    ports:
      - "3000:3000"
    environment:
      DOCS_TITLE: "Homelab"
```

Mount any directory of Markdown files at `/content`. The top-level `/content/docs/` folder is used as the docs root.

## Content format

Files are standard Markdown with an optional frontmatter header:

```markdown
---
title: Restic Backups
description: How backups are configured
---

Content goes here. Link to other pages with [[Page Title]] wikilinks.
```

Folder structure becomes navigation:

```
my-docs/
└── docs/
    ├── index.md              # /docs
    ├── infrastructure/
    │   ├── pi.md             # /docs/infrastructure/pi
    │   ├── optiplex.md
    │   └── caddy.md
    └── runbooks/
        └── restore.md
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DOCS_TITLE` | `Docs` | Site name shown in the navbar |
| `CONTENT_DIR` | `/content/docs` | Path to the docs root inside the container |

## Automatic updates

A GitHub Actions workflow runs daily and checks for new releases of the upstream [Fumadocs](https://github.com/fuma-nama/fumadocs) package. When a new version is detected — or the wrapper itself changes — it builds and publishes a new multi-arch image (`linux/amd64`, `linux/arm64`) to GHCR.

### Tags

| Tag | Example | Mutable? | Use for |
|-----|---------|----------|---------|
| `<version>-g<sha>` | `16.10.7-ga1b2c3` | No | Pinning / reproducible deploys |
| `<version>` | `16.10.7` | Yes | Drop-in upstream-version tracking |
| `latest` | `latest` | Yes | Always-newest |
