import { useState } from 'react';
import { FLOW_NODES, SCHEME, TOOLS, WF_CATS, WF_VERSIONS } from '../content/articles';
import type { Prefs } from '../prefs';
import { Hash, OptButton, Rule, SANS } from '../ui';
import { PrefGroups } from './PrefControls';
import { LegendButton, figStyle } from './Treemap';

/** 10×10 grid, one block per reader; switch layout version, highlight a band. */
export function Waffle() {
  const [v, setV] = useState(1);
  const [sel, setSel] = useState<number | null>(null);
  const wv = WF_VERSIONS[v];
  const cells: string[] = [];
  wv.v.forEach((n, ci) => { for (let j = 0; j < n; j++) cells.push(sel == null || sel === ci ? WF_CATS[ci].c : 'var(--tdh-cat-off)'); });
  const summary = sel == null
    ? `${wv.label}: ${wv.v[0]} de 100 leitores começaram em menos de 10 segundos.`
    : `${wv.label}: ${wv.v[sel]} de 100 leitores na faixa ${WF_CATS[sel].k.toLowerCase()}.`;
  return (
    <figure style={figStyle}>
      <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: `600 18px/1.3 ${SANS}` }}>Tempo até começar a ler</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>100 leitores, cada bloco = 1 pessoa · {wv.label} · dados fictícios</span>
      </figcaption>
      <div role="group" aria-label="Versão do layout" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px 6px' }}>
        <span style={{ font: `500 14px ${SANS}`, color: 'var(--color-text-muted)', paddingRight: 4 }}>Versão</span>
        {WF_VERSIONS.map((g, i) => <OptButton key={g.label} on={v === i} onClick={() => setV(i)}>{g.label}</OptButton>)}
      </div>
      <div
        role="img" aria-label={wv.label + ': ' + WF_CATS.map((c, i) => c.k + ' ' + wv.v[i]).join(', ') + ' de 100 leitores.'}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(10,minmax(0,1fr))', gap: 4, maxWidth: 420 }}
      >
        {cells.map((bg, i) => <span key={i} style={{ aspectRatio: '1', borderRadius: 3, background: bg }} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,190px),1fr))', gap: '2px 12px' }}>
        {WF_CATS.map((c, i) => (
          <LegendButton key={c.k} on={sel === i} onClick={() => setSel(sel === i ? null : i)} color={c.c} name={c.k} value={wv.v[i]} />
        ))}
      </div>
      <span role="status" style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>{summary}</span>
      <span style={{ font: `400 14px/1.5 ${SANS}`, color: 'var(--color-text-muted)' }}>Dados fictícios para demonstração.</span>
    </figure>
  );
}

const ARC = { fill: 'none', strokeWidth: 2, markerEnd: 'url(#tdh-ah)', style: { stroke: 'var(--tdh-rule)' } };
const PLUS = { fontSize: 16, style: { fontFamily: 'var(--font-mono)', fill: 'var(--color-text)' } };

/** Circular R1 flowchart (exempt from the square-area rule). Rotates briefly once on entering view. */
export function FlowR1({ rot, reduce }: { rot: boolean; reduce: boolean }) {
  const [sel, setSel] = useState(0);
  const n = FLOW_NODES;
  return (
    <figure id="flow-r1" style={figStyle}>
      <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: `600 18px/1.3 ${SANS}` }}>Ciclo R1 · reforço da leitura</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Selecione uma etapa para explorar. Cada “+” indica que uma etapa reforça a seguinte.</span>
      </figcaption>
      <div style={{ position: 'relative', width: '100%', maxWidth: 440, aspectRatio: '1', margin: '0 auto' }}>
        <svg
          aria-hidden="true" viewBox="0 0 340 340"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', transformOrigin: '50% 50%', transform: `rotate(${rot ? '18deg' : '0deg'})`,
            transition: reduce ? 'none' : 'transform 600ms cubic-bezier(.3,.7,.3,1)',
          }}
        >
          <defs>
            <marker id="tdh-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0L10 5L0 10z" style={{ fill: 'var(--color-text-muted)' }} />
            </marker>
          </defs>
          <path d="M214 50 A130 130 0 0 1 290 126" {...ARC} />
          <path d="M290 214 A130 130 0 0 1 214 290" {...ARC} />
          <path d="M126 290 A130 130 0 0 1 50 214" {...ARC} />
          <path d="M50 126 A130 130 0 0 1 126 50" {...ARC} />
          <text x="268" y="76" {...PLUS}>+</text>
          <text x="264" y="274" {...PLUS}>+</text>
          <text x="62" y="274" {...PLUS}>+</text>
          <text x="62" y="76" {...PLUS}>+</text>
          <circle cx="170" cy="170" r="46" fill="none" strokeDasharray="4 5" style={{ stroke: 'var(--tdh-rule)' }} />
        </svg>
        {n.map((node, i) => {
          const on = sel === i;
          return (
            <button
              key={node.label} type="button" onClick={() => setSel(i)} aria-pressed={on} className="hv-raised"
              style={{
                position: 'absolute', left: node.x, top: node.y, transform: node.tf, maxWidth: '38%', minHeight: 44, padding: '8px 10px',
                borderRadius: 8, border: on ? '2px solid var(--color-text)' : '1px solid var(--tdh-rule)', background: on ? 'var(--color-bg)' : 'var(--color-surface)',
                fontFamily: 'inherit', fontSize: 14, lineHeight: 1.25, color: 'var(--color-text)', textAlign: 'center', cursor: 'pointer',
              }}
            >
              <span style={{ display: 'block', font: `600 12px ${SANS}`, color: 'var(--color-text-muted)' }}>{'0' + (i + 1)}</span>
              {node.label}
            </button>
          );
        })}
        <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', fontSize: 13, lineHeight: 1.25, color: 'var(--color-text-muted)' }}>
          <span style={{ display: 'block', font: `600 20px ${'var(--font-mono)'}`, color: 'var(--color-text)' }}>R1</span>reforço
        </div>
      </div>
      <div role="status" style={{ background: 'var(--color-surface)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: `600 16px ${SANS}` }}>{'0' + (sel + 1)} · {n[sel].label}</span>
        <span style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>{n[sel].desc}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: `500 14px ${SANS}`, color: 'var(--color-text-muted)' }}>Sequência em texto</span>
        <ol style={{ margin: 0, paddingLeft: 22, fontSize: 15, lineHeight: 1.6 }}>
          {n.map((node, i) => <li key={node.label}>{node.label} reforça {n[(i + 1) % 4].label.toLowerCase()}</li>)}
        </ol>
      </div>
    </figure>
  );
}

