import { decompressFrames, parseGIF, type ParsedFrame } from 'gifuct-js';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { AUTOR_STATS, CLUBE_PASSOS, FONTES, IMG, SUMARIO, TRECHOS } from '../content/jornada2';
import { useReducedMotion } from '../hooks';
import { C, DISPLAY, Eyebrow, MONO, SANS, TARGET, tw } from '../ui';

/* ---------- helpers ---------- */

const cl = (v: number) => Math.min(1, Math.max(0, v));
const V = {
  night: 'var(--tdh-farol-night)', beam: 'var(--tdh-farol-beam)', mist: 'var(--tdh-farol-mist)',
  yellow: 'var(--tdh-book-yellow)', ink: 'var(--tdh-book-ink)', cream: 'var(--tdh-book-cream)',
  paper: 'var(--tdh-paper)', paperInk: 'var(--tdh-paper-ink)', band: 'var(--tdh-paper-band)', paperMuted: 'var(--tdh-paper-muted)',
  faded: 'var(--tdh-paper-faded)', pen: 'var(--tdh-pen)',
};
const marker = (size: string): CSSProperties => ({
  backgroundImage: 'linear-gradient(100deg, rgb(var(--tdh-marker) / 0) 0, rgb(var(--tdh-marker) / .62) 1.2%, rgb(var(--tdh-marker) / .48) 50%, rgb(var(--tdh-marker) / .66) 98.5%, rgb(var(--tdh-marker) / 0) 100%)',
  backgroundRepeat: 'no-repeat', backgroundPosition: '0 62%', backgroundSize: size,
  WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone', padding: '1px 4px', borderRadius: '3px 9px 4px 10px',
});
const big = { fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(40px,5vw,56px)', lineHeight: 1, letterSpacing: '-0.02em' } as const;
const h2 = { margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(32px,4.5vw,48px)', lineHeight: 1.08, letterSpacing: '-0.015em', ...tw('balance') };
const card = { background: C.surface, borderRadius: 'var(--radius-xl)', padding: 32, display: 'flex', flexDirection: 'column' as const, gap: 12 };
const wrap = { maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column' as const, gap: 'var(--space-12)' };
const grid = (min: number, gap = 20): CSSProperties => ({ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${min}px),1fr))`, gap });

function Fn({ n }: { n: number }) {
  return <a href="#fontes" aria-label={`Fonte ${n}`} style={{ fontFamily: MONO, fontSize: 11, verticalAlign: 'super', marginLeft: 2, color: C.link }}>{n}</a>;
}

/** Scroll-driven value for an element: 'pin' = progress through a tall pinned section, 'enter' = reveal while entering. */
function useScrollValue(ref: RefObject<HTMLElement>, mode: 'pin' | 'enter', k = 0.75) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const nv = mode === 'pin' ? cl(-r.top / Math.max(1, r.height - innerHeight)) : cl((innerHeight * k - r.top) / (r.height * 0.85));
      setV((old) => (Math.abs(old - nv) > 0.002 ? nv : old));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    on();
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [ref, mode, k]);
  return v;
}

/** One-shot “has entered” flag (top above `k` of the viewport). */
function useEntered(ref: RefObject<HTMLElement>, k: number) {
  const [inn, setIn] = useState(false);
  useEffect(() => {
    if (inn) return;
    const on = () => { const el = ref.current; if (el && el.getBoundingClientRect().top < innerHeight * k) setIn(true); };
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, [ref, k, inn]);
  return inn;
}

/** Image with graceful placeholder when the file is not available yet. */
function Photo({ src, alt, ratio, radius = 'var(--radius-xl)', style }: { src: string; alt: string; ratio: string; radius?: string; style?: CSSProperties }) {
  const [ok, setOk] = useState(true);
  return (
    <div style={{ borderRadius: radius, overflow: 'hidden', aspectRatio: ratio, background: C.surface, ...style }}>
      {ok
        ? <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : (
          <div role="img" aria-label={alt} style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', padding: 16, boxSizing: 'border-box', border: `1px dashed ${C.divider}`, borderRadius: radius, fontFamily: MONO, fontSize: 'var(--text-micro)', letterSpacing: '.06em', textTransform: 'uppercase', color: C.muted, textAlign: 'center' }}>
            {alt}
          </div>
        )}
    </div>
  );
}

/* ---------- 03 · Farol (scroll-scrubbed lighthouse) ---------- */

const KEY_EVERY = 10;

/** Decodes the GIF once and draws frame i on a canvas, compositing from the nearest cached keyframe. */
function useGifScrubber(src: string, canvasRef: RefObject<HTMLCanvasElement>, enabled: boolean) {
  const st = useRef<{ frames: ParsedFrame[]; w: number; h: number; keys: Map<number, ImageData>; work: HTMLCanvasElement; patch: HTMLCanvasElement; last: number } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    fetch(src).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.arrayBuffer(); }).then((buf) => {
      if (!alive) return;
      // The SPA fallback answers missing files with index.html: only accept real GIF bytes ("GIF8").
      const sig = new Uint8Array(buf.slice(0, 4));
      if (sig[0] !== 0x47 || sig[1] !== 0x49 || sig[2] !== 0x46 || sig[3] !== 0x38) return;
      const gif = parseGIF(buf) as { lsd?: { width: number; height: number } };
      const frames = decompressFrames(gif, true);
      const w = gif.lsd?.width ?? 0, h = gif.lsd?.height ?? 0;
      if (!frames.length || !w || !h) return;
      const work = document.createElement('canvas'); work.width = w; work.height = h;
      const patch = document.createElement('canvas');
      const keys = new Map<number, ImageData>();
      const ctx = work.getContext('2d')!;
      // Build keyframe snapshots in one forward pass.
      try {
        frames.forEach((f, i) => {
          applyFrame(ctx, patch, f, i > 0 ? frames[i - 1] : undefined);
          if (i % KEY_EVERY === 0) keys.set(i, ctx.getImageData(0, 0, w, h));
        });
      } catch { return; }
      st.current = { frames, w, h, keys, work, patch, last: -1 };
      const c = canvasRef.current; if (c) { c.width = w; c.height = h; }
      setReady(true);
    }).catch(() => { /* asset missing: section keeps its night background */ });
    return () => { alive = false; };
  }, [src, enabled, canvasRef]);

  const draw = (i: number) => {
    const s = st.current, c = canvasRef.current;
    if (!s || !c) return;
    i = Math.max(0, Math.min(s.frames.length - 1, i));
    if (i === s.last) return;
    const ctx = s.work.getContext('2d')!;
    const k = Math.floor(i / KEY_EVERY) * KEY_EVERY;
    const key = s.keys.get(k);
    if (!key) return;
    try {
      ctx.putImageData(key, 0, 0);
      for (let j = k + 1; j <= i; j++) applyFrame(ctx, s.patch, s.frames[j], s.frames[j - 1]);
      c.getContext('2d')!.drawImage(s.work, 0, 0);
      s.last = i;
    } catch { /* malformed frame: keep the previous image rather than breaking the page */ }
  };
  return { ready, draw, count: st.current?.frames.length ?? 89 };
}

function applyFrame(ctx: CanvasRenderingContext2D, patchCanvas: HTMLCanvasElement, f: ParsedFrame, prev?: ParsedFrame) {
  if (prev && prev.disposalType === 2) ctx.clearRect(prev.dims.left, prev.dims.top, prev.dims.width, prev.dims.height);
  const { width, height, left, top } = f.dims;
  patchCanvas.width = width; patchCanvas.height = height;
  const pc = patchCanvas.getContext('2d')!;
  pc.putImageData(new ImageData(new Uint8ClampedArray(f.patch), width, height), 0, 0);
  ctx.drawImage(patchCanvas, left, top);
}

export function Farol() {
  const reduce = useReducedMotion();
  const pinRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const p = useScrollValue(pinRef, 'pin');
  const { ready, draw, count } = useGifScrubber(IMG.farol, canvasRef, !reduce);
  const last = count - 1;
  const fi = Math.round(cl(p / 0.75) * last);
  useEffect(() => { if (ready) draw(fi); }, [ready, fi, draw]);

  const y = cl((p - 0.76) / 0.08), e = cl((p - 0.82) / 0.08);
  const p1 = fi >= 10 && fi <= 42, p2 = fi >= 62 && fi < last - 1;

  const intro = (
    <section id="farol" style={{ scrollMarginTop: 'var(--tdh-nav-h)', background: V.night, padding: '120px 22px 32px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
        <Eyebrow color={V.beam}>03 · Ponto de virada</Eyebrow>
        <h2 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(34px,5.5vw,64px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#fff', maxWidth: 760, ...tw('balance') }}>Quando a psicoeducação acendeu a luz.</h2>
        {!reduce && <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: V.mist }}>Role para girar o farol.</p>}
      </div>
    </section>
  );

  const endCard = (opacity: number, ty: number) => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 22px', textAlign: 'center', opacity, transform: `translateY(${ty}px)` }}>
      <Eyebrow color={V.ink}>A segunda passada</Eyebrow>
      <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(44px,8vw,104px)', lineHeight: 1, letterSpacing: '-0.03em', color: V.ink, ...tw('balance') }}>A luz veio de um livro.</p>
    </div>
  );

  if (reduce) {
    // Reduced motion: no scrubbing, no animated GIF — the two passes as text, then the end state.
    return (
      <>
        {intro}
        <section style={{ background: V.night, padding: '0 22px 64px', textAlign: 'center' }}>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(18px,2.2vw,26px)', color: '#fff' }}>
            <li>Primeira passada · o diagnóstico</li>
            <li>Segunda passada · a compreensão</li>
          </ol>
        </section>
        <section style={{ position: 'relative', background: V.yellow, minHeight: '60vh' }}>{endCard(1, 0)}</section>
      </>
    );
  }

  return (
    <>
      {intro}
      <section ref={pinRef} aria-label="Farol: a primeira passada foi o diagnóstico; a segunda, a compreensão. A luz veio de um livro." style={{ position: 'relative', height: '400vh', background: V.night }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: V.night }}>
          <canvas ref={canvasRef} width={800} height={600} aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 40%', opacity: ready ? 1 : 0, transition: 'opacity .4s' }} />
          <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: '5vh', display: 'grid', placeItems: 'center', padding: '0 22px', textAlign: 'center' }}>
            {[['Primeira passada · o diagnóstico', p1], ['Segunda passada · a compreensão', p2]].map(([t, on]) => (
              <span key={t as string} style={{ gridArea: '1/1', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(18px,2.2vw,26px)', color: '#fff', opacity: on ? 1 : 0, transition: 'opacity .35s' }}>{t}</span>
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, background: V.yellow, opacity: y }} />
          {endCard(e, (1 - e) * 30)}
        </div>
      </section>
    </>
  );
}

/* ---------- 04 · Livro ---------- */

export function Livro() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inn = useEntered(ref, 0.85) || reduce;
  const photo = (src: string, alt: string, d: number, ty: number) => (
    <div style={{ opacity: inn ? 1 : 0, transform: inn ? 'none' : `translateY(${ty}px) scale(.96)`, transition: `opacity .9s ease ${d}s, transform 1.1s cubic-bezier(.2,.8,.2,1) ${d}s` }}>
      <Photo src={src} alt={alt} ratio="3/4" style={{ background: V.ink }} />
    </div>
  );
  return (
    <section id="livro" ref={ref} aria-labelledby="livro-h" style={{ scrollMarginTop: 'var(--tdh-nav-h)', background: V.yellow, color: V.ink, padding: '24px 22px 120px' }}>
      <div style={wrap}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <Eyebrow color={V.ink}>04 · O livro</Eyebrow>
          <h2 id="livro-h" style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(44px,8vw,96px)', lineHeight: 1, letterSpacing: '-0.03em', color: V.ink, ...tw('balance') }}>
            Vencendo o TDAH <span style={{ fontWeight: 700 }}>Adulto</span>
          </h2>
          <p style={{ margin: 0, fontFamily: MONO, fontSize: 13, letterSpacing: '.04em' }}>Russell A. Barkley · Christine M. Benton · 2ª edição · Artmed</p>
          <p style={{ margin: 0, fontSize: 'clamp(19px,2.2vw,24px)', lineHeight: 1.4, maxWidth: 680, ...tw('pretty') }}>
            O livro que mudou a forma como passei a interpretar minhas dificuldades. Organizado em cinco passos, ele vai da avaliação às estratégias para trabalho, dinheiro e relacionamentos.
          </p>
        </div>
        <div style={grid(300)}>
          {photo(IMG.capa, 'Capa de Vencendo o TDAH Adulto, 2ª edição', 0, 40)}
          {photo(IMG.estante, 'O livro em mãos, com marcadores de página', 0.15, 70)}
        </div>
        <div style={grid(200)}>
          {[['5', 'passos, da avaliação à vida prática'], ['30', 'capítulos'], ['8', 'regras cotidianas para o sucesso']].map(([n, t]) => (
            <div key={n} style={{ background: V.cream, borderRadius: 'var(--radius-xl)', padding: 28, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={big}>{n}</span><span style={{ fontSize: 15 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 05 · Autor ---------- */

export function Autor() {
  return (
    <section id="autor" aria-labelledby="autor-h" style={{ scrollMarginTop: 'var(--tdh-nav-h)', padding: '96px 22px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', ...grid(280) }}>
        <div style={{ gridColumn: '1/-1', background: C.surface, borderRadius: 'var(--radius-xl)', padding: 'clamp(24px,5vw,40px)', ...grid(300, 40), alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Photo src="/jornada/barkley.jpg" alt="Foto de Russell A. Barkley" ratio="1" radius="24px" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Eyebrow>05 · O autor</Eyebrow>
            <h2 id="autor-h" style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(36px,5vw,56px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>Russell A. Barkley</h2>
            <p style={{ margin: 0, fontSize: 19, lineHeight: 1.5, ...tw('pretty') }}>Psicólogo clínico e pesquisador. Dedicou a carreira à natureza, ao diagnóstico e ao tratamento do TDAH em crianças e adultos.<Fn n={5} /></p>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: C.muted }}>Lecionou na University of Massachusetts Medical Center, na Medical University of South Carolina e na Virginia Commonwealth University, até se aposentar em 2021.<Fn n={6} /></p>
            <p style={{ margin: 0, paddingTop: 16, borderTop: `1px solid ${C.divider}`, fontFamily: DISPLAY, fontWeight: 600, fontSize: 20 }}>
              “O maior especialista na área”
              <span style={{ display: 'block', fontFamily: SANS, fontWeight: 400, fontSize: 13, color: C.muted, marginTop: 4 }}>Capa da edição brasileira</span>
            </p>
          </div>
        </div>
        {AUTOR_STATS.map(([v, t, n]) => (
          <div key={v} style={card}>
            <span style={v.length > 8 ? { fontFamily: DISPLAY, fontWeight: 600, fontSize: 28, lineHeight: 1.1 } : big}>{v}</span>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: C.muted, ...tw('pretty') }}>{t}<Fn n={n} /></p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 06 · Sumário (hand highlights appear while scrolling) ---------- */

export function Sumario() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const raw = useScrollValue(ref, 'enter', 0.75);
  const sp = reduce ? 1 : raw;
  const K = 24;
  let k = 0;
  return (
    <section id="sumario" ref={ref} aria-labelledby="sumario-h" style={{ scrollMarginTop: 'var(--tdh-nav-h)', background: C.surface, padding: '96px 22px' }}>
      <div style={wrap}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <Eyebrow>06 · O sumário</Eyebrow>
          <h2 id="sumario-h" style={h2}>Grifado à mão, capítulo por capítulo.</h2>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: C.muted, maxWidth: 560, ...tw('pretty') }}>Os grifos são os do meu exemplar. Continue rolando para vê-los aparecer.</p>
        </div>
        <div style={{ background: V.paper, color: V.paperInk, borderRadius: 'var(--radius-xl)', padding: 'clamp(24px,5vw,56px)', display: 'flex', flexDirection: 'column', gap: 36, boxShadow: '0 30px 60px -30px rgb(0 0 0 / .25)' }}>
          <span style={{ fontSize: 22, letterSpacing: '.6em', textTransform: 'uppercase', color: V.band, textAlign: 'center' }}>Sumário</span>
          {SUMARIO.map((ps) => (
            <div key={ps.nome} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ position: 'relative', background: V.band, color: '#fff', padding: '14px 20px', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 12, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.85 }}>{ps.nome}</span>
                <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 17, lineHeight: 1.3 }}>{ps.titulo}</span>
                {ps.note && (
                  <span style={{ position: 'absolute', right: 20, top: -34, fontFamily: 'var(--font-hand)', fontSize: 34, color: V.pen, transform: 'rotate(-5deg)', opacity: sp > 0.55 ? 1 : 0, transition: reduce ? 'none' : 'opacity .6s' }}>
                    Leia c/ atenção
                  </span>
                )}
              </div>
              {ps.caps.map(([n, t, pg, hl]) => {
                let v = 0;
                if (hl) { v = cl(sp * (K + 4) - k); k++; }
                return (
                  <div key={n} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr) 36px', gap: 12, alignItems: 'baseline', padding: '3px clamp(4px,3vw,20px)', fontSize: 14, lineHeight: 1.55, letterSpacing: '.03em', textTransform: 'uppercase', color: hl ? V.paperInk : V.faded }}>
                    <span style={{ fontFamily: MONO, fontWeight: 600 }}>{n}</span>
                    <span>
                      <span style={marker(`${(v * 100).toFixed(1)}% 74%`)}>{t}</span>
                      {hl ? <span className="sr-only"> (grifado)</span> : null}
                    </span>
                    <span style={{ fontFamily: MONO, textAlign: 'right', color: V.paperMuted }}>{pg}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={grid(300)}>
          <Photo src={IMG.sumario1} alt="Página original do sumário, primeiro e segundo passos" ratio="4/3" />
          <Photo src={IMG.sumario2} alt="Página original do sumário, terceiro a quinto passos" ratio="4/3" />
        </div>
      </div>
    </section>
  );
}

/* ---------- 07 · Trechos grifados ---------- */

export function Trechos() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const raw = useScrollValue(ref, 'enter', 0.8);
  const qp = reduce ? 1 : raw;
  const sizes = [cl(qp * 2.6), cl(qp * 2.6 - 1.2)];
  const quote = (i: number) => (
    <div key={'q' + i} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <Eyebrow>{TRECHOS[i].ref}</Eyebrow>
      <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(24px,3vw,34px)', lineHeight: 1.3, letterSpacing: '-0.01em', ...tw('pretty') }}>
        <span style={marker(`${(sizes[i] * 100).toFixed(1)}% 74%`)}>{TRECHOS[i].text}</span>
      </p>
    </div>
  );
  return (
    <section id="trechos" ref={ref} aria-labelledby="trechos-h" style={{ scrollMarginTop: 'var(--tdh-nav-h)', padding: '96px 22px' }}>
      <div style={wrap}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <Eyebrow>07 · Trechos grifados</Eyebrow>
          <h2 id="trechos-h" style={h2}>O que ficou marcado.</h2>
        </div>
        <div style={{ ...grid(300), alignItems: 'center' }}>
          <Photo src={TRECHOS[0].img} alt={TRECHOS[0].alt} ratio="1" />
          {quote(0)}
          {quote(1)}
          <Photo src={TRECHOS[1].img} alt={TRECHOS[1].alt} ratio="1" />
        </div>
      </div>
    </section>
  );
}

/* ---------- 08 · Dados ---------- */

export function Dados() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const din = useEntered(ref, 0.7) || reduce;
  const ease = (prop: string, d: string, dur = '1.2s') => (reduce ? 'none' : `${prop} ${dur} cubic-bezier(.2,.8,.2,1) ${d}`);
  const dot = (color: string) => <span aria-hidden="true" style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color, marginRight: 8 }} />;
  const box = { background: C.bg, borderRadius: 'var(--radius-xl)', padding: 32, display: 'flex', flexDirection: 'column' as const, gap: 12 };
  const muted = { margin: 0, fontSize: 15, lineHeight: 1.5, color: C.muted, ...tw('pretty') };
  return (
    <section id="dados" ref={ref} aria-labelledby="dados-h" style={{ scrollMarginTop: 'var(--tdh-nav-h)', background: C.surface, padding: '96px 22px' }}>
      <div style={wrap}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <Eyebrow>08 · TDAH na vida adulta</Eyebrow>
          <h2 id="dados-h" style={h2}>O TDAH não termina na infância.</h2>
        </div>
        <div style={grid(300)}>
          <div style={{ gridColumn: '1/-1', background: C.bg, borderRadius: 'var(--radius-xl)', padding: 'clamp(24px,5vw,40px)', ...grid(280, 40), alignItems: 'center' }}>
            <div role="img" aria-label="Em cada 100 adultos: cerca de 7 com sintomas acima do limiar diagnóstico, dos quais cerca de 3 com TDAH persistente desde a infância."
              style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 8, maxWidth: 340, width: '100%' }}>
              {Array.from({ length: 100 }, (_, i) => (
                <span key={i} style={{
                  aspectRatio: '1', borderRadius: '50%',
                  background: !din ? C.divider : i < 3 ? C.text : i < 7 ? C.accent : C.divider,
                  transform: `scale(${din ? 1 : 0.4})`, transition: reduce ? 'none' : `background .4s ease ${i * 10}ms, transform .4s ease ${i * 10}ms`,
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={big}>6,8%</span><p style={muted}>{dot(C.accent)}dos adultos no mundo têm sintomas de TDAH acima do limiar diagnóstico.<Fn n={1} /></p></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={big}>2,6%</span><p style={muted}>{dot(C.text)}têm TDAH persistente, com início comprovado na infância.<Fn n={1} /></p></div>
            </div>
          </div>
          <div style={{ ...box, gap: 16 }}>
            <span style={big}>90%</span>
            <div aria-hidden="true" style={{ height: 12, borderRadius: 6, background: C.divider, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: din ? '90%' : '0%', background: C.accent, borderRadius: 6, transition: ease('width', '.2s', '1.4s') }} />
            </div>
            <p style={muted}>das crianças acompanhadas no estudo MTA ainda tinham sintomas residuais no início da vida adulta. Só 9,1% tiveram remissão sustentada.<Fn n={2} /></p>
          </div>
          <div style={{ ...box, gap: 16 }}>
            <div role="img" aria-label="Jovens adultos 9,0%; acima de 60 anos 4,5%." style={{ display: 'flex', alignItems: 'flex-end', gap: 24, height: 140 }}>
              {[['9,0%', '100%', C.text, 'Jovens adultos', '.2s'], ['4,5%', '50%', C.muted, 'Acima de 60 anos', '.35s']].map(([v, h, c, l, d]) => (
                <div key={l} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 24 }}>{v}</span>
                  <div style={{ height: din ? h : '0%', background: c, borderRadius: '10px 10px 4px 4px', transition: ease('height', d) }} />
                  <span style={{ fontSize: 13, color: C.muted }}>{l}</span>
                </div>
              ))}
            </div>
            <p style={muted}>A prevalência de sintomas cai com a idade, mas não desaparece.<Fn n={1} /></p>
          </div>
          <div style={box}>
            <Eyebrow>Brasil</Eyebrow>
            <span style={big}>4,4% · 4,5%</span>
            <p style={muted}>prevalência de TDAH adulto nas coortes de nascimento de Pelotas (RS), de 1982 e 1993.<Fn n={3} /></p>
          </div>
          <div style={box}>
            <Eyebrow>Pesquisa de Barkley</Eyebrow>
            <span style={big}>8,4 anos</span>
            <p style={muted}>de redução estimada na expectativa de vida de quem teve TDAH na infância, segundo Barkley e Fischer (2019). Para Barkley, esse risco é modificável com tratamento.<Fn n={4} /></p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 09 · Clube do livro + Fontes ---------- */

export function Clube() {
  return (
    <section id="clube" aria-labelledby="clube-h" style={{ scrollMarginTop: 'var(--tdh-nav-h)', padding: '0 22px 96px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', background: V.yellow, color: V.ink, borderRadius: 'var(--radius-xl)', padding: 'clamp(40px,7vw,80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>
        <Eyebrow color={V.ink}>09 · Clube do livro</Eyebrow>
        <h2 id="clube-h" style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(36px,5.5vw,64px)', lineHeight: 1.05, letterSpacing: '-0.02em', ...tw('balance') }}>Vamos ler juntos, um passo por vez.</h2>
        <p style={{ margin: 0, fontSize: 19, lineHeight: 1.5, maxWidth: 560, ...tw('pretty') }}>Vencendo o TDAH Adulto, de Russell A. Barkley. Cinco passos, trinta capítulos, uma leitura em grupo.</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          {CLUBE_PASSOS.map((p) => <li key={p} style={{ padding: '8px 14px', borderRadius: 'var(--radius-pill)', background: V.cream, fontSize: 13 }}>{p}</li>)}
        </ul>
        <a href="/participe" className="clube-cta"
          style={{ marginTop: 8, minHeight: TARGET, display: 'inline-flex', alignItems: 'center', padding: '0 28px', borderRadius: 'var(--radius-pill)', background: V.ink, color: V.yellow, fontSize: 17, fontWeight: 500, textDecoration: 'none' }}>
          Quero participar
        </a>
      </div>
    </section>
  );
}

export function Fontes() {
  return (
    <section id="fontes" aria-label="Fontes" style={{ scrollMarginTop: 'var(--tdh-nav-h)', maxWidth: 980, margin: '0 auto', padding: '0 22px 64px', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12, lineHeight: 1.5, color: C.muted, boxSizing: 'border-box' }}>
      <Eyebrow>Fontes · consultadas em out. 2026</Eyebrow>
      <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {FONTES.map((f, i) => (
          <li key={i} style={{ overflowWrap: 'anywhere' }}>
            {f.text}{f.italic && <> <em>{f.italic}</em></>}{f.after}{' '}
            {f.links.map(([l, h], j) => <span key={h}>{j > 0 && ' · '}<a href={h} target="_blank" rel="noopener" style={{ color: C.link }}>{l}</a></span>)}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** All v2 sections, in design order, for placement below the cycles. */
export function JornadaV2({ children }: { children?: ReactNode }) {
  return (
    <>
      <Farol />
      <Livro />
      <Autor />
      <Sumario />
      <Trechos />
      <Dados />
      {children}
      <Clube />
      <Fontes />
    </>
  );
}
