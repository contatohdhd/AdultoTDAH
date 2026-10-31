import type { RefObject } from 'react';
import type { Article } from '../content/articles';
import type { Prefs } from '../prefs';
import { C, Logo, MONO, SANS, TARGET, WordButton } from '../ui';
import { Chevron } from './Article';
import { PrefGroups } from './PrefControls';

export type Audio = 'idle' | 'playing' | 'paused' | 'unsupported';
export type Theme = 'light' | 'dark';

export const DESIGN = (f: string) => '/design/' + encodeURIComponent(f);

const NAV: [string, string][] = [['Cinco passos', '/passos'], ['Trajetória', '/trajetoria'], ['Artigos', '/artigos'], ['Questionários', '/questionarios'], ['Ferramentas', '/ferramentas']];

export const MENU: { group: string; items: { label: string; href: string; desc: string }[] }[] = [
  {
    group: 'Explorar', items: [
      { label: 'Início', href: '/', desc: 'Jornada, ciclos e os blocos da home' },
      { label: 'Os cinco passos', href: '/passos', desc: 'Da avaliação às áreas da vida · 30 capítulos' },
      { label: 'Minha trajetória', href: '/trajetoria', desc: 'Linha emocional e ciclos vicioso e virtuoso' },
      { label: 'Artigos', href: '/artigos', desc: 'Leitura, dados e ferramentas · A, B e C' },
      { label: 'Questionários', href: '/questionarios', desc: 'Organize suas observações para a consulta' },
      { label: 'Ferramentas', href: '/ferramentas', desc: 'Materiais para imprimir e ferramentas de leitura' },
      { label: 'Perguntas frequentes', href: '/perguntas', desc: 'Diagnóstico, custos, tratamento' },
      { label: 'Aprenda com meus erros', href: '/erros', desc: 'Relatos, consequências e aprendizados' },
      { label: 'Curadoria', href: '/curadoria', desc: 'Uma seleção para aprofundar' },
      { label: 'Envie sua pergunta', href: '/participe', desc: 'Qual dúvida acompanha você agora?' },
    ],
  },
  {
    group: 'Sobre o projeto', items: [
      { label: 'Sobre o autor', href: '/sobre', desc: 'Minhas dúvidas deram origem a este espaço' },
      { label: 'Livro de referência', href: '/livro', desc: 'Vencendo o TDAH Adulto · Barkley e Benton' },
      { label: 'Participação profissional', href: '/fontes', desc: 'Fontes e colaboradores' },
      { label: 'Dados e referências', href: '/referencias', desc: 'O conhecimento científico por trás das dúvidas' },
      { label: 'Critérios editoriais', href: '/criterios', desc: 'Amarelo, laranja e azul: de onde vem a informação' },
    ],
  },
  {
    group: 'Sistema de design', items: [
      { label: 'Inventário', href: '/inventario', desc: 'Componentes, rotas e contagem de palavras' },
      { label: 'Acessibilidade', href: DESIGN('TDH Revisao HIG.dc.html'), desc: 'Revisão com Apple HIG e WCAG (protótipo)' },
      { label: 'Sistema de design v1', href: DESIGN('TDH Design System v1.dc.html'), desc: 'Documento de referência (protótipo)' },
      { label: 'Mockups', href: DESIGN('TDH Mockups v1.dc.html'), desc: 'Telas mobile e desktop (protótipo)' },
      { label: 'Componentes', href: DESIGN('TDH Componentes.dc.html'), desc: 'Biblioteca reutilizável (protótipo)' },
    ],
  },
];

interface Props {
  path: string; wide: boolean; art?: Article; activeSec: string | null; theme: Theme; toggleTheme: () => void;
  menuOpen: boolean; tocOpen: boolean; prefsOpen: boolean; tipOpen: boolean;
  audio: Audio; progress: number; prefs: Prefs;
  menuBtnRef: RefObject<HTMLButtonElement>; aaRef: RefObject<HTMLButtonElement>;
  toggleMenu: () => void; toggleToc: () => void; onAa: () => void; openPrefsFromTip: () => void; closeTip: () => void;
  closePrefs: () => void; play: () => void; pause: () => void; stop: () => void; goToSection: (id: string) => void;
  setPrefs: (p: Partial<Prefs>) => void; resetPrefs: () => void;
}

const panel = { maxWidth: 680, margin: '0 auto', borderTop: `1px solid ${C.divider}` };
const ctrl = { minHeight: TARGET, padding: '0 6px', border: 0, borderRadius: 6, font: `500 var(--text-caption) ${SANS}`, color: C.text, cursor: 'pointer' };

