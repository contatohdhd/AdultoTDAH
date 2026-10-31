import { useRef, useState } from 'react';
import type { Imagem } from '../content/temas';
import { useReducedMotion } from '../hooks';
import { C, MONO, SANS, TARGET } from '../ui';

/**
 * Image from public/temas. Animated images (originally GIFs) show a still frame by default — no
 * autoplay, per the reading/ADHD brief — and play while hovered or after tapping “Animar”.
 * With “Reduzir movimento” they never move.
 */
export function TemaMedia({ img, ratio, fit = 'cover', eager = false, button = true }: { img: Imagem; ratio?: string; fit?: 'cover' | 'contain'; eager?: boolean; button?: boolean }) {
  const reduce = useReducedMotion();
  const [play, setPlay] = useState(false);
  const vref = useRef<HTMLVideoElement>(null);
  const canAnimate = img.animated && !reduce;
  const start = () => { if (!canAnimate) return; setPlay(true); vref.current?.play().catch(() => {}); };
  const stop = () => { setPlay(false); const v = vref.current; if (v) { v.pause(); v.currentTime = 0; } };
  const fill = { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: fit, display: 'block' };
  return (
    <div onMouseEnter={start} onMouseLeave={stop}
      style={{ position: 'relative', aspectRatio: ratio, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: C.surface }}>
      {ratio
        ? <img src={`/temas/${img.slug}.jpg`} alt={img.alt} loading={eager ? 'eager' : 'lazy'} style={fill} />
        : <img src={`/temas/${img.slug}.jpg`} alt={img.alt} loading={eager ? 'eager' : 'lazy'} style={{ width: '100%', height: 'auto', display: 'block' }} />}
      {canAnimate && (
        <video ref={vref} src={`/temas/${img.slug}.mp4`} muted loop playsInline preload="none" aria-hidden="true"
          style={{ ...fill, opacity: play ? 1 : 0, transition: 'opacity var(--duration-fast)' }} />
      )}
      {canAnimate && button && (
        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (play) stop(); else start(); }}
          aria-pressed={play} aria-label={(play ? 'Pausar' : 'Animar') + ' a imagem: ' + img.legenda}
          style={{ position: 'absolute', right: 8, bottom: 8, minHeight: TARGET, padding: '0 14px', border: 0, borderRadius: 'var(--radius-pill)', background: 'color-mix(in srgb, var(--color-bg) 82%, transparent)', color: C.text, font: `500 13px ${SANS}`, cursor: 'pointer', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          {play ? 'Pausar' : 'Animar'}
        </button>
      )}
    </div>
  );
}

/** Inline figure placed inside a post, next to the chapter it relates to. */
export function TemaFigure({ img, cap, capTitle }: { img: Imagem; cap?: number; capTitle?: string }) {
  return (
    <figure style={{ margin: 'var(--space-8) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ maxWidth: 520, width: '100%', margin: '0 auto' }}><TemaMedia img={img} /></div>
      <figcaption style={{ textAlign: 'center', fontSize: 14, lineHeight: 1.45, color: C.muted }}>
        <span style={{ fontWeight: 600, color: C.text }}>{img.legenda}</span>
        {cap && <> · <span style={{ fontFamily: MONO }}>Cap. {cap}</span>{capTitle ? ` — ${capTitle}` : ''}</>}
      </figcaption>
    </figure>
  );
}
