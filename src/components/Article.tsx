import { useState, type CSSProperties } from 'react';
import { ARTICLES, type Article as Art, type Seg } from '../content/articles';
import { FONTS, SIZES, SPACING, type Prefs } from '../prefs';
import { Hash, Rule, SANS, TitleBlock } from '../ui';
import { FlowR1, PrefsSection, Scheme, Tools, Waffle } from './Figures';
import { Treemap } from './Treemap';
import { SOURCES, SourceLegend, SourceTag } from './Sources';


interface Props {
  art: Art; prefs: Prefs; setPrefs: (p: Partial<Prefs>) => void; resetPrefs: () => void;
  aboutOpen: boolean; setAboutOpen: (o: boolean) => void;
  wide: boolean; reduce: boolean; revealed: Record<string, boolean>; tmPulse: boolean; flowRot: boolean;
}

function Segment({ s, reduce, revealed }: { s: Seg; reduce: boolean; revealed: Record<string, boolean> }) {
  if (s.kind === 'plain') return <>{s.text}</>;
  if (s.kind === 'link') {
    return (
      <a href={s.href} className="hv-thick" style={{ color: 'var(--color-text)', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3, fontWeight: 500 }}>
        {s.text}
      </a>
    );
  }
  const c = SOURCES[s.src].color;
  return (
    <>
    <mark
      data-hl={s.id}
      style={{
        color: 'inherit', backgroundColor: 'transparent', backgroundImage: `linear-gradient(${c},${c})`, backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 0', backgroundSize: `${reduce || revealed[s.id] ? '100%' : '0%'} 100%`,
        transition: reduce ? 'none' : 'background-size 900ms cubic-bezier(.2,.7,.2,1)', WebkitBoxDecorationBreak: 'clone',
        boxDecorationBreak: 'clone', padding: '0.06em 0.1em', borderRadius: 2,
      }}
    >
      {s.text}
    </mark>
    <SourceTag src={s.src} />
    </>
  );
}