export function Header(p: Props) {
  const { path, wide, art } = p;
  const toc = art ? art.toc : [];
  const audioActive = p.audio === 'playing' || p.audio === 'paused';
  const audioStatus = p.audio === 'playing' ? 'Reproduzindo · ' + p.progress + '%'
    : p.audio === 'paused' ? 'Pausado · ' + p.progress + '%'
    : p.audio === 'unsupported' ? 'Áudio indisponível neste navegador.' : '';
  const current = (href: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));
  const themeLabel = p.theme === 'dark' ? 'Tema claro' : 'Tema escuro';

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 20, background: 'color-mix(in srgb, var(--color-bg) 78%, transparent)',
        backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', borderBottom: `1px solid ${C.divider}`,
      }}
    >
      <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto', minHeight: 'var(--tdh-nav-h)', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, boxSizing: 'border-box' }}>
        <Logo size={wide || !art ? 21 : 18} />
        <div className="nav-links" style={{ gap: 2 }}>
          {!art && (
            <nav aria-label="Principal" className="nav-wide" style={{ display: 'flex', gap: 2, marginRight: 6 }}>
              {NAV.map(([label, href]) => (
                <a
                  key={href} href={href} aria-current={current(href) ? 'page' : undefined} className="hv-surface"
                  style={{ minHeight: TARGET, display: 'flex', alignItems: 'center', padding: '0 10px', borderRadius: 6, fontSize: 12, color: C.text, opacity: current(href) ? 1 : 0.8, textDecoration: current(href) ? 'underline' : 'none', textUnderlineOffset: 6 }}
                >
                  {label}
                </a>
              ))}
            </nav>
          )}
          {art && (
            <>
              <button type="button" onClick={p.toggleToc} aria-expanded={p.tocOpen} aria-controls="toc-panel" className="hv-surface"
                style={{ ...ctrl, display: 'flex', alignItems: 'center', gap: 6, background: p.tocOpen ? C.surface : 'transparent' }}>
                <span>{wide ? 'Nesta página · ' + toc.length + ' seções' : 'Índice'}</span>
                <Chevron open={p.tocOpen} />
              </button>
              <button type="button" onClick={p.audio === 'playing' ? p.pause : p.play} className="hv-surface act-press"
                style={{ ...ctrl, background: audioActive ? C.surface : 'transparent', textDecoration: 'underline', textUnderlineOffset: 6 }}>
                {p.audio === 'playing' ? 'Pausar' : p.audio === 'paused' ? 'Continuar' : 'Ouvir'}
              </button>
              <button type="button" ref={p.aaRef} onClick={p.onAa} aria-expanded={p.prefsOpen || p.tipOpen} aria-label="Preferências de leitura" className="hv-surface"
                style={{ width: TARGET, height: TARGET, border: 0, borderRadius: 6, background: p.prefsOpen || p.tipOpen ? C.surface : 'transparent', font: `500 17px ${SANS}`, color: C.text, cursor: 'pointer' }}>
                Aa
              </button>
            </>
          )}
          <button type="button" onClick={p.toggleTheme} aria-label="Alternar tema" className="nav-wide hv-outline"
            style={{ minHeight: 32, margin: '0 4px', fontSize: 12, padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: `1px solid ${C.divider}`, background: 'transparent', color: C.text, cursor: 'pointer', fontFamily: SANS }}>
            {themeLabel}
          </button>
          <button type="button" ref={p.menuBtnRef} onClick={p.toggleMenu} aria-label={p.menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={p.menuOpen} aria-controls="menu-tdh" className="hv-surface"
            style={{ width: TARGET, height: TARGET, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 6, background: p.menuOpen ? C.surface : 'transparent', color: C.text, font: `500 22px/1 ${MONO}`, cursor: 'pointer' }}>
            #
          </button>
        </div>
        {p.tipOpen && (
          <div role="dialog" aria-labelledby="tip-title" aria-describedby="tip-desc"
            style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 16, width: 'min(320px,calc(100vw - 32px))', boxSizing: 'border-box', background: C.raised, border: `1px solid ${C.divider}`, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: 18, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 30 }}>
            <span id="tip-title" style={{ font: `600 16px/1.3 ${SANS}` }}>Personalize sua leitura</span>
            <span id="tip-desc" style={{ fontSize: 15, lineHeight: 1.55, color: C.muted }}>Ajuste o tamanho do texto, o espaçamento e a apresentação para uma leitura mais confortável.</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, paddingTop: 4 }}>
              <button id="tip-cta" type="button" onClick={p.openPrefsFromTip} className="hv-accent act-accent"
                style={{ minHeight: TARGET, padding: '0 18px', border: 0, borderRadius: 'var(--radius-pill)', background: C.accent, color: C.onAccent, font: `600 15px ${SANS}`, cursor: 'pointer' }}>
                Ajustar leitura
              </button>
              <WordButton onClick={p.closeTip} style={{ fontSize: 15 }}>Fechar</WordButton>
            </div>
          </div>
        )}
      </div>

      {p.audio !== 'idle' && (
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 16px 6px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
          <span role="status" style={{ fontSize: 14, color: C.muted }}>{audioStatus}</span>
          {audioActive && <WordButton onClick={p.stop}>Parar</WordButton>}
        </div>
      )}

      {p.tocOpen && art && (
        <nav id="toc-panel" aria-label="Nesta página" style={{ ...panel, padding: '8px 16px 20px', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '60vh', overflow: 'auto' }}>
          <span style={{ font: `500 14px ${SANS}`, color: C.muted, padding: '4px 12px 8px' }}>Nesta página · {toc.length} seções</span>
          {toc.map((t) => {
            const on = p.activeSec === t.id;
            return (
              <button key={t.id} type="button" onClick={() => p.goToSection(t.id)} aria-current={on ? 'location' : undefined} className="hv-surface"
                style={{ minHeight: TARGET, textAlign: 'left', padding: '6px 12px', border: 0, borderLeft: `2px solid ${on ? C.text : C.divider}`, background: 'transparent', fontSize: 16, lineHeight: 1.35, color: C.text, fontWeight: on ? 600 : 400, cursor: 'pointer', fontFamily: SANS }}>
                {t.text}
              </button>
            );
          })}
        </nav>
      )}

      {p.prefsOpen && (
        <div id="prefs-top" role="region" aria-label="Preferências de leitura" style={{ ...panel, display: 'flex', flexDirection: 'column', gap: 14, padding: '12px 16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ font: `600 16px ${SANS}` }}>Preferências de leitura</span>
            <WordButton onClick={p.closePrefs} style={{ fontSize: 15 }}>Fechar</WordButton>
          </div>
          <span style={{ fontSize: 15, lineHeight: 1.5, color: C.muted }}>Ajuste o tamanho do texto, o espaçamento e a apresentação para uma leitura mais confortável.</span>
          <PrefGroups prefs={p.prefs} setPrefs={p.setPrefs} />
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 12px' }}>
            <WordButton onClick={p.resetPrefs} style={{ fontSize: 15, color: C.muted }}>Restaurar padrão</WordButton>
            <span style={{ fontSize: 14, color: C.muted }}>Salvo neste dispositivo. Vale para os três artigos.</span>
          </div>
        </div>
      )}

      {p.menuOpen && (
        <nav id="menu-tdh" aria-label="Menu" style={{ maxWidth: 980, margin: '0 auto', borderTop: `1px solid ${C.divider}`, padding: '12px 16px 28px', maxHeight: 'calc(100dvh - var(--tdh-nav-h))', overflow: 'auto', boxSizing: 'border-box' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: '8px 24px' }}>
            {MENU.map((g) => (
              <div key={g.group} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted, padding: '8px 12px' }}>{g.group}</span>
                {g.items.map((m) => {
                  const cur = current(m.href);
                  return (
                    <a key={m.href} href={m.href} aria-current={cur ? 'page' : undefined} className="hv-surface"
                      style={{ minHeight: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, padding: '8px 12px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: C.text, background: cur ? C.surface : 'transparent', boxSizing: 'border-box' }}>
                      <span style={{ font: `500 17px/1.3 ${SANS}` }}><span aria-hidden="true" style={{ fontFamily: MONO, fontWeight: 500, color: C.muted }}>#</span> {m.label}</span>
                      <span style={{ fontSize: 14, lineHeight: 1.4, color: C.muted }}>{m.desc}</span>
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '16px 12px 0' }}>
            <span style={{ fontSize: 14, color: C.muted }}>Esc ou # fecha o menu.</span>
            <button type="button" onClick={p.toggleTheme} className="hv-outline"
              style={{ minHeight: TARGET, fontSize: 15, padding: '0 16px', borderRadius: 'var(--radius-pill)', border: `1px solid ${C.divider}`, background: 'transparent', color: C.text, cursor: 'pointer', fontFamily: SANS }}>
              {themeLabel}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
