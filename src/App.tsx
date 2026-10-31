import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Article } from './components/Article';
import { Footer } from './components/Footer';
import { Header, type Audio, type Theme } from './components/Header';
import { Inventory } from './components/Inventory';
import {
  Artigos, BlockPage, Criterios, Ferramentas, Home, NotFound, Participe, Passo, Passos, Perguntas, Placeholder, Questionarios, Sobre, Trajetoria,
} from './components/Pages';
import { Questionnaire } from './components/Questionnaire';
import { ARTICLES } from './content/articles';
import { useReducedMotion, useWide } from './hooks';
import { DEFAULT_PREFS, loadPrefs, loadTipSeen, savePrefs, saveTipSeen, type Prefs } from './prefs';
import { isInternal, legacyRedirect, navigate, useLocation } from './router';
import { C } from './ui';

const headerOffset = () => (document.querySelector('header')?.getBoundingClientRect().height ?? 0) + 16;

function scrollToAnchor(id: string, tries: number) {
  const el = document.getElementById(id);
  if (!el) { if (tries > 0) requestAnimationFrame(() => scrollToAnchor(id, tries - 1)); return; }
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset());
  window.scrollTo(0, y);
  requestAnimationFrame(() => { if (Math.abs(window.scrollY - y) > 4) window.scrollTo(0, y); });
}

const TITLES: Record<string, string> = {
  '/passos': 'Os cinco passos', '/trajetoria': 'Minha trajetória', '/duvidas': 'Dúvidas', '/referencias': 'Dados e referências', '/livro': 'Livro de referência',
  '/fontes': 'Fontes e colaboradores', '/ferramentas': 'Ferramentas', '/erros': 'Aprenda com meus erros', '/curadoria': 'Curadoria', '/criterios': 'Critérios editoriais',
  '/perguntas': 'Perguntas frequentes', '/participe': 'Envie sua pergunta', '/artigos': 'Artigos', '/questionarios': 'Questionários', '/questionarios/consulta': 'Questionário',
  '/inventario': 'Inventário', '/sobre': 'Sobre o autor', '/privacidade': 'Privacidade', '/direitos': 'Direitos autorais', '/contato': 'Contato',
};

function loadTheme(): Theme {
  const t = document.documentElement.getAttribute('data-theme');
  return t === 'dark' ? 'dark' : 'light';
}

