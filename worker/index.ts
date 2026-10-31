// Temporary access gate for the whole site (HTTP Basic Auth, enforced on Cloudflare before any
// asset is served). Credentials are Worker secrets ADMIN_USER / ADMIN_PASS — never in this repo.
// To open the site to the public, set SITE_LOCK to "off" in wrangler.jsonc and deploy.

interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
  SITE_LOCK?: string;
  ADMIN_USER?: string;
  ADMIN_PASS?: string;
}

const enc = new TextEncoder();

async function same(a: string, b: string): Promise<boolean> {
  // Compare SHA-256 digests in constant time (equal-length buffers).
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const subtle = crypto.subtle as SubtleCrypto & { timingSafeEqual?: (a: ArrayBuffer, b: ArrayBuffer) => boolean };
  if (subtle.timingSafeEqual) return subtle.timingSafeEqual(x, y);
  const u = new Uint8Array(x), v = new Uint8Array(y);
  let d = 0;
  for (let i = 0; i < u.length; i++) d |= u[i] ^ v[i];
  return d === 0;
}

async function authorized(req: Request, env: Env): Promise<boolean> {
  if (!env.ADMIN_USER || !env.ADMIN_PASS) return false; // fail closed if secrets are missing
  const h = req.headers.get('Authorization') || '';
  const m = /^Basic\s+(.+)$/i.exec(h);
  if (!m) return false;
  let decoded = '';
  try { decoded = new TextDecoder().decode(Uint8Array.from(atob(m[1]), (c) => c.charCodeAt(0))); } catch { return false; }
  const i = decoded.indexOf(':');
  if (i < 0) return false;
  const [okUser, okPass] = await Promise.all([same(decoded.slice(0, i), env.ADMIN_USER), same(decoded.slice(i + 1), env.ADMIN_PASS)]);
  return okUser && okPass;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const locked = env.SITE_LOCK !== 'off';
    if (locked && !(await authorized(req, env))) {
      return new Response('TDAH Adulto: site em construção. Acesso restrito.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="TDAH Adulto (em construção)", charset="UTF-8"',
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }
    const res = await env.ASSETS.fetch(req);
    if (!locked) return res;
    // While locked: keep pages out of shared caches and search engines.
    const out = new Response(res.body, res);
    out.headers.set('Cache-Control', 'private, no-store');
    out.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return out;
  },
};
