import { useEffect, useRef, useState } from 'react';
import { QUIZ_AREAS, QUIZ_ATTRIBUTION, QUIZ_DISCLAIMER, QUIZ_FLAT } from '../content/quiz';
import { useReducedMotion } from '../hooks';
import { navigate } from '../router';
import { C, DISPLAY, Hash, MONO, PillButton, SANS, TARGET, tw } from '../ui';

type Ans = { a?: 'sim' | 'nao'; c?: string };
type Answers = Record<string, Ans>;
type Screen = 'intro' | 'q' | 'review' | 'summary';

const KEY = 'tdh-quiz-v1';
const load = (): { idx?: number; answers?: Answers } => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
const save = (idx: number, answers: Answers) => { try { localStorage.setItem(KEY, JSON.stringify({ idx, answers })); } catch { /* storage unavailable */ } };

const linkBtn = { minHeight: TARGET, padding: '0 8px', border: 0, borderRadius: 6, background: 'transparent', font: `400 15px ${SANS}`, color: C.link, cursor: 'pointer' };

/**
 * “Organize suas observações para a consulta” — one statement at a time, Sim/Não with large S/N,
 * “Especifique” comment, pointer showing the share of “Sim”, review, then a screenshot-ready summary.
 */
export function Questionnaire() {
  const saved = useRef(load()).current;
  const [screen, setScreen] = useState<Screen>('intro');
  const [idx, setIdx] = useState(saved.idx || 0);
  const [answers, setAnswers] = useState<Answers>(saved.answers || {});
  const [specOpen, setSpecOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [toast, setToast] = useState('');
  const [editReturn, setEditReturn] = useState(false);
  const [page, setPage] = useState(0);
  const [wide, setWide] = useState(() => window.innerWidth >= 900);
  const reduce = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const theta = useRef(0);
  const raf = useRef(0);
  const adv = useRef<number>();
  const tt = useRef<number>();

  const it = QUIZ_FLAT[idx];
  const r = answers[it.key] || {};
  const vals = Object.values(answers).filter((x) => x && x.a);
  const n = vals.length, sim = vals.filter((x) => x.a === 'sim').length;
  const answered = QUIZ_FLAT.filter((f) => answers[f.key]?.a).length;

  useEffect(() => { save(idx, answers); }, [idx, answers]);
  useEffect(() => {
    const on = () => setWide(window.innerWidth >= 900);
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('resize', on); cancelAnimationFrame(raf.current); clearTimeout(adv.current); clearTimeout(tt.current); };
  }, []);

  // Pointer on an arc: position = share of “Sim” among recorded answers. Brief damped swing after each choice.
  const target = (a: Answers) => { const v = Object.values(a).filter((x) => x?.a); const s = v.filter((x) => x.a === 'sim').length; return v.length ? (s / v.length - 0.5) * 80 : 0; };
  const setDot = (th: number) => {
    const el = dotRef.current; if (!el) return;
    const rad = (th * Math.PI) / 180;
    el.style.left = (150 + 220 * Math.sin(rad)) / 3 + '%';
    el.style.top = (-60 + 220 * Math.cos(rad)) / 2 + '%';
  };
  const placeDot = (T: number, instant = false) => {
    cancelAnimationFrame(raf.current);
    const th0 = theta.current;
    if (instant || reduce) { theta.current = T; setDot(T); return; }
    const t0 = performance.now(), dur = 1100;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur), ts = (t * dur) / 1000;
      theta.current = t >= 1 ? T : T + (th0 - T) * Math.exp(-3.4 * ts) * Math.cos(8 * ts);
      setDot(theta.current);
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => {
      if (screen === 'q') { placeDot(target(answers), true); if (!specOpen) document.getElementById('q-text')?.focus({ preventScroll: true }); }
      const id = screen === 'review' ? 'rv-title' : screen === 'summary' ? 'sum-title' : screen === 'intro' ? 'page-title' : '';
      if (id) document.getElementById(id)?.focus({ preventScroll: true });
    }, 20);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, idx]);
  useEffect(() => { if (specOpen) setTimeout(() => inputRef.current?.focus(), 20); }, [specOpen]);

  const flash = (m: string) => { clearTimeout(tt.current); setToast(m); tt.current = window.setTimeout(() => setToast(''), 2200); };
  const next = () => {
    if (idx >= QUIZ_FLAT.length - 1) { setScreen('review'); setSpecOpen(false); }
    else { setIdx(idx + 1); setSpecOpen(false); setDraft(''); }
  };
  const answer = (a: 'sim' | 'nao') => {
    clearTimeout(adv.current);
    const na = { ...answers, [it.key]: { ...(answers[it.key] || {}), a } };
    setAnswers(na);
    setTimeout(() => placeDot(target(na)), 0);
    if (editReturn) { flash('Alteração salva.'); adv.current = window.setTimeout(() => { setScreen('review'); setEditReturn(false); }, 900); return; }
    flash('Resposta registrada.');
    if (!specOpen) adv.current = window.setTimeout(next, 1150);
  };
  const saveSpec = () => {
    const na = { ...answers, [it.key]: { ...(answers[it.key] || {}), c: draft.trim() } };
    setAnswers(na); setSpecOpen(false);
    flash(editReturn ? 'Alteração salva.' : 'Comentário salvo.');
    clearTimeout(adv.current);
    if (editReturn) adv.current = window.setTimeout(() => { setScreen('review'); setEditReturn(false); }, 900);
    else if (na[it.key].a) adv.current = window.setTimeout(next, 900);
  };
  const back = () => {
    clearTimeout(adv.current);
    if (screen === 'q') {
      if (specOpen) return setSpecOpen(false);
      if (editReturn) { setScreen('review'); setEditReturn(false); return; }
      if (idx === 0) return setScreen('intro');
      return setIdx(idx - 1);
    }
    if (screen === 'review') { setScreen('q'); setIdx(QUIZ_FLAT.length - 1); return; }
    if (screen === 'summary') setScreen('review');
  };
  const backLabel = screen === 'q' ? (idx === 0 ? 'Voltar à apresentação' : 'Voltar à afirmação anterior') : screen === 'review' ? 'Voltar à última afirmação' : 'Voltar à revisão';
  const ansLabel = (x: Ans) => (x.a === 'sim' ? 'Sim' : x.a === 'nao' ? 'Não' : 'Sem resposta');

  const top = (
    <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 56px', alignItems: 'center', padding: '12px 12px 0', minHeight: 64 }}>
      <span />
      <span aria-hidden="true" style={{ justifySelf: 'center', fontFamily: DISPLAY, fontWeight: 600, fontSize: 15, color: C.muted, letterSpacing: '-0.01em' }}>TDAH Adulto</span>
      <button
        type="button" onClick={screen === 'intro' ? () => navigate('/questionarios') : back} aria-label={screen === 'intro' ? 'Voltar aos questionários' : backLabel} className="hv-surface"
        style={{ justifySelf: 'end', width: 48, minHeight: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, border: 0, borderRadius: 'var(--radius-sm)', background: 'transparent', color: C.text, cursor: 'pointer' }}
      >
        <span aria-hidden="true" style={{ font: `500 15px/1 ${MONO}` }}>#</span>
        <span aria-hidden="true" style={{ fontSize: 11, color: C.muted }}>Voltar</span>
      </button>
    </div>
  );

  if (screen === 'summary') return <Summary answers={answers} wide={wide} page={page} setPage={setPage} back={() => setScreen('review')} />;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: 'calc(100dvh - var(--tdh-nav-h))', display: 'flex', flexDirection: 'column' }}>
      {top}
      {screen === 'intro' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28, padding: 'clamp(40px,10vh,96px) 24px 56px', textAlign: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: C.muted }}><Hash /> Questionário</span>
          <h1 id="page-title" tabIndex={-1} style={{ margin: 0, maxWidth: '16ch', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(30px,8vw,40px)', lineHeight: 1.12, letterSpacing: '-0.015em', ...tw('balance') }}>Organize suas observações para a consulta</h1>
          <p style={{ margin: 0, maxWidth: '34ch', fontSize: 18, lineHeight: 1.55, color: C.muted, ...tw('pretty') }}>Responda às afirmações e especifique situações da sua rotina. Ao concluir, visualize suas respostas e tire um print para conversar com seu profissional de saúde.</p>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', background: C.surface, borderRadius: 'var(--radius-lg)', padding: '8px 20px', boxSizing: 'border-box', textAlign: 'left', marginTop: 12 }}>
            {QUIZ_AREAS.map((a, i) => (
              <div key={a.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '16px 0', borderBottom: i < QUIZ_AREAS.length - 1 ? `1px solid ${C.divider}` : 0, fontSize: 16, lineHeight: 1.45 }}>
                <span>{a.name}</span><span style={{ flex: 'none', fontSize: 15, color: C.muted }}>{a.items.length} afirmações</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px 16px', paddingTop: 12 }}>
            <PillButton onClick={() => { setEditReturn(false); setScreen('q'); }}>{answered > 0 ? 'Continuar' : 'Começar'}</PillButton>
            {answered > 0 && <button type="button" className="hv-surface" style={{ ...linkBtn, fontSize: 17 }} onClick={() => { setAnswers({}); setIdx(0); theta.current = 0; setScreen('q'); }}>Recomeçar</button>}
          </div>
          <div style={{ maxWidth: '40ch', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, lineHeight: 1.55, color: C.muted, paddingTop: 20 }}>
            <p style={{ margin: 0 }}>{QUIZ_ATTRIBUTION}</p>
            <p style={{ margin: 0 }}>{QUIZ_DISCLAIMER}</p>
          </div>
        </div>
      )}

      {screen === 'q' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 28, padding: '40px 24px 16px', minHeight: 340 }}>
            <div aria-hidden="true" style={{ position: 'relative', flex: 'none', width: '100%', maxWidth: 360, height: 140, pointerEvents: 'none' }}>
              <svg viewBox="0 0 300 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <path d="M 2.6 95.6 A 220 220 0 0 0 297.4 95.6" fill="none" strokeWidth="1.2" style={{ stroke: C.divider }} />
              </svg>
              <div ref={dotRef} style={{ position: 'absolute', left: '50%', top: '80%', width: 22, height: 22, margin: '-11px 0 0 -11px', borderRadius: '50%', background: 'var(--tdh-mark-ref)', boxShadow: '0 0 0 6px color-mix(in srgb, var(--tdh-mark-ref) 25%, transparent)' }} />
            </div>
            <div role="img" aria-label={n ? `Proporção de Sim: ${sim} de ${n} respostas registradas` : 'Ainda sem respostas registradas'} style={{ position: 'absolute', right: 20, top: 8, fontSize: 13, lineHeight: 1.35, color: C.muted, textAlign: 'right' }}>
              {n ? `Sim · ${sim} de ${n}` : 'Sem respostas'}
            </div>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center', maxWidth: '26ch' }}>
              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, color: C.muted, maxWidth: '30ch' }}>{QUIZ_AREAS[it.ai].name}<br />{it.i + 1} de {it.total}</span>
              <h1 id="q-text" tabIndex={-1} style={{ margin: 0, fontWeight: 500, fontSize: 23, lineHeight: 1.38, letterSpacing: '-0.01em', color: C.text, ...tw('balance') }}>{it.text}</h1>
              <span role="status" style={{ minHeight: 20, fontSize: 14, color: C.muted }}>{toast}</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'end', gap: 16, padding: '16px 20px 36px', minHeight: 184 }}>
            <div role="group" aria-label="Resposta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
              {(['sim', 'nao'] as const).map((v) => {
                const on = r.a === v, other = r.a && r.a !== v;
                return (
                  <button key={v} type="button" onClick={() => answer(v)} aria-pressed={on} className="hv-surface"
                    style={{ display: 'flex', alignItems: 'baseline', minHeight: 64, padding: '0 10px 0 4px', border: 0, borderBottom: `3px double ${on ? C.text : 'transparent'}`, borderRadius: '4px 4px 0 0', background: 'transparent', color: C.text, cursor: 'pointer', fontFamily: SANS }}>
                    <span style={{ fontSize: 60, lineHeight: 1, fontWeight: 400 }}>{v === 'sim' ? 'S' : 'N'}</span>
                    <span style={{ fontSize: 28, lineHeight: 1, color: C.muted, opacity: other ? 0.7 : 1 }}>{v === 'sim' ? 'im' : 'ão'}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 8, minWidth: 0 }}>
              {!specOpen ? (
                <>
                  <button type="button" onClick={() => { clearTimeout(adv.current); setSpecOpen(true); setDraft(r.c || ''); }} aria-expanded={false} aria-controls="spec-panel" className="hv-surface"
                    style={{ minHeight: 48, padding: '0 6px', border: 0, borderRadius: 6, background: 'transparent', font: `400 20px ${SANS}`, color: C.text, textDecoration: 'underline', textUnderlineOffset: 6, textDecorationThickness: 1, cursor: 'pointer' }}>
                    Especifique
                  </button>
                  {r.c?.trim() && <span style={{ fontSize: 14, color: C.muted, textAlign: 'right' }}>Comentário salvo</span>}
                </>
              ) : (
                <div id="spec-panel" role="group" aria-labelledby="spec-label" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label id="spec-label" htmlFor="spec-input" style={{ fontWeight: 500, fontSize: 16 }}>Especifique</label>
                  <span id="spec-help" style={{ fontSize: 14, lineHeight: 1.4, color: C.muted }}>Descreva a situação. Acrescente detalhes.</span>
                  <textarea id="spec-input" ref={inputRef} aria-describedby="spec-help" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)}
                    placeholder="O que aconteceu, em qual contexto e como isso afetou sua atividade."
                    style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 84, border: 0, borderBottom: `1.5px solid ${C.text}`, borderRadius: 0, padding: '6px 0', font: `400 16px/1.45 ${SANS}`, color: C.text, background: 'transparent' }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '2px 4px' }}>
                    <button type="button" onClick={() => setSpecOpen(false)} className="hv-surface" style={{ ...linkBtn, color: C.muted }}>Voltar</button>
                    <button type="button" onClick={saveSpec} className="hv-surface" style={{ ...linkBtn, fontWeight: 500 }}>Salvar comentário</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {screen === 'review' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40, padding: 'clamp(40px,8vh,72px) 20px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h1 id="rv-title" tabIndex={-1} style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 30, lineHeight: 1.15, letterSpacing: '-0.015em' }}>Revise suas respostas</h1>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: C.muted }}>Confira suas escolhas e os detalhes registrados.</p>
            <span role="status" style={{ minHeight: 20, fontSize: 14, color: C.muted }}>{toast}</span>
          </div>
          {QUIZ_AREAS.map((ar, ai) => (
            <section key={ar.key} style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 19, lineHeight: 1.3 }}><Hash /> {ar.name}</h2>
              {QUIZ_FLAT.filter((f) => f.ai === ai).map((f) => {
                const x = answers[f.key] || {}, gi = QUIZ_FLAT.indexOf(f);
                return (
                  <div key={f.key} style={{ borderTop: `1px solid ${C.divider}`, padding: '18px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 16, lineHeight: 1.45 }}><span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 500, color: C.muted }}>{f.id}</span>  {f.text}</span>
                    <span style={{ fontSize: 15 }}>Resposta: <strong style={{ fontWeight: 600 }}>{ansLabel(x)}</strong></span>
                    {x.c?.trim() && <span style={{ fontSize: 15, lineHeight: 1.45, color: C.muted }}>Comentário: {x.c}</span>}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 4px', marginLeft: -8 }}>
                      <button type="button" className="hv-surface" style={linkBtn} onClick={() => { setIdx(gi); setEditReturn(true); setSpecOpen(false); setScreen('q'); }}>Editar resposta</button>
                      <button type="button" className="hv-surface" style={linkBtn} onClick={() => { setIdx(gi); setEditReturn(true); setDraft(x.c || ''); setSpecOpen(true); setScreen('q'); }}>Editar comentário</button>
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
          <div style={{ position: 'sticky', bottom: 0, background: C.bg, padding: '12px 0 20px', borderTop: `1px solid ${C.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, color: C.muted }}>{answered} de {QUIZ_FLAT.length} respondidas</span>
            <PillButton onClick={() => { setPage(0); setScreen('summary'); }}>Concluir</PillButton>
          </div>
        </div>
      )}
    </div>
  );
}

type Blk =
  | { type: 'area'; name: string; l1: string; l2: string; h: number }
  | { type: 'item'; id: string; text: string; ans: string; answered: boolean; c: string; h: number }
  | { type: 'attrib'; h: number };

/** Screenshot-ready record, split into numbered phone-sized screens. */
function Summary({ answers, wide, page, setPage, back }: { answers: Answers; wide: boolean; page: number; setPage: (n: number) => void; back: () => void }) {
  const perLine = 34, lh = 19.5;
  const cap = Math.max(560, Math.min(window.innerHeight, 900) - 90);
  const blocks: Blk[] = [];
  QUIZ_AREAS.forEach((ar) => {
    const its = QUIZ_FLAT.filter((f) => f.key[0] === ar.key);
    const a = its.map((f) => answers[f.key] || {});
    const s = a.filter((x) => x.a === 'sim').length, nn = a.filter((x) => x.a === 'nao').length;
    blocks.push({ type: 'area', name: ar.name, l1: `${s + nn} de ${its.length} afirmações respondidas.`, l2: `Sim: ${s} · Não: ${nn} · Sem resposta: ${its.length - s - nn}.`, h: 78 });
    its.forEach((f) => {
      const x = answers[f.key] || {}, c = (x.c || '').trim();
      const ans = x.a === 'sim' ? 'Sim' : x.a === 'nao' ? 'Não' : 'Sem resposta';
      const h = Math.ceil(f.text.length / perLine) * lh + 10 + (c ? Math.ceil(('Comentário: ' + c).length / (perLine + 4)) * 18.5 + 12 : 0) + (x.a ? 0 : 8);
      blocks.push({ type: 'item', id: f.id, text: f.text, ans, answered: !!x.a, c, h });
    });
  });
  blocks.push({ type: 'attrib', h: 150 });
  const pages: Blk[][] = [];
  let cur: Blk[] = [], used = 88;
  blocks.forEach((b) => { if (used + b.h > cap && cur.length) { pages.push(cur); cur = []; used = 20; } cur.push(b); used += b.h + 14; });
  if (cur.length) pages.push(cur);
  const pc = pages.length;

  useEffect(() => { setTimeout(() => document.getElementById('sum-title')?.focus({ preventScroll: true }), 20); }, []);

  return (
    <div style={{ background: C.bg, padding: '12px 0 56px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={back} className="hv-surface" style={linkBtn}>‹ Voltar à revisão</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, paddingTop: 12 }}>
        {pages.map((pg, i) => (wide || i === page) && (
          <section key={i} aria-label={`Registro ${i + 1} de ${pc}`}
            style={{ width: '100%', maxWidth: 430, minHeight: wide ? 'auto' : 'calc(100dvh - 120px)', boxSizing: 'border-box', padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14, background: C.bg, border: wide ? `1px solid ${C.divider}` : 0, borderRadius: 'var(--radius-md)' }}>
            {i === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 4 }}>
                <h1 id="sum-title" tabIndex={-1} style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, lineHeight: 1.15, letterSpacing: '-0.015em' }}>Seu registro</h1>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.45 }}>Tire um print para mostrar ao seu profissional de saúde.</p>
              </div>
            )}
            {pg.map((b, j) => {
              if (b.type === 'area') return (
                <div key={j} style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 6, borderTop: `3px double ${C.rule}` }}>
                  <span style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35, paddingTop: 8 }}><Hash /> {b.name}</span>
                  <span style={{ fontSize: 13, lineHeight: 1.45, color: C.muted }}>{b.l1}<br />{b.l2}</span>
                </div>
              );
              if (b.type === 'item') return (
                <div key={j} style={{ display: 'grid', gridTemplateColumns: '20px minmax(0,1fr) auto', gap: '2px 8px', alignItems: 'baseline', padding: '2px 0 6px', borderBottom: `1px solid ${C.divider}` }}>
                  <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 500, color: C.muted }}>{b.id}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.38 }}>{b.text}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: b.answered ? C.text : C.muted, textAlign: 'right' }}>{b.ans}</span>
                  {b.c && <><span /><span style={{ gridColumn: '2 / 4', fontSize: 13, lineHeight: 1.4, color: C.muted, background: C.surface, borderRadius: 4, padding: '4px 8px' }}>Comentário: {b.c}</span></>}
                </div>
              );
              return (
                <div key={j} style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 10, borderTop: `3px double ${C.rule}`, fontSize: 12.5, lineHeight: 1.45, color: C.muted }}>
                  <span>{QUIZ_ATTRIBUTION}</span>
                  <span>Adaptação de interface: respostas Sim/Não e comentários individuais.</span>
                  <span style={{ color: C.text }}>{QUIZ_DISCLAIMER}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingTop: 6 }}>
              <span style={{ fontSize: 14, color: C.muted }}>Registro {i + 1} de {pc}</span>
              {!wide && pc > 1 && (
                <div style={{ display: 'flex', gap: 2 }}>
                  {i > 0 && <button type="button" className="hv-surface" style={linkBtn} onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }}>Tela anterior</button>}
                  {i < pc - 1 && <button type="button" className="hv-surface" style={linkBtn} onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}>Próxima tela</button>}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