export function Article({ art, aboutOpen, setAboutOpen, prefs, setPrefs, resetPrefs, wide, reduce, revealed, tmPulse, flowRot }: Props) {
  const [shareMsg, setShareMsg] = useState('');
  const sp = SPACING[prefs.spacing] || SPACING[0];
  const url = location.origin + '/artigos/' + art.key;
  const shareText = art.title + ' · TDAH Adulto';
  const next = ARTICLES[(ARTICLES.indexOf(art) + 1) % 3];
  const copyLink = (msg?: string) => {
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
      .then(() => setShareMsg(msg || 'Link copiado.'))
      .catch(() => setShareMsg('Não foi possível copiar. Copie o endereço na barra do navegador.'));
  };
  const shareIG = () => {
    if (navigator.share) navigator.share({ title: shareText, url }).then(() => setShareMsg('Compartilhado.')).catch(() => {});
    else copyLink('O Instagram não aceita compartilhamento por link na web. Link copiado: cole nos Stories ou na bio pelo app.');
  };
  const shareLink = {
    minHeight: 44, display: 'flex', alignItems: 'center', padding: '0 8px', borderRadius: 6, font: `500 16px ${SANS}`, color: 'var(--color-text)',
    textDecoration: 'underline', textUnderlineOffset: 6,
  };
  const shareBtn = { ...shareLink, border: 0, background: 'transparent', cursor: 'pointer' };
  const dt = { font: `400 14px ${SANS}`, color: 'var(--color-text-muted)' };

  return (
    <article style={{ maxWidth: 680, margin: '0 auto', paddingTop: 'clamp(32px,6vw,72px)', display: 'flex', flexDirection: 'column' }}>
      <TitleBlock size={wide ? '30px' : '24px'} lineHeight={1.28} padding="40px 20px 44px" h1Style={{ textWrap: 'balance', maxWidth: '24ch' } as CSSProperties}>
        {art.title}
      </TitleBlock>

      <div
        style={{
          marginTop: 'clamp(64px,14vh,144px)', display: 'flex', flexDirection: 'column', gap: sp.pg, fontFamily: FONTS[prefs.font],
          fontSize: SIZES[prefs.size] + 'px', lineHeight: sp.lh, letterSpacing: sp.ls, wordSpacing: sp.ws,
          maxWidth: prefs.width ? '56ch' : '68ch', color: 'var(--color-text)',
        }}
      >
        {art.blocks.map((b, i) => {
          switch (b.type) {
            case 'h':
              return (
                <h2
                  key={b.id} id={b.id} tabIndex={-1}
                  style={{ margin: `${sp.hm} 0 0`, font: `600 1.3em/1.25 ${SANS}`, letterSpacing: 0, wordSpacing: 0, scrollMarginTop: 24, textWrap: 'balance' } as CSSProperties}
                >
                  <Hash /> {b.text}
                </h2>
              );
            case 'p':
              return (
                <p key={i} style={{ margin: 0, textWrap: 'pretty' } as CSSProperties}>
                  {b.segs.map((s, j) => <Segment key={j} s={s} reduce={reduce} revealed={revealed} />)}
                </p>
              );
            case 'callout':
              return (
                <aside
                  key={i} aria-label={b.kicker}
                  style={{
                    margin: 'clamp(32px,6vw,56px) 0', background: 'var(--color-surface)', borderRadius: 4, aspectRatio: '4/3', display: 'flex',
                    flexDirection: 'column', justifyContent: 'flex-end', gap: 12, padding: 'clamp(20px,6%,40px)', letterSpacing: 0, wordSpacing: 0,
                  }}
                >
                  <span style={{ font: `400 14px/1.3 ${SANS}`, color: 'var(--color-text-muted)' }}><span aria-hidden="true">#</span> {b.kicker}</span>
                  <span style={{ font: `500 1.35em/1.3 ${SANS}`, color: 'var(--color-text)', textWrap: 'balance' } as CSSProperties}>{b.text}</span>
                  {b.note && <span style={{ font: `400 15px/1.5 ${SANS}`, color: 'var(--color-text-muted)' }}>{b.note}</span>}
                </aside>
              );
            case 'treemap': return <Treemap key={i} pulse={tmPulse} reduce={reduce} />;
            case 'waffle': return <Waffle key={i} />;
            case 'flow': return <FlowR1 key={i} rot={flowRot} reduce={reduce} />;
            case 'scheme': return <Scheme key={i} />;
            case 'tools': return <Tools key={i} />;
            case 'prefs': return <PrefsSection key={i} prefs={prefs} setPrefs={setPrefs} reset={resetPrefs} />;
          }
        })}
      </div>

      <section style={{ marginTop: 'clamp(96px,14vw,160px)', borderTop: '1px solid var(--color-divider)', borderBottom: '1px solid var(--color-divider)' }}>
        <button
          type="button" onClick={() => setAboutOpen(!aboutOpen)} aria-expanded={aboutOpen} aria-controls="about-panel" className="hv-surface"
          style={{
            width: '100%', minHeight: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, border: 0,
            background: 'transparent', padding: '0 4px', font: `600 16px ${SANS}`, color: 'var(--color-text)', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span>Sobre este artigo</span>
          <Chevron open={aboutOpen} />
        </button>
        {aboutOpen && (
          <div id="about-panel" style={{ padding: '4px 4px 24px', display: 'flex', flexDirection: 'column', gap: 16, fontSize: 15, lineHeight: 1.55, color: 'var(--color-text)' }}>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55 }}>{art.deck}</p>
            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'max-content minmax(0,1fr)', gap: '8px 20px' }}>
              <dt style={dt}>Autoria</dt><dd style={{ margin: 0 }}>{art.author}</dd>
              <dt style={dt}>Publicação</dt><dd style={{ margin: 0 }}>{art.date}</dd>
              <dt style={dt}>Categoria</dt><dd style={{ margin: 0 }}>{art.tag}</dd>
              <dt style={dt}>Leitura</dt><dd style={{ margin: 0 }}>{art.time} · {art.words} palavras</dd>
            </dl>
            {art.legend && <div style={{ color: 'var(--color-text-muted)' }}><SourceLegend /></div>}
          </div>
        )}
      </section>

      <section aria-labelledby="h-share" style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Rule width={72} />
        <h2 id="h-share" style={{ margin: 0, font: `600 18px/1.3 ${SANS}` }}>Compartilhar</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', marginLeft: -8 }}>
          <a href={'https://wa.me/?text=' + encodeURIComponent(shareText + ' ' + url)} target="_blank" rel="noopener" className="hv-surface" style={shareLink}>WhatsApp</a>
          <a href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)} target="_blank" rel="noopener" className="hv-surface" style={shareLink}>Facebook</a>
          <button type="button" onClick={shareIG} className="hv-surface" style={shareBtn}>Instagram</button>
          <button type="button" onClick={() => copyLink()} className="hv-surface" style={shareBtn}>Copiar link</button>
        </div>
        <span role="status" style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--color-text-muted)', minHeight: 22 }}>{shareMsg}</span>
      </section>

      <a
        href={'/artigos/' + next.key} className="hv-border"
        style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 6, padding: 20, border: '1px solid var(--color-divider)', borderRadius: 8, textDecoration: 'none', color: 'var(--color-text)' }}
      >
        <span style={{ font: `500 14px ${SANS}`, color: 'var(--color-text-muted)' }}>Próximo · Artigo {next.letter}</span>
        <span style={{ fontSize: 19, lineHeight: 1.35, fontWeight: 600 }}>{next.title}</span>
      </a>
    </article>
  );
}

export function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" style={{ flex: 'none', transform: `rotate(${open ? '90deg' : '0deg'})`, transition: 'transform 150ms ease' }}>
      <path d="M4 2l4 4-4 4" fill="none" strokeWidth="1.6" style={{ stroke: 'var(--color-text)' }} />
    </svg>
  );
}

