import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Generic file-include: renders pre-rendered HTML fragments written by an
// external generator (e.g. service-info-gen) into docs/_generated/. The
// generator, not this component, owns formatting — this just injects
// trusted, self-produced output, same trust boundary as any other content
// under CONTENT_DIR.
const CONTENT_DIR = process.env.CONTENT_DIR ?? 'content/docs';

function loadFragment(path: string): string | null {
  try {
    return readFileSync(join(CONTENT_DIR, path), 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Inlines a generated HTML fragment from the content tree.
 *
 * Usage in MDX:  <Include path="_generated/optiplex/speedtest-tracker.html" />
 */
export function Include({ path }: { path: string }) {
  const html = loadFragment(path);

  if (html === null) {
    return (
      <div className="my-4 rounded-lg border border-fd-border bg-fd-muted/50 p-4 text-sm text-fd-muted-foreground">
        No generated fragment at <code>{path}</code> — the generator hasn't
        run yet, or this file was renamed or removed.
      </div>
    );
  }

  return <div className="my-4" dangerouslySetInnerHTML={{ __html: html }} />;
}
