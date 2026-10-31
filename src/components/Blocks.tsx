import { useState, type ReactNode } from 'react';
import { FAQ, type HomeBlock, type Piece } from '../content/home';
import { STEPS, STEPS_INTRO, type Step } from '../content/steps';
import { ActionLink, C, DISPLAY, Eyebrow, MONO, Pending, PillButton, Rule, SANS, TARGET, tw } from '../ui';
import { Chevron } from './Article';
import { postDoPasso } from '../content/temas';
import { TemaFigure, TemaMedia } from './Temas';

export const bodyText = { margin: 0, fontSize: 'var(--text-body)', lineHeight: 1.6, ...tw('pretty') };

/** Renders the structured copy pieces of a block. */
export function Pieces({ items }: { items: Piece[] }) {
  return (
    <>
      {items.map((it, i) => {
        switch (it.kind) {
          case 'p': return <p key={i} style={bodyText}>{it.text}</p>;
          case 'muted': return <p key={i} style={{ ...bodyText, color: C.muted, fontSize: 'var(--text-caption)', lineHeight: 'var(--leading-caption)' }}>{it.text}</p>;
          case 'h3': return <h3 key={i} style={{ margin: 'var(--space-6) 0 0', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'var(--text-card)', lineHeight: 'var(--leading-card)' }}>{it.text}</h3>;
          case 'list': return <ul key={i} style={{ margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 8, lineHeight: 1.55 }}>{it.items.map((x) => <li key={x}>{x}</li>)}</ul>;
          case 'pending': return <Pending key={i}>{it.text}</Pending>;
          case 'quote': return <p key={i} style={{ margin: 'var(--space-4) 0', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'var(--text-subtitle)', lineHeight: 'var(--leading-subtitle)', letterSpacing: '-0.01em', ...tw('balance') }}>{it.text}</p>;
          case 'dl':
            return (
              <dl key={i} style={{ margin: 0, display: 'grid', gridTemplateColumns: 'max-content minmax(0,1fr)', gap: '10px 24px', padding: 'var(--space-6)', background: C.surface, borderRadius: 'var(--radius-lg)' }}>
                {it.items.map(([k, v]) => [<dt key={k} style={{ color: C.muted, fontSize: 'var(--text-caption)' }}>{k}</dt>, <dd key={k + 'd'} style={{ margin: 0, overflowWrap: 'anywhere' }}>{v}</dd>])}
              </dl>
            );
          case 'cards':
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 'var(--space-4)', width: '100%' }}>
                {it.items.map((c) => (
                  <div key={c.title} style={{ background: C.bg, borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', textAlign: 'left' }}>
                    <Rule width={40} />
                    <h3 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'var(--text-card)', lineHeight: 'var(--leading-card)' }}>{c.title}</h3>
                    {c.paras.map((p) => <p key={p} style={{ ...bodyText, color: C.muted, fontSize: 16 }}>{p}</p>)}
                  </div>
                ))}
              </div>
            );
        }
      })}
    </>
  );
}

