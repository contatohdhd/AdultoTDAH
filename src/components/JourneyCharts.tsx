import { useState, type CSSProperties } from 'react';
import { MARCOS, VICIOSO, VIRTUOSO } from '../content/journey';
import { useInView, useReducedMotion } from '../hooks';
import { C, DISPLAY, Eyebrow, MONO, tw } from '../ui';

const sectionHead = (eyebrow: string, title: string, lead: string, id?: string) => (
  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center' }}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 id={id} style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(32px,4.5vw,48px)', lineHeight: 1.08, letterSpacing: '-0.015em', ...tw('balance') }}>{title}</h2>
    <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: C.muted, maxWidth: 600, ...tw('pretty') }}>{lead}</p>
  </div>
);

/** Placeholder for supporting images (replaces the prototype's image-slot). */
function ImageSlot({ label, shape = 'rounded', style }: { label: string; shape?: 'circle' | 'rounded'; style?: CSSProperties }) {
  return (
    <div
      role="img" aria-label={'Espaço reservado: ' + label}
      style={{
        display: 'grid', placeItems: 'center', boxSizing: 'border-box', border: `1px dashed ${C.divider}`, background: C.surface,
        borderRadius: shape === 'circle' ? '50%' : 'var(--radius-lg)', color: C.muted, fontSize: 'var(--text-micro)', fontFamily: MONO,
        letterSpacing: '.06em', textTransform: 'uppercase', textAlign: 'center', padding: 8, ...style,
      }}
    >
      {label}
    </div>
  );
}

