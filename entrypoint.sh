#!/bin/sh
set -e

CONTENT_DIR="${CONTENT_DIR:-/content/docs}"

rebuild() {
  echo "[fumadocs] building..."
  bun run build && echo "[fumadocs] build complete"
}

start_server() {
  if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID"
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  bun /app/server.ts &
  SERVER_PID=$!
  echo "[fumadocs] server started (pid $SERVER_PID)"
}

# Initial build + start
rebuild
start_server

# Watch for changes and rebuild.
# Exclude editor cruft (vim .swp/.swpx, ~ backups, dotfiles, 4913 test file)
# so `vi`-ing a doc doesn't spuriously rebuild on the swap-file create/delete.
WATCH_EXCLUDE='(\.sw[a-z]?x?$|~$|/\.[^/]*$|/4913$)'
echo "[fumadocs] watching $CONTENT_DIR for changes..."
while inotifywait -r -e modify,create,delete,move \
    --exclude "$WATCH_EXCLUDE" "$CONTENT_DIR" 2>/dev/null; do
  echo "[fumadocs] change detected, rebuilding..."
  rebuild
  start_server
done