/** Grouping scheme: Agora / Próximo / Depois, hierarchy by border and weight. */
export function Scheme() {
  return (
    <figure style={{ ...figStyle, gap: 14 }}>
      <figcaption style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: `600 18px/1.3 ${SANS}` }}>Esquema · agrupar por momento</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Um item em Agora. Até três em Próximo. O restante espera em Depois.</span>
      </figcaption>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap: 12 }}>
        {SCHEME.map((col) => (
          <div key={col.name} style={{ border: `1px solid ${col.border}`, borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: col.bg }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', font: `600 16px ${SANS}` }}>
              <span><Hash /> {col.name}</span>
              <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>{col.count}</span>
            </span>
            <Rule width={40} />
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15 }}>
              {col.items.map((it) => <li key={it} style={{ fontWeight: col.weight }}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </figure>
  );
}

const sectionStyle = { display: 'flex', flexDirection: 'column' as const, gap: 16, scrollMarginTop: 24, fontSize: 16, lineHeight: 1.5, letterSpacing: 0, wordSpacing: 0, fontFamily: SANS };
const wordBtn = {
  minHeight: 44, padding: '0 8px', border: 0, borderRadius: 6, font: `500 15px ${SANS}`, color: 'var(--color-text)', textDecoration: 'underline',
  textUnderlineOffset: 6, cursor: 'pointer',
};

/** Tools area: short delimiter line + title; each tool opens/closes and copies. */
export function Tools() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState('');
  return (
    <section id="ferramentas" aria-labelledby="h-tools" style={{ ...sectionStyle, margin: '24px 0 8px' }}>
      <Rule width={72} />
      <h2 id="h-tools" tabIndex={-1} style={{ margin: 0, font: `600 21px/1.3 ${SANS}` }}><Hash /> Ferramentas</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {TOOLS.map((t) => {
          const isOpen = !!open[t.id];
          const copy = () => {
            const txt = t.name + '\n' + t.items.map((x, i) => i + 1 + '. ' + x).join('\n');
            (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
              .then(() => setMsg(t.name + ' copiado.'))
              .catch(() => setMsg('Não foi possível copiar. Abra a ferramenta e selecione o texto.'));
          };
          return (
            <div key={t.id} style={{ borderTop: '1px solid var(--color-divider)', padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ font: `600 17px ${SANS}` }}>{t.name}</span>
              <span style={{ fontSize: 16, color: 'var(--color-text-muted)' }}>{t.desc}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', marginLeft: -8 }}>
                <button
                  type="button" onClick={() => setOpen({ ...open, [t.id]: !isOpen })} aria-expanded={isOpen} aria-controls={'tool-' + t.id}
                  className="hv-surface" style={{ ...wordBtn, background: isOpen ? 'var(--color-surface)' : 'transparent' }}
                >
                  {isOpen ? 'Fechar' : 'Abrir'}
                </button>
                <button type="button" onClick={copy} className="hv-surface act-press" style={{ ...wordBtn, background: 'transparent' }}>Copiar</button>
              </div>
              {isOpen && (
                <ol id={'tool-' + t.id} style={{ margin: 0, padding: '12px 16px 12px 36px', background: 'var(--color-surface)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 16 }}>
                  {t.items.map((it) => <li key={it}>{it}</li>)}
                </ol>
              )}
            </div>
          );
        })}
      </div>
      <span role="status" style={{ fontSize: 15, color: 'var(--color-text-muted)', minHeight: 22 }}>{msg}</span>
    </section>
  );
}

/** In-article copy of the reading preferences (same state as the Aa panel). */
export function PrefsSection({ prefs, setPrefs, reset }: { prefs: Prefs; setPrefs: (p: Partial<Prefs>) => void; reset: () => void }) {
  return (
    <section id="preferencias" aria-labelledby="h-prefs" style={{ ...sectionStyle, margin: '8px 0' }}>
      <h3 id="h-prefs" style={{ margin: 0, font: `600 19px/1.3 ${SANS}` }}><Hash /> Preferências de leitura</h3>
      <span style={{ fontSize: 16, color: 'var(--color-text-muted)' }}>Os mesmos ajustes do controle Aa, no topo de cada artigo. Experimente aqui e veja o texto mudar.</span>
      <div style={{ border: '1px solid var(--color-divider)', borderRadius: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <PrefGroups prefs={prefs} setPrefs={setPrefs} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
          <button type="button" onClick={reset} className="hv-surface" style={{ ...wordBtn, background: 'transparent', color: 'var(--color-text-muted)' }}>Restaurar padrão</button>
        </div>
      </div>
    </section>
  );
}
