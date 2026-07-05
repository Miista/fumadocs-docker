import { join } from 'path';

const root = join(import.meta.dir, 'out');
const port = parseInt(process.env.PORT ?? '3000');

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    const candidates = [
      join(root, pathname),
      join(root, pathname + '.html'),
      join(root, pathname.replace(/\/$/, ''), 'index.html'),
    ];

    for (const path of candidates) {
      const file = Bun.file(path);
      if (await file.exists()) return new Response(file);
    }

    const notFound = Bun.file(join(root, '404.html'));
    return new Response(notFound, { status: 404 });
  },
});

console.log(`[fumadocs] serving on http://localhost:${port}`);
