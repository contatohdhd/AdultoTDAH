import { useState } from 'react';
import { PERIODS, TM_CATS, TM_GROUPS, fmt, squarify, tmVals } from '../content/articles';
import { Hash, MONO, OptButton, SANS, ctl } from '../ui';

const figStyle = {
  margin: 'clamp(32px,6vw,56px) 0', display: 'flex', flexDirection: 'column' as const, gap: 16, fontSize: 16, lineHeight: 1.45,
  letterSpacing: 0, wordSpacing: 0, fontFamily: SANS,
};
export { figStyle };

/** Interactive block-area chart: group filter, period slider, selectable areas, legend, details, table. */
export function Treemap({ pulse, reduce }: { pulse: boolean; reduce: boolean }) {
  const [group, setGroup] = useState(0);
  const [q, setQ] = useState(7);
  const [sel, setSel] = useState<number | null>(null);

  const tg = TM_GROUPS[group];
  const vals = tmVals(group, q);
  const items = TM_CATS.map((c, i) => ({ i, name: c.k, c: c.c, desc: c.desc, v: vals[i], a: vals[i] * 100 })).sort((x, y) => y.v - x.v);
  const pick = (i: number) => () => setSel(sel === i ? null : i);
  const blocks = squarify(items);
  const selItem = sel != null ? items.find((x) => x.i === sel) : undefined;
  const all = [0, 1, 2].map((g) => tmVals(g, q));

  return (
    <figure style={figStyle}>
      <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: `600 18px/1.3 ${SANS}` }}>Estratégias de leitura mais usadas</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>% das respostas · {tg.label} · {PERIODS[q]} · n = {tg.n} · dados fictícios</span>
      </figcaption>
      <div role="group" aria-label="Filtrar por grupo" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px 6px' }}>
        <span style={{ font: `500 14px ${SANS}`, color: 'var(--color-text-muted)', paddingRight: 4 }}>Grupo</span>
        {TM_GROUPS.map((g, i) => <OptButton key={g.label} on={group === i} onClick={() => setGroup(i)}>{g.label}</OptButton>)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <label htmlFor="tm-range" style={{ font: `500 14px ${SANS}`, color: 'var(--color-text-muted)' }}>Arraste para explorar o período</label>
          <span aria-hidden="true" style={{ font: `600 16px ${MONO}` }}>{PERIODS[q]}</span>
        </div>
        <input
          id="tm-range" type="range" min={0} max={7} step={1} value={q} onChange={(e) => setQ(+e.target.value)} aria-valuetext={PERIODS[q]}
          style={{ width: '100%', height: 44, margin: 0, accentColor: 'var(--color-text)', cursor: 'pointer' }}
        />
        <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'space-between', font: `400 13px ${SANS}`, color: 'var(--color-text-muted)' }}>
          <span>{PERIODS[0]}</span><span>{PERIODS[7]}</span>
        </div>
      </div>
      <div
        id="tm-chart" role="group" aria-label="Áreas do gráfico. Selecione uma área para ver detalhes."
        style={{
          position: 'relative', width: '100%', aspectRatio: '1', filter: pulse ? 'saturate(1.45) brightness(0.96)' : 'none',
          transition: reduce ? 'none' : 'filter 320ms ease',
        }}
      >
        {blocks.map((k) => {
          const on = sel === k.i;
          return (
            <button
              key={k.name} type="button" onClick={pick(k.i)} aria-pressed={on} aria-label={k.name + ', ' + fmt(k.v) + '%'} className="hv-dim"
              style={{
                position: 'absolute', left: k.x + '%', top: k.y + '%', width: k.w + '%', height: k.h + '%', boxSizing: 'border-box',
                border: '2px solid var(--color-bg)', borderRadius: 6, background: k.c, boxShadow: on ? 'inset 0 0 0 3px var(--color-text)' : 'none', padding: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, textAlign: 'left', cursor: 'pointer', color: 'var(--tdh-on-cat)',
                fontFamily: 'inherit', overflow: 'hidden',
              }}
            >
              {k.w >= 24 && k.h >= 15 && (
                <>
                  <span style={{ fontSize: 14, lineHeight: 1.25 }}>{k.name}</span>
                  <span style={{ fontSize: 17, fontWeight: 600 }}>{fmt(k.v)}%</span>
                </>
              )}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,200px),1fr))', gap: '2px 12px' }}>
        {items.map((k) => <LegendButton key={k.name} on={sel === k.i} onClick={pick(k.i)} color={k.c} name={k.name} value={fmt(k.v) + '%'} />)}
      </div>
      <div role="status" aria-live="polite" style={{ background: 'var(--color-surface)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 72, boxSizing: 'border-box' }}>
        {selItem ? (
          <>
            <span style={{ font: `600 16px ${SANS}` }}><Hash /> {selItem.name} · {fmt(selItem.v)}%</span>
            <span style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>
              {Math.round((selItem.v / 100) * tg.n)} de {tg.n} respostas · {tg.label} · {PERIODS[q]}. {selItem.desc}
            </span>
            <button
              type="button" onClick={() => setSel(null)} className="hv-raised"
              style={{
                alignSelf: 'flex-start', minHeight: 44, padding: '0 6px', border: 0, background: 'transparent', borderRadius: 6,
                font: `500 14px ${SANS}`, color: 'var(--color-text)', textDecoration: 'underline', textUnderlineOffset: 5, cursor: 'pointer',
              }}
            >
              Limpar seleção
            </button>
          </>
        ) : (
          <span style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>Toque em uma área ou em um item da legenda para ver os detalhes.</span>
        )}
      </div>
      <details style={{ borderTop: '1px solid var(--color-divider)' }}>
        <summary style={{ minHeight: 48, display: 'flex', alignItems: 'center', cursor: 'pointer', font: `500 15px ${SANS}` }}>Ver dados em tabela</summary>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <caption style={{ textAlign: 'left', padding: '0 0 8px', color: 'var(--color-text-muted)' }}>
              Estratégias de leitura, % das respostas por grupo, {PERIODS[q]} (dados fictícios)
            </caption>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th scope="col" style={th}>Estratégia</th>
                {TM_GROUPS.map((g) => <th key={g.label} scope="col" style={{ ...th, textAlign: 'right' }}>{g.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {TM_CATS.map((c, i) => (
                <tr key={c.k}>
                  <th scope="row" style={{ textAlign: 'left', fontWeight: 400, ...td }}>{c.k}</th>
                  {all.map((g, gi) => <td key={gi} style={{ ...td, textAlign: 'right', fontFamily: MONO }}>{fmt(g[i])}%</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <span style={{ font: `400 14px/1.5 ${SANS}`, color: 'var(--color-text-muted)' }}>Dados fictícios para demonstração. Área de cada bloco proporcional ao valor.</span>
    </figure>
  );
}

const th = { padding: '10px 8px', borderBottom: '1px solid var(--tdh-rule)' };
const td = { padding: '10px 8px', borderBottom: '1px solid var(--color-divider)' };

export function LegendButton({ on, onClick, color, name, value }: { on: boolean; onClick: () => void; color: string; name: string; value: string | number }) {
  const c = ctl(on);
  return (
    <button
      type="button" onClick={onClick} aria-pressed={on} className="hv-surface"
      style={{
        minHeight: 44, display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', border: 0, borderRadius: 6, background: c.background,
        textAlign: 'left', fontFamily: 'inherit', fontSize: 15, color: 'var(--color-text)', cursor: 'pointer', fontWeight: c.fontWeight,
      }}
    >
      <span aria-hidden="true" style={{ flex: 'none', width: 16, height: 16, borderRadius: 3, background: color }} />
      <span style={{ flex: 1 }}>{name}</span>
      <span style={{ fontFamily: MONO }}>{value}</span>
    </button>
  );
}