/** Block wrapper: letter/movement eyebrow · H2 · lead · content · CTA. Alternates bg/surface. */
export function BlockShell({ id, eyebrow, title, lead, tone = 'bg', children, cta, wide = false, center = true, headingLevel = 2 }: {
  id?: string; eyebrow?: string; title: string; lead?: string; tone?: 'bg' | 'surface'; children?: ReactNode;
  cta?: { label: string; href: string }; wide?: boolean; center?: boolean; headingLevel?: 1 | 2;
}) {
  const H = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <section id={id} aria-labelledby={id ? id + '-h' : undefined} style={{ scrollMarginTop: 'var(--tdh-nav-h)', background: tone === 'surface' ? C.surface : C.bg, padding: 'clamp(64px,10vw,112px) 22px' }}>
      <div style={{ maxWidth: wide ? 980 : 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', alignItems: center ? 'center' : 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: center ? 'center' : 'flex-start', textAlign: center ? 'center' : 'left' }}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <H id={id ? id + '-h' : headingLevel === 1 ? 'page-title' : undefined} tabIndex={headingLevel === 1 ? -1 : undefined}
            style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: headingLevel === 1 ? 'clamp(36px,6vw,64px)' : 'clamp(30px,4.5vw,48px)', lineHeight: 1.08, letterSpacing: '-0.015em', maxWidth: 820, ...tw('balance') }}>
            {title}
          </H>
          {lead && <p style={{ margin: 0, fontSize: 'var(--text-lead)', lineHeight: 'var(--leading-lead)', color: C.muted, maxWidth: 640, ...tw('pretty') }}>{lead}</p>}
        </div>
        {children && <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', textAlign: 'left' }}>{children}</div>}
        {cta && <div style={{ paddingTop: 'var(--space-2)' }}><ActionLink href={cta.href}>{cta.label}</ActionLink></div>}
      </div>
    </section>
  );
}

export const eyebrowOf = (b: HomeBlock) => `${b.letter} · ${b.movement}`;

/** A home block in summary mode (first `homeCount` pieces + CTA to its page). */
export function HomeBlockSection({ b, tone }: { b: HomeBlock; tone: 'bg' | 'surface' }) {
  if (b.special === 'steps') return <StepsOverview id={b.id} eyebrow={eyebrowOf(b)} title={b.title} tone={tone} />;
  if (b.special === 'faq') {
    return (
      <BlockShell id={b.id} eyebrow={eyebrowOf(b)} title={b.title} tone={tone} cta={b.cta}>
        <FaqList items={FAQ.slice(0, 4)} />
      </BlockShell>
    );
  }
  if (b.special === 'form') {
    return (
      <BlockShell id={b.id} eyebrow={eyebrowOf(b)} title={b.title} lead={b.lead} tone={tone}>
        <Pieces items={b.body.slice(0, b.homeCount)} />
        <SuggestForm compact />
      </BlockShell>
    );
  }
  const cards = b.body.some((x) => x.kind === 'cards');
  return (
    <BlockShell id={b.id} eyebrow={eyebrowOf(b)} title={b.title} lead={b.lead} tone={tone} cta={b.cta} wide={cards}>
      <Pieces items={b.body.slice(0, b.homeCount)} />
    </BlockShell>
  );
}

/** Block D overview: the five steps as cards. */
export function StepsOverview({ id, eyebrow, title, tone, headingLevel = 2 }: { id?: string; eyebrow?: string; title: string; tone: 'bg' | 'surface'; headingLevel?: 1 | 2 }) {
  return (
    <BlockShell id={id} eyebrow={eyebrow} title={title} tone={tone} wide headingLevel={headingLevel}>
      <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {STEPS_INTRO.map((p) => <p key={p} style={{ ...bodyText, textAlign: 'center' }}>{p}</p>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
        {STEPS.map((s) => (
          <a
            key={s.n} href={'/passos/' + s.n} className="hv-raised"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-8)', borderRadius: 'var(--radius-xl)', background: tone === 'surface' ? C.bg : C.surface, color: C.text, textDecoration: 'none', minHeight: 260, boxSizing: 'border-box' }}
          >
            {postDoPasso(s.n) && <div style={{ margin: 'calc(-1 * var(--space-4)) calc(-1 * var(--space-4)) var(--space-2)' }}><TemaMedia img={postDoPasso(s.n)!.capa} ratio="16/10" button={false} /></div>}
            <Eyebrow>{s.n} · {s.label}</Eyebrow>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'var(--text-card)', lineHeight: 'var(--leading-card)' }}>{s.title}</span>
            <span style={{ fontSize: 15, color: C.muted, lineHeight: 1.5 }}>Capítulos {s.chapters[0][0]} a {s.chapters[s.chapters.length - 1][0]} · publicação a definir</span>
            <span style={{ marginTop: 'auto', color: C.link, fontSize: 17 }}>{s.cta} <span aria-hidden="true">›</span></span>
          </a>
        ))}
      </div>
    </BlockShell>
  );
}

