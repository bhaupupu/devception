#!/usr/bin/env node
/**
 * Build guard: prevent a Next.js sitemap route from silently shadowing the
 * static public/sitemap.xml.
 *
 * We serve the sitemap as a static file (public/sitemap.xml). If a metadata
 * route or route handler for the sitemap ever reappears under src/app, Next.js
 * will generate /sitemap.xml dynamically and override the static file — which is
 * exactly the regression that caused the Google Search Console "Couldn't fetch"
 * incident. This script fails the build loudly if that conflict is reintroduced.
 *
 * Runs automatically via the "prebuild" npm script (npm/Vercel run it before
 * `next build`).
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const APP_DIR = join(ROOT, 'src', 'app');
const STATIC_SITEMAP = join(ROOT, 'public', 'sitemap.xml');

// Route files that would generate /sitemap.xml dynamically.
const ROUTE_BASENAMES = new Set([
  'sitemap.ts',
  'sitemap.tsx',
  'sitemap.js',
  'sitemap.jsx',
]);

/** Recursively collect any sitemap-generating route files under src/app. */
function findSitemapRoutes(dir, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const isDir = statSync(full).isDirectory();
    if (isDir) {
      // Route handler form: app/.../sitemap.xml/route.ts
      if (entry === 'sitemap.xml') {
        for (const handler of ['route.ts', 'route.js', 'route.tsx', 'route.jsx']) {
          const handlerPath = join(full, handler);
          if (existsSync(handlerPath)) found.push(handlerPath);
        }
      }
      findSitemapRoutes(full, found);
    } else if (ROUTE_BASENAMES.has(entry)) {
      found.push(full);
    }
  }
  return found;
}

const hasStatic = existsSync(STATIC_SITEMAP);
const routes = findSitemapRoutes(APP_DIR);

if (hasStatic && routes.length > 0) {
  console.error('\n\x1b[31m✖ Sitemap conflict detected.\x1b[0m');
  console.error(
    '  public/sitemap.xml exists AND a Next.js sitemap route was found:'
  );
  for (const r of routes) console.error('    - ' + relative(ROOT, r));
  console.error(
    '\n  A sitemap route generates /sitemap.xml dynamically and overrides the\n' +
      '  static file, which previously broke Google Search Console fetching.\n' +
      '  Remove the route(s) above, OR delete public/sitemap.xml if you intend\n' +
      '  to go fully dynamic. Do not ship both.\n'
  );
  process.exit(1);
}

if (!hasStatic && routes.length === 0) {
  console.warn(
    '\x1b[33m⚠ No sitemap found (neither public/sitemap.xml nor a sitemap route).\x1b[0m'
  );
}

console.log('\x1b[32m✓ Sitemap check passed\x1b[0m (static public/sitemap.xml, no conflicting route).');
