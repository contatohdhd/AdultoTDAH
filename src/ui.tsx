import type { CSSProperties, ReactNode } from 'react';

/* Token shortcuts — the only way components reference colour/type. */
export const SANS = 'var(--text-family)';
export const DISPLAY = 'var(--display-family)';
export const MONO = 'var(--font-mono)';
export const C = {
  bg: 'var(--color-bg)', surface: 'var(--color-surface)', raised: 'var(--color-surface-raised)',
  text: 'var(--color-text)', muted: 'var(--color-text-muted)', divider: 'var(--color-divider)',
  accent: 'var(--color-accent)', onAccent: 'var(--color-on-accent)', link: 'var(--color-link)',
  danger: 'var(--color-danger)', success: 'var(--color-success)', warning: 'var(--color-warning)',
  rule: 'var(--tdh-rule)',
};
export const TARGET = 'var(--tdh-target)';

/** Toggle state shared by filters, preference options and legends. */
export const ctl = (on: boolean) => ({
  background: on ? C.surface : 'transparent',
  fontWeight: on ? 600 : 400,
  textDecoration: on ? 'underline' : 'none',
});

/** Decorative “#” marker (hidden from assistive tech). */
export function Hash({ mono = true, weight = 500, color = C.muted }: { mono?: boolean; weight?: number; color?: string }) {
  return <span aria-hidden="true" style={{ fontFamily: mono ? MONO : SANS, fontWeight: weight, color }}>#</span>;
}

/** Short double delimiter line — never full width. */
export function Rule({ width, style }: { width: string | number; style?: CSSProperties }) {
  return <div aria-hidden="true" style={{ width, borderTop: `3px double ${C.rule}`, ...style }} />;
}

/** Mono uppercase eyebrow (official Jornada pattern). */
export function Eyebrow({ children, color = C.muted, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <span style={{ fontFamily: MONO, fontSize: 'var(--text-micro)', letterSpacing: '.08em', textTransform: 'uppercase', color, ...style }}>
      {children}
    </span>
  );
}

/** Words-as-buttons: underlined textual control with a ≥44px target. */
export function WordButton({
  onClick, children, style, className = 'hv-surface', ...rest
}: { onClick: () => void; children: ReactNode; style?: CSSProperties; className?: string } & Record<string, unknown>) {
  return (
    <button
      type="button" onClick={onClick} className={className}
      style={{
        minHeight: TARGET, padding: '0 6px', border: 0, borderRadius: 6, font: `500 var(--text-caption) ${SANS}`, color: C.text,
        cursor: 'pointer', background: 'transparent', textDecoration: 'underline', textUnderlineOffset: 6, ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Option button used in filter / preference groups. */
export function OptButton({ on, onClick, children, label, minWidth }: { on: boolean; onClick: () => void; children: ReactNode; label?: string; minWidth?: boolean }) {
  const c = ctl(on);
  return (
    <button
      type="button" onClick={onClick} aria-pressed={on} aria-label={label} className="hv-surface"
      style={{
        minHeight: TARGET, minWidth: minWidth ? TARGET : undefined, padding: '0 8px', border: 0, borderRadius: 6, background: c.background,
        font: `${c.fontWeight} 15px ${SANS}`, color: C.text, textDecoration: c.textDecoration, textUnderlineOffset: 6,
        textDecorationThickness: 2, cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

/** Official wordmark: “TDAH Adulto” in the display face. */
export function Logo({ size = 21 }: { size?: number }) {
  return (
    <a
      href="/" aria-label="TDAH Adulto, página inicial"
      style={{
        display: 'inline-flex', alignItems: 'center', minHeight: TARGET, fontFamily: DISPLAY, fontWeight: 600, fontSize: size,
        letterSpacing: '-0.01em', color: C.text, textDecoration: 'none', whiteSpace: 'nowrap',
      }}
    >
      TDAH Adulto
    </a>
  );
}

/** Blue action link with › (Apple pattern). */
export function ActionLink({ href, children, size = 17 }: { href: string; children: ReactNode; size?: number }) {
  return (
    <a
      href={href} className="hv-ul"
      style={{ minHeight: TARGET, display: 'inline-flex', alignItems: 'center', padding: '0 6px', borderRadius: 6, color: C.link, font: `400 ${size}px ${SANS}`, textDecoration: 'none' }}
    >
      {children} <span aria-hidden="true" style={{ marginLeft: 4 }}>›</span>
    </a>
  );
}

/** DS Button (size lg, pill): filled accent or outline. Renders <a> when href is given. */
export function PillButton({ children, href, onClick, variant = 'filled', type = 'button' }: {
  children: ReactNode; href?: string; onClick?: () => void; variant?: 'filled' | 'outline'; type?: 'button' | 'submit';
}) {
  const filled = variant === 'filled';
  const style: CSSProperties = {
    minHeight: TARGET, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 22px', boxSizing: 'border-box',
    borderRadius: 'var(--radius-pill)', font: `500 var(--text-body) ${SANS}`, textDecoration: 'none', cursor: 'pointer',
    background: filled ? C.accent : 'transparent', color: filled ? C.onAccent : C.text,
    border: filled ? '1px solid transparent' : `1px solid ${C.divider}`,
  };
  const cls = filled ? 'hv-accent act-accent' : 'hv-outline act-press';
  return href
    ? <a href={href} className={cls} style={style}>{children}</a>
    : <button type={type} onClick={onClick} className={cls} style={style}>{children}</button>;
}

/** Grey authorial title block: short rule, mono H1, long rule (pyramid). */
export function TitleBlock({ children, size, lineHeight = 1.25, padding = '40px 24px 44px', maxWidth, kicker, gap = 22, h1Style }: {
  children: ReactNode; size: string; lineHeight?: number; padding?: string; maxWidth?: number | string;
  kicker?: string; gap?: number; h1Style?: CSSProperties;
}) {
  return (
    <div style={{ width: '100%', maxWidth, background: C.surface, borderRadius: 'var(--radius-lg)', padding, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap, textAlign: 'center' }}>
      {kicker && <Eyebrow>{kicker}</Eyebrow>}
      <Rule width="44%" />
      <h1 id="page-title" tabIndex={-1} style={{ margin: 0, font: `500 ${size}/${lineHeight} ${MONO}`, color: C.text, ...h1Style }}>{children}</h1>
      <Rule width="78%" />
    </div>
  );
}

/** “Em preparação” note for features the brief marks as pending validation. */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <p style={{ margin: 0, padding: 'var(--space-4)', border: `1px dashed ${C.divider}`, borderRadius: 'var(--radius-md)', fontSize: 'var(--text-caption)', lineHeight: 'var(--leading-caption)', color: C.muted }}>
      <strong style={{ fontWeight: 600, color: C.text }}>Em preparação · </strong>{children}
    </p>
  );
}

export const tw = (v: 'balance' | 'pretty') => ({ textWrap: v }) as CSSProperties;
