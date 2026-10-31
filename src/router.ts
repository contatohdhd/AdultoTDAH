import { useEffect, useState } from 'react';

/** Minimal History-API router. Internal <a href="/…"> links are intercepted globally in App. */

const EVT = 'tdah:navigate';

export function navigate(to: string, replace = false) {
  if (replace) history.replaceState(null, '', to);
  else history.pushState(null, '', to);
  window.dispatchEvent(new Event(EVT));
}

export interface Loc { path: string; hash: string; key: number }

let counter = 0;
const read = (): Loc => ({ path: normalize(location.pathname), hash: decodeURIComponent(location.hash.replace(/^#/, '')), key: ++counter });

function normalize(p: string) {
  const s = p.replace(/\/+$/, '');
  return s === '' ? '/' : s;
}

export function useLocation(): Loc {
  const [loc, setLoc] = useState<Loc>(read);
  useEffect(() => {
    const on = () => setLoc(read());
    window.addEventListener('popstate', on);
    window.addEventListener(EVT, on);
    return () => { window.removeEventListener('popstate', on); window.removeEventListener(EVT, on); };
  }, []);
  return loc;
}

/** Old showroom hash routes (#/a, #/c/ferramentas…) → new paths. */
export function legacyRedirect(): string | null {
  const h = location.hash;
  if (!h.startsWith('#/')) return null;
  const [page, anchor] = h.slice(2).split('/');
  const map: Record<string, string> = {
    '': '/', a: '/artigos/a', b: '/artigos/b', c: '/artigos/c', inventario: '/inventario',
    artigos: '/artigos', questionarios: '/questionarios',
  };
  const base = map[page ?? ''] ?? '/';
  return anchor ? `${base}#${anchor}` : base;
}

/** True for links the SPA should handle itself. */
export function isInternal(a: HTMLAnchorElement): boolean {
  if (a.target && a.target !== '_self') return false;
  if (a.hasAttribute('download')) return false;
  if (a.origin !== location.origin) return false;
  if (a.pathname.startsWith('/design/')) return false; // static prototypes
  return true;
}