export function ChapterList({ step, withImages = false }: { step: Step; withImages?: boolean }) {
  const post = withImages ? postDoPasso(step.n) : undefined;
  const at = (n: number) => (post ? post.imagens.filter((x) => x.cap === n) : []);
  // Split the list where an image belongs, so figures sit between chapters (valid list markup).
  const groups: { figs: ReturnType<typeof at>; chapters: Step['chapters'] }[] = [];
  step.chapters.forEach((c) => {
    const figs = at(c[0]);
    if (figs.length || !groups.length) groups.push({ figs, chapters: [c] });
    else groups[groups.length - 1].chapters.push(c);
  });
  const row = ([n, t, pg]: Step['chapters'][number]) => (
    <li key={n} style={{ display: 'grid', gridTemplateColumns: '2.5em minmax(0,1fr) auto', gap: 12, alignItems: 'baseline', padding: '12px 0', borderTop: `1px solid ${C.divider}` }}>
      <span style={{ fontFamily: MONO, color: C.muted, fontSize: 14 }}>{n}.</span>
      <span>{t}</span>
      <span style={{ fontFamily: MONO, color: C.muted, fontSize: 14, whiteSpace: 'nowrap' }}>p. {pg}</span>
    </li>
  );
  return (
    <>
      {groups.map((g, i) => (
        <div key={i}>
          {g.figs.map((f) => <TemaFigure key={f.img.slug} img={f.img} cap={f.cap} capTitle={step.chapters.find((c) => c[0] === f.cap)?.[1]} />)}
          <ol start={g.chapters[0][0]} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>{g.chapters.map(row)}</ol>
        </div>
      ))}
    </>
  );
}

/** Full step page content. */
export function StepDetail({ step }: { step: Step }) {
  const prev = STEPS[step.n - 2], next = STEPS[step.n];
  return (
    <>
      <BlockShell eyebrow={`${step.label} · Capítulos ${step.chapters[0][0]}–${step.chapters[step.chapters.length - 1][0]}`} title={step.title} lead={step.motto} headingLevel={1}>
        {postDoPasso(step.n) && (
          <figure style={{ margin: '0 auto var(--space-4)', width: '100%', maxWidth: 560 }}>
            <TemaMedia img={postDoPasso(step.n)!.capa} eager />
            <figcaption className="sr-only">Capa: {postDoPasso(step.n)!.capa.legenda}</figcaption>
          </figure>
        )}
        {step.paras.map((p) => <p key={p} style={bodyText}>{p}</p>)}
        <div style={{ background: C.surface, borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <Eyebrow>Você encontrará</Eyebrow>
          <p style={{ ...bodyText, fontSize: 'var(--text-card)', lineHeight: 1.4, fontFamily: DISPLAY, fontWeight: 600 }}>{step.find}</p>
          <span style={{ fontSize: 14, color: C.muted }}>Arquitetura editorial proposta. Os conteúdos ainda não foram publicados.</span>
        </div>
        <h2 style={{ margin: 'var(--space-8) 0 0', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'var(--text-subtitle)', lineHeight: 'var(--leading-subtitle)' }}>
          Capítulos de referência — {step.chapters[0][0]} a {step.chapters[step.chapters.length - 1][0]}
        </h2>
        <ChapterList step={step} withImages />
        <Pending>{step.cta} · data de publicação a definir.</Pending>
        <nav aria-label="Outros passos" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 'var(--space-8)' }}>
          {prev ? <ActionLink href={'/passos/' + prev.n}>‹ {prev.label}</ActionLink> : <ActionLink href="/passos">Os cinco passos</ActionLink>}
          {next && <ActionLink href={'/passos/' + next.n}>{next.label}</ActionLink>}
        </nav>
      </BlockShell>
    </>
  );
}

