export interface Prefs { size: number; spacing: number; font: number; width: number }

export const DEFAULT_PREFS: Prefs = { size: 1, spacing: 0, font: 0, width: 0 };

export const SIZES = [16, 18, 20, 22, 24];
export const SPACING = [
  { lh: 1.6, ls: '0', ws: '0', pg: '1.35em', hm: '2.6em' },
  { lh: 1.75, ls: '0.03em', ws: '0.1em', pg: '1.7em', hm: '3em' },
  { lh: 1.9, ls: '0.06em', ws: '0.18em', pg: '2.1em', hm: '3.4em' },
];
export const FONTS = [
  'var(--font-body)',
  'Verdana,"DejaVu Sans",Geneva,sans-serif',
  '"New York","Iowan Old Style",Georgia,serif',
];

export const PREF_GROUPS: { label: string; key: keyof Prefs; labels: string[]; arias?: string[] }[] = [
  { label: 'Tamanho', key: 'size', labels: ['A−', 'A', 'A+', 'A++', 'A+++'], arias: SIZES.map((z) => 'Tamanho do texto ' + z + ' pixels') },
  { label: 'Espaçamento', key: 'spacing', labels: ['Padrão', 'Amplo', 'Extra'] },
  { label: 'Fonte', key: 'font', labels: ['Padrão', 'Verdana', 'Serifa'], arias: ['Fonte padrão do sistema', 'Fonte Verdana', 'Fonte serifada'] },
  { label: 'Largura', key: 'width', labels: ['Padrão', 'Estreita'], arias: ['Largura de linha padrão, 68 caracteres', 'Largura de linha estreita, 56 caracteres'] },
];

const PREFS_KEY = 'tdh-prefs';
const TIP_KEY = 'tdh-tip-seen';

export function loadPrefs(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    const out = { ...DEFAULT_PREFS };
    (Object.keys(out) as (keyof Prefs)[]).forEach((k) => { if (typeof raw[k] === 'number') out[k] = raw[k]; });
    return out;
  } catch {
    return { ...DEFAULT_PREFS };
  }
}
export function savePrefs(p: Prefs) { try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch { /* storage unavailable */ } }
export function loadTipSeen() { try { return localStorage.getItem(TIP_KEY) === '1'; } catch { return false; } }
export function saveTipSeen() { try { localStorage.setItem(TIP_KEY, '1'); } catch { /* storage unavailable */ } }