/** 01 · Emotional line with interactive milestones A–H. */
export function JourneyChart({ id = 'trajetoria' }: { id?: string }) {
  const [act, setAct] = useState('G');
  const [ref, inView] = useInView<HTMLElement>(0.2);
  const reduce = useReducedMotion();
  const shown = inView || reduce;
  const a = MARCOS.find((m) => m.id === act)!;
  const pts = MARCOS.map((m, i) => ({ ...m, x: 60 + i * 125.7, y: 210 - m.v * 52 }));
  const trans = (v: string) => (reduce ? 'none' : v);

  return (
    <section id={id} ref={ref} aria-labelledby={id + '-h'} style={{ scrollMarginTop: 'var(--tdh-nav-h)', background: C.surface, padding: 'clamp(64px,10vw,96px) 22px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        {sectionHead('01 · Linha emocional com marcos', 'Minha jornada com o TDAH', 'Os valores verticais e a inclinação da linha são ilustrativos, não medidas clínicas. A sequência horizontal representa a ordem dos acontecimentos, não intervalos de tempo iguais.', id + '-h')}

        <div style={{ position: 'relative', width: '100%', aspectRatio: '1000/420' }}>
          <svg aria-hidden="true" viewBox="0 0 1000 420" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <marker id="arX" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" style={{ fill: C.muted }} />
              </marker>
            </defs>
            <line x1="20" y1="10" x2="20" y2="410" strokeWidth="1" style={{ stroke: C.divider }} />
            <line x1="20" y1="210" x2="985" y2="210" strokeWidth="1" markerEnd="url(#arX)" style={{ stroke: C.muted }} />
            <polyline
              points={pts.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" pathLength={1} strokeLinejoin="round" strokeLinecap="round"
              style={{ stroke: C.text, strokeWidth: 2.5, strokeDasharray: 1, strokeDashoffset: shown ? 0 : 1, transition: trans('stroke-dashoffset 2.2s cubic-bezier(.65,0,.35,1)') }}
            />
          </svg>
          <span aria-hidden="true" style={{ position: 'absolute', left: '2%', top: 0, transform: 'translate(-50%,-100%)', fontFamily: MONO, fontSize: 14, color: C.muted }}>+</span>
          <span aria-hidden="true" style={{ position: 'absolute', left: '2%', top: '100%', transform: 'translate(-50%,0)', fontFamily: MONO, fontSize: 14, color: C.muted }}>−</span>
          {pts.map((m, i) => {
            const on = m.id === act;
            const delay = 0.2 + i * 0.25 + 's';
            return (
              <div key={m.id}>
                <button
                  type="button" onMouseEnter={() => setAct(m.id)} onFocus={() => setAct(m.id)} onClick={() => setAct(m.id)}
                  aria-label={`Marco ${m.id}: ${m.titulo}`} aria-pressed={on}
                  style={{
                    all: 'unset', position: 'absolute', left: m.x / 10 + '%', top: m.y / 4.2 + '%', width: 44, height: 44, margin: '-22px 0 0 -22px',
                    display: 'grid', placeItems: 'center', cursor: 'pointer', borderRadius: '50%', opacity: shown ? 1 : 0, transition: trans(`opacity .4s ease ${delay}`),
                  }}
                >
                  <span
                    style={{
                      width: on ? 32 : 22, height: on ? 32 : 22, borderRadius: '50%', background: on ? C.text : C.bg, color: on ? C.bg : 'transparent',
                      border: `2px solid ${C.text}`, display: 'grid', placeItems: 'center', fontFamily: MONO, fontSize: 12, fontWeight: 600, boxSizing: 'border-box',
                      transition: trans('all .25s'),
                    }}
                  >
                    {m.id}
                  </span>
                </button>
                <span
                  aria-hidden="true" className="jc-sym"
                  style={{
                    position: 'absolute', left: m.x / 10 + '%', top: (m.v >= 0 ? (m.y - 46) / 4.2 : (m.y + 28) / 4.2) + '%', transform: 'translateX(-50%)',
                    fontFamily: MONO, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: C.muted,
                    pointerEvents: 'none', opacity: shown ? 1 : 0, transition: trans(`opacity .4s ease ${delay}`),
                  }}
                >
                  {m.simbolo}
                </span>
              </div>
            );
          })}
        </div>

        <div role="group" aria-label="Marcos" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {MARCOS.map((m) => {
            const on = m.id === act;
            return (
              <button
                key={m.id} type="button" onClick={() => setAct(m.id)} aria-pressed={on} aria-label={`Marco ${m.id}: ${m.titulo}`}
                style={{
                  all: 'unset', cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: MONO,
                  fontSize: 13, fontWeight: 600, background: on ? C.text : C.bg, color: on ? C.bg : C.text, transition: trans('background .25s,color .25s'),
                }}
              >
                {m.id}
              </button>
            );
          })}
        </div>

        <div aria-live="polite" style={{ background: C.bg, borderRadius: 'var(--radius-xl)', padding: 'clamp(24px,5vw,48px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 'var(--space-8)', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <ImageSlot label="Símbolo" shape="circle" style={{ width: 96, height: 96 }} />
            <Eyebrow color={C.accent}>Marco {a.id} · {a.simbolo}</Eyebrow>
            <h3 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.015em' }}>{a.titulo}</h3>
            <p style={{ margin: 0, fontSize: 14, color: C.muted }}>{a.funcao}</p>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, ...tw('pretty') }}>{a.texto}</p>
          </div>
          <ImageSlot label={a.foto || 'Imagem de apoio — ' + a.simbolo} style={{ width: '100%', aspectRatio: '4/3' }} />
        </div>

        <details style={{ maxWidth: 680, margin: '0 auto', width: '100%', borderTop: `1px solid ${C.divider}` }}>
          <summary style={{ minHeight: 48, display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 500, fontSize: 15 }}>Ver os oito marcos em texto</summary>
          <ol style={{ margin: 0, padding: '0 0 16px 22px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15 }}>
            {MARCOS.map((m) => <li key={m.id}><strong style={{ fontWeight: 600 }}>{m.id} · {m.titulo}</strong> — {m.funcao}. {m.texto}</li>)}
          </ol>
        </details>

        <p style={{ margin: '0 auto', maxWidth: 640, fontSize: 14, lineHeight: 1.5, color: C.muted, textAlign: 'center', ...tw('pretty') }}>
          A curva não mostra uma evolução continuamente ascendente após o diagnóstico: houve perdas e dificuldades mesmo depois de iniciar o tratamento.
        </p>
      </div>
    </section>
  );
}

interface CycleSpec {
  kind: 'vicious' | 'virtuous'; eyebrow: string; title: string; idle: string; foot: string; labels: string[];
  arcs: string[]; nodes: { left: string; top: string; max: number }[]; inset: string; color: string; delays: number[]; dur: number;
}

const CYCLES: CycleSpec[] = [
  {
    kind: 'vicious', eyebrow: 'Ciclo vicioso', title: 'Quando a dificuldade alimenta a culpa', idle: 'Ciclo vicioso', foot: '↻ O ciclo pode se repetir',
    labels: VICIOSO, color: C.danger, inset: '24%', dur: 0.7, delays: [0.1, 0.4, 0.7, 1],
    arcs: ['M67.08 11.63 A42 42 0 0 1 88.37 32.92', 'M88.37 67.08 A42 42 0 0 1 67.08 88.37', 'M32.92 88.37 A42 42 0 0 1 11.63 67.08', 'M11.63 32.92 A42 42 0 0 1 32.92 11.63'],
    nodes: [{ left: '50%', top: '8%', max: 150 }, { left: '92%', top: '50%', max: 130 }, { left: '50%', top: '92%', max: 150 }, { left: '8%', top: '50%', max: 130 }],
  },
  {
    kind: 'virtuous', eyebrow: 'Ciclo virtuoso', title: 'Quando a compreensão orienta a ação', idle: 'Ciclo virtuoso', foot: '↻ O aprendizado pode reforçar novas ações',
    labels: VIRTUOSO, color: C.success, inset: '26%', dur: 0.6, delays: [0.3, 0.55, 0.8, 1.05, 1.3],
    arcs: ['M64.36 10.53 A42 42 0 0 1 83.10 24.14', 'M91.97 51.47 A42 42 0 0 1 84.82 73.49', 'M61.58 90.37 A42 42 0 0 1 38.42 90.37', 'M15.18 73.49 A42 42 0 0 1 8.03 51.47', 'M16.90 24.14 A42 42 0 0 1 35.64 10.53'],
    nodes: [{ left: '50%', top: '8%', max: 150 }, { left: '90%', top: '37%', max: 120 }, { left: '75%', top: '84%', max: 140 }, { left: '25%', top: '84%', max: 140 }, { left: '10%', top: '37%', max: 120 }],
  },
];

function Cycle({ spec, shown, reduce, delay }: { spec: CycleSpec; shown: boolean; reduce: boolean; delay: number }) {
  const [act, setAct] = useState<number | null>(null);
  const trans = (v: string) => (reduce ? 'none' : v);
  const marker = 'ar-' + spec.kind;
  return (
    <div
      style={{
        background: C.surface, borderRadius: 'var(--radius-xl)', padding: 'clamp(32px,6vw,48px) clamp(16px,4vw,32px)', display: 'flex', flexDirection: 'column',
        gap: 'var(--space-6)', alignItems: 'center', opacity: shown ? 1 : 0, transform: `translateY(${shown ? 0 : 24}px)`,
        transition: trans(`opacity .8s ease ${delay}s, transform .8s ease ${delay}s`),
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', textAlign: 'center' }}>
        <Eyebrow color={spec.color}>{spec.eyebrow}</Eyebrow>
        <h3 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 24, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{spec.title}</h3>
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: 380, aspectRatio: '1' }}>
        <svg aria-hidden="true" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <marker id={marker} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" style={{ fill: spec.color }} />
            </marker>
          </defs>
          <circle cx="50" cy="50" r="42" fill="none" strokeWidth=".4" strokeDasharray="1 1.5" style={{ stroke: C.divider }} />
          {spec.arcs.map((d, i) => (
            <path
              key={i} d={d} fill="none" pathLength={1} markerEnd={`url(#${marker})`}
              style={{
                stroke: spec.color, strokeWidth: act === i ? 1.6 : 0.7, strokeDasharray: 1, strokeDashoffset: shown ? 0 : 1,
                transition: trans(`stroke-dashoffset ${spec.dur}s ease ${spec.delays[i]}s, stroke-width .25s`),
              }}
            />
          ))}
        </svg>
        <div aria-live="polite" style={{ position: 'absolute', inset: spec.inset, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: C.muted }}>{act === null ? spec.labels.length + ' etapas' : `${act + 1} / ${spec.labels.length}`}</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 17, lineHeight: 1.25, ...tw('balance') }}>{act === null ? spec.idle : spec.labels[act]}</span>
        </div>
        {spec.labels.map((l, i) => {
          const on = act === i;
          return (
            <button
              key={l} type="button" onMouseEnter={() => setAct(i)} onFocus={() => setAct(i)} onMouseLeave={() => setAct(null)} onBlur={() => setAct(null)}
              onClick={() => setAct(on ? null : i)} aria-pressed={on}
              style={{
                position: 'absolute', left: spec.nodes[i].left, top: spec.nodes[i].top, transform: `translate(-50%,-50%) scale(${on ? 1.08 : 1})`,
                maxWidth: spec.nodes[i].max, minHeight: 44, padding: '8px 12px', borderRadius: 14, background: C.raised, border: `1px solid ${C.divider}`,
                fontFamily: 'inherit', fontSize: 13, lineHeight: 1.3, color: C.text, textAlign: 'center', cursor: 'pointer',
                boxShadow: on ? 'var(--shadow-md)' : 'none', transition: trans('transform .25s, box-shadow .25s'),
              }}
            >
              {l}
            </button>
          );
        })}
      </div>
      <ol className="sr-only">{spec.labels.map((l, i) => <li key={l}>{l} leva a {spec.labels[(i + 1) % spec.labels.length].toLowerCase()}</li>)}</ol>
      <p style={{ margin: 0, fontSize: 14, color: C.muted }}>{spec.foot}</p>
    </div>
  );
}

/** 02 · Vicious and virtuous circuits. */
export function CycleDiagrams({ id = 'ciclos' }: { id?: string }) {
  const [ref, inView] = useInView<HTMLElement>(0.2);
  const reduce = useReducedMotion();
  const shown = inView || reduce;
  return (
    <section id={id} ref={ref} aria-labelledby={id + '-h'} style={{ scrollMarginTop: 'var(--tdh-nav-h)', padding: 'clamp(64px,10vw,96px) 22px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        {sectionHead('02 · Dois circuitos com retroalimentação', 'Do ciclo vicioso ao ciclo virtuoso', 'Passe o cursor, toque ou navegue com Tab por cada etapa.', id + '-h')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 'var(--space-6)' }}>
          {CYCLES.map((c, i) => <Cycle key={c.kind} spec={c} shown={shown} reduce={reduce} delay={i * 0.2} />)}
        </div>
        <p style={{ margin: '0 auto', maxWidth: 640, fontSize: 14, lineHeight: 1.5, color: C.muted, textAlign: 'center', ...tw('pretty') }}>
          Esses circuitos representam a minha interpretação da experiência, não uma relação causal comprovada entre todos os acontecimentos. O acidente é um marco da minha vida e não é apresentado como algo necessariamente causado pelo TDAH.
        </p>
      </div>
    </section>
  );
}