/** FAQ as disclosures (same pattern as “Sobre este artigo”). */
export function FaqList({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ width: '100%', borderBottom: `1px solid ${C.divider}` }}>
      {items.map(([q, a], i) => {
        const on = open === i;
        return (
          <div key={q} style={{ borderTop: `1px solid ${C.divider}` }}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on} aria-controls={'faq-' + i} className="hv-surface"
                style={{ width: '100%', minHeight: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, border: 0, background: 'transparent', padding: '12px 4px', font: `600 17px/1.35 ${SANS}`, color: C.text, cursor: 'pointer', textAlign: 'left' }}
              >
                <span>{q}</span><Chevron open={on} />
              </button>
            </h3>
            {on && <p id={'faq-' + i} style={{ ...bodyText, padding: '0 4px 20px', color: C.muted }}>{a}</p>}
          </div>
        );
      })}
    </div>
  );
}

/** Block N — topic suggestion. No backend yet: the text is kept on the device and can be copied. */
export function SuggestForm({ compact = false }: { compact?: boolean }) {
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [msg, setMsg] = useState('');
  const topics = ['Avaliação', 'Tratamento', 'Autocontrole', 'Organização', 'Trabalho', 'Relacionamentos', 'Finanças', 'Outras áreas'];
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { setMsg('Escreva sua dúvida antes de enviar.'); return; }
    const payload = (topic ? `[${topic}] ` : '') + text.trim();
    (navigator.clipboard ? navigator.clipboard.writeText(payload) : Promise.reject())
      .then(() => setMsg('O envio online ainda está em preparação. Sua pergunta foi copiada para você enviar pelo contato.'))
      .catch(() => setMsg('O envio online ainda está em preparação. Copie sua pergunta e envie pelo contato.'));
  };
  const field = { width: '100%', boxSizing: 'border-box' as const, border: `1px solid ${C.divider}`, borderRadius: 'var(--radius-md)', padding: '12px 14px', font: `400 17px/1.45 ${SANS}`, color: C.text, background: C.bg };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', background: C.surface, borderRadius: 'var(--radius-xl)', padding: compact ? 'var(--space-6)' : 'var(--space-8)', marginTop: 'var(--space-4)' }}>
      <label htmlFor="sg-q" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'var(--text-card)' }}>Qual é a sua principal dúvida sobre o TDAH adulto?</label>
      <textarea id="sg-q" rows={4} value={text} onChange={(e) => setText(e.target.value)} aria-describedby="sg-help" style={{ ...field, resize: 'vertical' }} placeholder="Escreva sua dúvida sem dados clínicos ou pessoais sensíveis." />
      <span id="sg-help" style={{ fontSize: 14, color: C.muted }}>Não é necessário compartilhar dados clínicos ou informações pessoais sensíveis.</span>
      <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '4px 8px' }}>
        <legend style={{ fontSize: 14, color: C.muted, marginBottom: 6 }}>Tema (opcional)</legend>
        {topics.map((t) => (
          <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(topic === t ? '' : t)} className="hv-outline"
            style={{ minHeight: TARGET, padding: '0 14px', borderRadius: 'var(--radius-pill)', border: `1px solid ${topic === t ? C.text : C.divider}`, background: topic === t ? C.text : 'transparent', color: topic === t ? C.bg : C.text, font: `400 15px ${SANS}`, cursor: 'pointer' }}>
            {t}
          </button>
        ))}
      </fieldset>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-4)' }}>
        <PillButton type="submit">Envie sua pergunta</PillButton>
        <span style={{ fontSize: 14, color: C.muted }}>Finalidade: orientar próximos artigos, questionários e materiais.</span>
      </div>
      <span role="status" style={{ fontSize: 15, minHeight: 22 }}>{msg}</span>
      <Pending>Envio online com informações claras sobre finalidade e tratamento dos dados. Consulte a <a href="/privacidade" style={{ color: C.link }}>política de privacidade</a>.</Pending>
    </form>
  );
}