export function App() {
  // Old showroom links (#/a, #/c/ferramentas…) → new paths.
  const [redirected] = useState(() => { const to = legacyRedirect(); if (to) history.replaceState(null, '', to); return !!to; });
  void redirected;
  const loc = useLocation();
  const path = loc.path;
  const wide = useWide();
  const reduce = useReducedMotion();

  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [tipSeen, setTipSeen] = useState(loadTipSeen);
  const [prefs, setPrefsState] = useState<Prefs>(loadPrefs);
  const [audio, setAudio] = useState<Audio>('idle');
  const [progress, setProgress] = useState(0);
  const [activeSec, setActiveSec] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [tmPulse, setTmPulse] = useState(false);
  const [flowRot, setFlowRot] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrollTick, setScrollTick] = useState(0);
  const firstRoute = useRef(true);
  const prevPath = useRef(path);

  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const aaRef = useRef<HTMLButtonElement>(null);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  const artMatch = /^\/artigos\/([abc])$/.exec(path);
  const art = artMatch ? ARTICLES.find((a) => a.key === artMatch[1]) : undefined;

  const toggleTheme = () => {
    const t: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('tdah-theme', t); } catch { /* storage unavailable */ }
    setTheme(t);
  };

  const setPrefs = (o: Partial<Prefs>) => setPrefsState((p) => { const n = { ...p, ...o }; savePrefs(n); return n; });
  const resetPrefs = () => { savePrefs(DEFAULT_PREFS); setPrefsState({ ...DEFAULT_PREFS }); };

  // ---- Audio (Web Speech, pt-BR) ----
  const stop = useCallback(() => {
    uttRef.current = null;
    window.speechSynthesis?.cancel();
    setAudio('idle'); setProgress(0);
  }, []);
  const play = () => {
    const ss = window.speechSynthesis;
    if (!ss || !art) { setAudio('unsupported'); return; }
    if (audio === 'paused') { ss.resume(); setAudio('playing'); return; }
    ss.cancel();
    const u = new SpeechSynthesisUtterance(art.speech);
    u.lang = 'pt-BR'; u.rate = 1;
    const v = ss.getVoices().find((x) => x.lang && x.lang.toLowerCase().startsWith('pt'));
    if (v) u.voice = v;
    const len = art.speech.length;
    u.onboundary = (e) => setProgress(Math.min(99, Math.round((e.charIndex / len) * 100)));
    const end = () => { if (uttRef.current === u) { setAudio('idle'); setProgress(0); } };
    u.onend = end; u.onerror = end;
    uttRef.current = u;
    ss.speak(u);
    setAudio('playing'); setProgress(0);
  };
  const pause = () => { window.speechSynthesis?.pause(); setAudio('paused'); };

  // ---- Global link interception (SPA navigation) ----
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || !isInternal(a)) return;
      e.preventDefault();
      const to = a.pathname + a.search + a.hash;
      if (to === location.pathname + location.search + location.hash) { setMenuOpen(false); setScrollTick((t) => t + 1); return; }
      navigate(to);
    };
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('click', onClick); window.speechSynthesis?.cancel(); };
  }, []);

  // ?state=menu|tip|prefs|toc opens a panel on load (design review helper).
  useEffect(() => {
    const st = new URLSearchParams(location.search).get('state');
    if (!st) return;
    const t = setTimeout(() => { setMenuOpen(st === 'menu'); setTipOpen(st === 'tip'); setPrefsOpen(st === 'prefs'); setTocOpen(st === 'toc'); }, 120);
    return () => clearTimeout(t);
  }, []);

  // ---- Route change: close panels, stop audio, scroll/focus, title ----
  useEffect(() => {
    setMenuOpen(false); setTocOpen(false); setPrefsOpen(false); setTipOpen(false);
    if (prevPath.current !== path) { stop(); setAboutOpen(false); }
    prevPath.current = path;
    document.title = (art ? art.title : TITLES[path]) ? `${art ? art.title : TITLES[path]} · TDAH Adulto` : 'TDAH Adulto — Entenda. Aprenda. Gerencie.';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.key]);

  useEffect(() => {
    const first = firstRoute.current;
    firstRoute.current = false;
    const t = setTimeout(() => {
      if (loc.hash) scrollToAnchor(loc.hash, 30);
      else if (!first) { window.scrollTo(0, 0); document.getElementById('page-title')?.focus({ preventScroll: true }); }
    }, 60);
    return () => clearTimeout(t);
  }, [loc.key, loc.hash, scrollTick]);

  // Escape closes the topmost layer and returns focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (tipOpen) { saveTipSeen(); setTipOpen(false); setTipSeen(true); aaRef.current?.focus(); }
      else if (menuOpen) { setMenuOpen(false); menuBtnRef.current?.focus(); }
      else if (tocOpen || prefsOpen) { setTocOpen(false); setPrefsOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tipOpen, menuOpen, tocOpen, prefsOpen]);

  useEffect(() => { if (tipOpen) { const t = setTimeout(() => document.getElementById('tip-cta')?.focus(), 30); return () => clearTimeout(t); } }, [tipOpen]);

  // Scroll spy for the “Nesta página” index.
  useEffect(() => {
    if (!art) return;
    const onScroll = () => {
      let cur = art.toc[0]?.id ?? null;
      art.toc.forEach((t) => { const el = document.getElementById(t.id); if (el && el.getBoundingClientRect().top < 140) cur = t.id; });
      setActiveSec(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [art]);

  // One-shot effects in articles: highlight reveal, treemap colour pulse, R1 rotation.
  useEffect(() => {
    if (!art || reduce || typeof IntersectionObserver === 'undefined') return;
    let fx: IntersectionObserver | undefined, io: IntersectionObserver | undefined;
    const timers: number[] = [];
    const t = window.setTimeout(() => {
      fx = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        fx!.unobserve(e.target);
        const set = e.target.id === 'tm-chart' ? setTmPulse : setFlowRot;
        set(true);
        timers.push(window.setTimeout(() => set(false), 650));
      }), { threshold: 0.45 });
      ['tm-chart', 'flow-r1'].forEach((id) => { const el = document.getElementById(id); if (el) fx!.observe(el); });
      io = new IntersectionObserver((es) => {
        const add: Record<string, boolean> = {};
        es.forEach((e) => { if (e.isIntersecting) { add[(e.target as HTMLElement).dataset.hl!] = true; io!.unobserve(e.target); } });
        if (Object.keys(add).length) setRevealed((r) => ({ ...r, ...add }));
      }, { rootMargin: '0px 0px -20% 0px', threshold: 0.6 });
      document.querySelectorAll<HTMLElement>('[data-hl]').forEach((el) => io!.observe(el));
    }, 60);
    return () => { clearTimeout(t); timers.forEach(clearTimeout); fx?.disconnect(); io?.disconnect(); };
  }, [art, reduce]);

  const goToSection = (id: string) => {
    setTocOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerOffset(), behavior: reduce ? 'auto' : 'smooth' });
    el.focus({ preventScroll: true });
  };

  let page: ReactNode;
  const stepMatch = /^\/passos\/(\d)$/.exec(path);
  if (art) {
    page = (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 96px' }}>
        <Article key={art.key} art={art} aboutOpen={aboutOpen} setAboutOpen={setAboutOpen} prefs={prefs} setPrefs={setPrefs} resetPrefs={resetPrefs}
          wide={wide} reduce={reduce} revealed={revealed} tmPulse={tmPulse} flowRot={flowRot} />
      </div>
    );
  } else if (stepMatch) page = <Passo n={+stepMatch[1]} />;
  else {
    switch (path) {
      case '/': page = <Home />; break;
      case '/passos': page = <Passos />; break;
      case '/trajetoria': page = <Trajetoria />; break;
      case '/duvidas': page = <BlockPage letter="C" />; break;
      case '/referencias': page = <BlockPage letter="E" />; break;
      case '/livro': page = <BlockPage letter="G" />; break;
      case '/fontes': page = <BlockPage letter="H" />; break;
      case '/erros': page = <BlockPage letter="J" />; break;
      case '/curadoria': page = <BlockPage letter="K" />; break;
      case '/ferramentas': page = <Ferramentas />; break;
      case '/criterios': page = <Criterios />; break;
      case '/perguntas': page = <Perguntas />; break;
      case '/participe': page = <Participe />; break;
      case '/artigos': page = <Artigos wide={wide} />; break;
      case '/questionarios': page = <Questionarios />; break;
      case '/questionarios/consulta': page = <Questionnaire />; break;
      case '/inventario': page = <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 96px' }}><Inventory wide={wide} /></div>; break;
      case '/sobre': page = <Sobre />; break;
      case '/privacidade': case '/direitos': case '/contato': page = <Placeholder slug={path.slice(1)} />; break;
      default: page = <NotFound />;
    }
  }

  return (
    <>
      <a href="#conteudo" className="skip"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); const m = document.getElementById('conteudo'); m?.focus(); m?.scrollIntoView(); }}
        style={{ position: 'absolute', left: -9999, top: 8, background: C.text, color: C.bg, padding: '12px 16px', zIndex: 50 }}>
        Pular para o conteúdo
      </a>
      <Header
        path={path} wide={wide} art={art} activeSec={activeSec} theme={theme} toggleTheme={toggleTheme}
        menuOpen={menuOpen} tocOpen={tocOpen} prefsOpen={prefsOpen} tipOpen={tipOpen}
        audio={audio} progress={progress} prefs={prefs} menuBtnRef={menuBtnRef} aaRef={aaRef}
        toggleMenu={() => { setMenuOpen(!menuOpen); setTocOpen(false); setPrefsOpen(false); setTipOpen(false); }}
        toggleToc={() => { setTocOpen(!tocOpen); setPrefsOpen(false); setTipOpen(false); setMenuOpen(false); }}
        onAa={() => {
          setTocOpen(false); setMenuOpen(false);
          if (!tipSeen) { setTipOpen(!tipOpen); setPrefsOpen(false); } else { setPrefsOpen(!prefsOpen); setTipOpen(false); }
        }}
        openPrefsFromTip={() => { saveTipSeen(); setTipOpen(false); setTipSeen(true); setPrefsOpen(true); }}
        closeTip={() => { saveTipSeen(); setTipOpen(false); setTipSeen(true); aaRef.current?.focus(); }}
        closePrefs={() => setPrefsOpen(false)}
        play={play} pause={pause} stop={stop} goToSection={goToSection} setPrefs={setPrefs} resetPrefs={resetPrefs}
      />
      <main id="conteudo" tabIndex={-1} style={{ outline: 'none' }}>{page}</main>
      <Footer />
    </>
  );
}
