// Demo content for the showroom. Ported from the prototype's generator: the
// pseudo-random sequence and its call order are kept identical so the lorem
// text, highlight ids and word counts match the design exactly.

export type Seg =
  | { kind: 'plain'; text: string }
  | { kind: 'mark'; src: Source; id: string; text: string }
  | { kind: 'link'; text: string; href: string };

export type Block =
  | { type: 'h'; id: string; text: string }
  | { type: 'p'; segs: Seg[] }
  | { type: 'callout'; kicker: string; text: string; note?: string }
  | { type: 'treemap' }
  | { type: 'waffle' }
  | { type: 'flow' }
  | { type: 'scheme' }
  | { type: 'tools' }
  | { type: 'prefs' };

/** Provenance of a highlighted passage (critérios editoriais, bloco L). */
export type Source = 'ref' | 'personal' | 'pro';

export type ArticleKey = 'a' | 'b' | 'c';

export interface Article {
  key: ArticleKey;
  letter: string;
  tag: string;
  title: string;
  blocks: Block[];
  date: string;
  legend: boolean;
  deck: string;
  author: string;
  words: number;
  time: string;
  speech: string;
  toc: { id: string; text: string }[];
}

const LW =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(
    ' ',
  );

let seed = 11;
let hlN = 0;

function lorem(n: number): string {
  const out: string[] = [];
  let k = 0;
  for (let i = 0; i < n; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    let w = LW[seed % LW.length];
    if (k === 0) w = w[0].toUpperCase() + w.slice(1);
    k++;
    const end = i === n - 1 || (k >= 7 && seed % 4 === 0) || k >= 15;
    out.push(end ? w + '.' : w);
    if (end) k = 0;
  }
  return out.join(' ');
}

type Part = number | { m: Source; n: number } | { link: string; href: string };

function P(...parts: Part[]): Block {
  const segs: Seg[] = [];
  parts.forEach((pt, i) => {
    if (i > 0) segs.push({ kind: 'plain', text: ' ' });
    if (typeof pt === 'number') segs.push({ kind: 'plain', text: lorem(pt) });
    else if ('m' in pt) segs.push({ kind: 'mark', src: pt.m, id: 'hl' + hlN++, text: lorem(pt.n) });
    else segs.push({ kind: 'link', text: pt.link, href: pt.href });
  });
  return { type: 'p', segs };
}

