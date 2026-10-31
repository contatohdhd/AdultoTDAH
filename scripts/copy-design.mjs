// Serves the original Claude Design prototypes (HIG review, design system v1,
// mockups, component library, Jornada…) at /design/* for reference.
import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'design-source', 'prototypes');
const out = join(root, 'public', 'design');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of readdirSync(src)) {
  if (f.endsWith('.dc.html') || f.endsWith('.js')) cpSync(join(src, f), join(out, f));
}
cpSync(join(src, '_ds'), join(out, '_ds'), { recursive: true });
