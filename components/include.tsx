import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeReact, { type Options as RehypeReactOptions } from 'rehype-react';
import * as prod from 'react/jsx-runtime';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { BackupCoverage } from './backup-coverage';

// Deliberately NOT importing getMDXComponents from ./mdx — that file
// imports Include, and this needs a fixed set (no self-reference, a
// generated fragment including itself would be a config error anyway).

// Generic file-include: renders Markdown fragments written by an external
// generator (e.g. service-info-gen) through the SAME remark/rehype pipeline
// as regular pages, using fumadocs' own component map — so a generated
// table gets fumadocs' styled <Table>, not a bare unstyled <table>.
const CONTENT_DIR = process.env.CONTENT_DIR ?? 'content/docs';

function loadFragment(path: string): string | null {
  try {
    return readFileSync(join(CONTENT_DIR, path), 'utf-8');
  } catch {
    return null;
  }
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeReact, {
    ...prod,
    components: { ...defaultMdxComponents, BackupCoverage },
  } as RehypeReactOptions);

/**
 * Inlines a generated Markdown fragment from the content tree, rendered
 * through the same pipeline as regular pages.
 *
 * Usage in MDX:  <Include path="_generated/optiplex/speedtest-tracker.md" />
 */
export function Include({ path }: { path: string }) {
  const markdown = loadFragment(path);

  if (markdown === null) {
    return (
      <div className="my-4 rounded-lg border border-fd-border bg-fd-muted/50 p-4 text-sm text-fd-muted-foreground">
        No generated fragment at <code>{path}</code> — the generator hasn't
        run yet, or this file was renamed or removed.
      </div>
    );
  }

  return <>{processor.processSync(markdown).result}</>;
}