const H = (id: string, text: string): Block => ({ type: 'h', id, text });
const wc = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function build(): Article[] {
  const A: Block[] = [
    H('a-contexto', 'Contexto'), P(42), P(24, { m: 'ref', n: 16 }, 6), P(44),
    H('a-sinais', 'Sinais no dia a dia'), P(40), P(18, { link: 'veja os dados no Artigo B', href: '/artigos/b' }, 22), P({ m: 'personal', n: 14 }, 28),
    { type: 'callout', kicker: 'Ponto-chave', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
    P(42), P(38),
    H('a-atencao', 'Leitura com atenção variável'), P(44), P(20, { m: 'pro', n: 18 }, 8), P(42), P(36),
    H('a-destaques', 'Destaques e memória'), P(40), P({ m: 'ref', n: 16 }, 26), P(44), P(30, { m: 'personal', n: 12 }),
    H('a-aplicacao', 'Aplicação'), P(42), P(24, { link: 'ferramentas do Artigo C', href: '/artigos/c#ferramentas' }, 16), P(40), P(22, { m: 'pro', n: 14 }, 6),
    H('a-sintese', 'Síntese'), P(42), P(36),
  ];
  const B: Block[] = [
    H('b-pergunta', 'A pergunta'), P(42), P(40), P(26, { link: 'leitura e destaques no Artigo A', href: '/artigos/a' }, 14),
    H('b-estrategias', 'Estratégias por grupo'), P(42), P(38), { type: 'treemap' }, P(42), P(40),
    H('b-tempo', 'Tempo até começar'), P(42), P(36), { type: 'waffle' }, P(42),
    { type: 'callout', kicker: 'Dado', text: '46 de 100 leitores começaram a ler em menos de 10 segundos.', note: 'Layout TDH · dados fictícios' },
    P(38),
    H('b-limites', 'Limites dos dados'), P(42), P(40), P(36),
    H('b-proximos', 'Próximos passos'), P(40), P(24, { link: 'processos no Artigo C', href: '/artigos/c' }, 14), P(34),
  ];
  const C: Block[] = [
    H('c-processo', 'O processo'), P(42), P(40), P(36),
    H('c-ciclo', 'Ciclo de reforço'), P(40), { type: 'flow' }, P(42), P(38),
    H('c-agrupar', 'Agrupar e hierarquizar'), P(42), { type: 'scheme' }, P(40), P(28, { link: 'os dados do Artigo B', href: '/artigos/b' }, 12),
    H('c-ferramentas', 'Ferramentas e ajustes'), P(40), { type: 'tools' }, P(36), { type: 'prefs' },
    H('c-sintese', 'Síntese'), P(42),
    { type: 'callout', kicker: 'Conclusão', text: 'Lorem ipsum dolor sit amet: uma etapa por vez, com espaço para respirar.' },
    P(36),
  ];
  const meta = [
    { key: 'a' as const, letter: 'A', tag: '#Leitura', title: 'Lorem ipsum: leitura e destaques', blocks: A, date: '30 out 2026', legend: true },
    { key: 'b' as const, letter: 'B', tag: '#Dados', title: 'Lorem ipsum: dados e exploração', blocks: B, date: '28 out 2026', legend: false },
    { key: 'c' as const, letter: 'C', tag: '#Ferramentas', title: 'Lorem ipsum: processos e ferramentas', blocks: C, date: '26 out 2026', legend: false },
  ];
  return meta.map((m) => {
    const deck = lorem(24);
    let w = wc(m.title) + wc(deck);
    const sp = [m.title + '.', deck];
    m.blocks.forEach((b) => {
      if (b.type === 'h') { w += wc(b.text); sp.push(b.text + '.'); }
      if (b.type === 'p') { const t = b.segs.map((s) => s.text).join(''); w += wc(t); sp.push(t); }
      if (b.type === 'callout') { w += wc(b.text) + (b.note ? wc(b.note) : 0); sp.push(b.text); }
    });
    return {
      ...m,
      deck,
      author: 'Redação TDH',
      words: w,
      time: Math.max(1, Math.round(w / 200)) + ' min',
      speech: sp.join(' '),
      toc: m.blocks.flatMap((b) => (b.type === 'h' ? [{ id: b.id, text: b.text }] : [])),
    };
  });
}

// Order matters: articles, then treemap descriptions, then flow descriptions.
export const ARTICLES = build();

export const TM_CATS = [
  { k: 'Áudio', c: 'var(--tdh-cat-1)' }, { k: 'Resumo antes de ler', c: 'var(--tdh-cat-2)' }, { k: 'Marca-texto', c: 'var(--tdh-cat-3)' },
  { k: 'Pausas programadas', c: 'var(--tdh-cat-4)' }, { k: 'Fonte maior', c: 'var(--tdh-cat-5)' }, { k: 'Modo foco', c: 'var(--tdh-cat-6)' }, { k: 'Outras', c: 'var(--tdh-cat-7)' },
].map((c) => ({ ...c, desc: lorem(14) }));

export const TM_GROUPS = [
  { label: 'Adultos', n: 412, v: [24, 19, 16, 13, 11, 10, 7] },
  { label: 'Estudantes', n: 296, v: [14, 22, 21, 9, 12, 15, 7] },
  { label: 'Profissionais', n: 338, v: [28, 15, 10, 18, 8, 14, 7] },
];

export const PERIODS = ['T1 2025', 'T2 2025', 'T3 2025', 'T4 2025', 'T1 2026', 'T2 2026', 'T3 2026', 'T4 2026'];

export const WF_CATS = [
  { k: 'Menos de 10 s', c: 'var(--tdh-cat-4)' }, { k: '10 a 30 s', c: 'var(--tdh-cat-1)' }, { k: '30 a 60 s', c: 'var(--tdh-cat-3)' }, { k: 'Mais de 60 s', c: 'var(--tdh-cat-2)' },
];
export const WF_VERSIONS = [
  { label: 'Layout anterior', v: [22, 38, 25, 15] },
  { label: 'Layout TDH', v: [46, 34, 14, 6] },
];

export const FLOW_NODES = [
  { label: 'Compreensão narrativa', x: '50%', y: '2%', tf: 'translateX(-50%)' },
  { label: 'Expectativa significativa', x: '100%', y: '50%', tf: 'translate(-100%,-50%)' },
  { label: 'Atenção sustentada', x: '50%', y: '98%', tf: 'translate(-50%,-100%)' },
  { label: 'Informação processada', x: '0%', y: '50%', tf: 'translateY(-50%)' },
].map((n) => ({ ...n, desc: lorem(20) }));

export const TOOLS = [
  { id: 'checklist', name: 'Checklist de leitura', desc: 'Quatro passos antes de começar um texto longo.', items: ['Ler o título e a linha fina', 'Abrir o índice da página', 'Escolher uma seção para começar', 'Ajustar a leitura se precisar'] },
  { id: 'mapa', name: 'Mapa semanal', desc: 'Agora, Próximo e Depois em uma folha.', items: ['Agora: uma tarefa', 'Próximo: até três tarefas', 'Depois: todo o resto'] },
  { id: 'pausa', name: 'Pausa programada', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', items: ['Ler por 15 minutos', 'Pausar por 3 minutos', 'Retomar pelo último título lido'] },
];

export const SCHEME = [
  { name: 'Agora', count: '1/1', items: ['Ler a seção Ciclo de reforço'], weight: 600, border: 'var(--color-text)', bg: 'var(--color-bg)' },
  { name: 'Próximo', count: '3/3', items: ['Testar o checklist', 'Ajustar o espaçamento', 'Anotar uma dúvida'], weight: 400, border: 'var(--tdh-rule)', bg: 'var(--color-bg)' },
  { name: 'Depois', count: '4', items: ['Ler o Artigo B', 'Rever os dados', 'Compartilhar', 'Imprimir o mapa'], weight: 400, border: 'var(--color-divider)', bg: 'var(--color-surface)' },
];

/** Treemap values for a group and quarter; always sums to 100. */
export function tmVals(gi: number, q: number): number[] {
  const b = TM_GROUPS[gi].v;
  const w = b.map((v, i) => v * (1 + 0.22 * Math.sin(q * 0.85 + i * 1.7)));
  const t = w.reduce((a, c) => a + c, 0);
  const r = w.map((x) => Math.round((x / t) * 1000) / 10);
  const diff = Math.round((100 - r.reduce((a, c) => a + c, 0)) * 10) / 10;
  const mi = r.indexOf(Math.max(...r));
  r[mi] = Math.round((r[mi] + diff) * 10) / 10;
  return r;
}

export interface Rect { x: number; y: number; w: number; h: number }

/** Squarified treemap in a 100×100 box; `a` is each item's area. */
export function squarify<T extends { a: number }>(items: T[]): (T & Rect)[] {
  const res: (T & Rect)[] = [];
  let rest = items.slice();
  let r: Rect = { x: 0, y: 0, w: 100, h: 100 };
  while (rest.length) {
    const short = Math.min(r.w, r.h);
    const worst = (row: T[]) => {
      const s = row.reduce((a, b) => a + b.a, 0);
      const mx = Math.max(...row.map((o) => o.a)), mn = Math.min(...row.map((o) => o.a));
      return Math.max((short * short * mx) / (s * s), (s * s) / (short * short * mn));
    };
    const row = [rest[0]];
    let i = 1;
    while (i < rest.length && worst([...row, rest[i]]) <= worst(row)) { row.push(rest[i]); i++; }
    const s = row.reduce((a, b) => a + b.a, 0);
    if (r.w >= r.h) {
      const cw = s / r.h; let cy = r.y;
      row.forEach((o) => { const ch = o.a / cw; res.push({ ...o, x: r.x, y: cy, w: cw, h: ch }); cy += ch; });
      r = { x: r.x + cw, y: r.y, w: r.w - cw, h: r.h };
    } else {
      const ch = s / r.w; let cx = r.x;
      row.forEach((o) => { const cw = o.a / ch; res.push({ ...o, x: cx, y: r.y, w: cw, h: ch }); cx += cw; });
      r = { x: r.x, y: r.y + ch, w: r.w, h: r.h - ch };
    }
    rest = rest.slice(i);
  }
  return res;
}

export const fmt = (v: number) => v.toFixed(1).replace('.', ',');
