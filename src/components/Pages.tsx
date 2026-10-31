import type { ReactNode } from 'react';
import { ARTICLES } from '../content/articles';
import { FAQ, HOME_BLOCKS, RESPONSABILIDADE, type HomeBlock } from '../content/home';
import { HISTORIA } from '../content/journey';
import { STEPS } from '../content/steps';
import { ActionLink, C, DISPLAY, Eyebrow, Hash, Pending, PillButton, Rule, TitleBlock, tw } from '../ui';
import { BlockShell, FaqList, HomeBlockSection, Pieces, StepDetail, StepsOverview, SuggestForm, bodyText, eyebrowOf } from './Blocks';
import { Tools } from './Figures';
import { DESIGN } from './Header';
import { CycleDiagrams, JourneyChart } from './JourneyCharts';
import { SourceLegend } from './Sources';

const block = (letter: string) => HOME_BLOCKS.find((b) => b.letter === letter) as HomeBlock;

/** Home: official Jornada opening + charts, then blocks A–N. */
export function Home() {
  return (
    <>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: 'clamp(64px,12vw,96px) 22px 64px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-6)' }}>
        <Eyebrow>Minha jornada com o TDAH</Eyebrow>
        <h1 id="page-title" tabIndex={-1} style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(40px,7vw,80px)', lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: 820, ...tw('balance') }}>
          Dos primeiros sinais à compreensão.
        </h1>
        <p style={{ margin: 0, fontSize: 'clamp(19px,2.2vw,24px)', lineHeight: 1.4, color: C.muted, maxWidth: 640, ...tw('pretty') }}>
          Minha história com o TDAH começou muito antes do diagnóstico. Duas visualizações mostram essa trajetória por perspectivas diferentes.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
          <PillButton href="/#trajetoria">Ver a trajetória</PillButton>
          <PillButton href="/#ciclos" variant="outline">Ver os ciclos</PillButton>
        </div>
      </section>

      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 22px 96px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', fontSize: 19, lineHeight: 1.6, ...tw('pretty') }}>
        <p style={{ margin: 0 }}>A primeira visualização mostra a jornada emocional ao longo do tempo, com altos, baixos e pontos de virada. A segunda explica os ciclos vicioso e virtuoso: como determinados acontecimentos, interpretações e comportamentos podem se reforçar.</p>
        <p style={{ margin: 0, color: C.muted }}>A mensagem central não é que o diagnóstico ou a medicação resolveram tudo. É que a psicoeducação e a compreensão das dificuldades mudaram a maneira como passei a interpretá-las e enfrentá-las.</p>
      </section>

      <JourneyChart />
      <CycleDiagrams />

      <section style={{ background: C.surface, padding: '96px 22px', textAlign: 'center' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', alignItems: 'center' }}>
          <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(28px,4vw,44px)', lineHeight: 1.15, letterSpacing: '-0.015em', ...tw('balance') }}>
            Meu objetivo não é mostrar que superei o TDAH. É mostrar como comecei a aprender a gerenciá-lo.
          </p>
          <PillButton href="/#passos">Explore os cinco passos</PillButton>
        </div>
      </section>

      {HOME_BLOCKS.map((b, i) => <HomeBlockSection key={b.id} b={b} tone={i % 2 === 0 ? 'bg' : 'surface'} />)}
    </>
  );
}

/** Full page for a home block (C, E, F, G, H, J, K). */
export function BlockPage({ letter, children, before }: { letter: string; children?: ReactNode; before?: ReactNode }) {
  const b = block(letter);
  return (
    <>
      {before}
      <BlockShell eyebrow={eyebrowOf(b)} title={b.title} lead={b.lead} headingLevel={1} center={false}>
        <Pieces items={b.body} />
        {children}
      </BlockShell>
      <BackHome />
    </>
  );
}

function BackHome() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 22px 64px', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' }}>
      <ActionLink href="/">Voltar ao início</ActionLink>
      <ActionLink href="/passos">Os cinco passos</ActionLink>
    </div>
  );
}

export function Trajetoria() {
  return (
    <>
      <BlockShell eyebrow="F · Credibilidade · Minha trajetória" title="Minha jornada com o TDAH: dos primeiros sinais à compreensão" headingLevel={1} center={false}>
        {HISTORIA.map((p) => <p key={p} style={bodyText}>{p}</p>)}
      </BlockShell>
      <JourneyChart />
      <CycleDiagrams />
      <BlockShell title="Minha trajetória — 2022 a 2026" tone="surface">
        <Pending>Gráfico cronológico editorial com acontecimentos documentados. Somente datas confirmadas.</Pending>
        <p style={{ ...bodyText, color: C.muted, textAlign: 'center' }}>O gráfico não será uma demonstração clínica de melhora ou piora. Será um registro da trajetória pessoal.</p>
      </BlockShell>
      <BackHome />
    </>
  );
}

export function Passos() {
  return (
    <>
      <StepsOverview eyebrow="D · Orientação" title="Por onde começar? Conheça os cinco passos." tone="bg" headingLevel={1} />
      <BlockShell title="Os 30 capítulos de referência" tone="surface" wide>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 'var(--space-6)' }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Eyebrow>{s.label}</Eyebrow>
              <ol start={s.chapters[0][0]} style={{ margin: 0, paddingLeft: 28, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15 }}>
                {s.chapters.map(([n, t, pg]) => <li key={n}>{t} <span style={{ color: C.muted }}>— p. {pg}</span></li>)}
              </ol>
              <ActionLink href={'/passos/' + s.n} size={15}>{s.cta}</ActionLink>
            </div>
          ))}
        </div>
      </BlockShell>
    </>
  );
}

export function Passo({ n }: { n: number }) {
  const s = STEPS[n - 1];
  return s ? <StepDetail step={s} /> : <NotFound />;
}

export function Ferramentas() {
  return (
    <BlockPage letter="I">
      <div style={{ marginTop: 'var(--space-8)', maxWidth: 680 }}><Tools /></div>
      <div style={{ background: C.surface, borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
        <Eyebrow>Questionário de reflexão</Eyebrow>
        <h2 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'var(--text-card)' }}>Organize suas observações para a consulta</h2>
        <p style={{ ...bodyText, color: C.muted }}>30 afirmações em duas áreas, com comentário em cada uma e um resumo pronto para print. Não fornece diagnóstico.</p>
        <div><PillButton href="/questionarios/consulta">Começar questionário</PillButton></div>
      </div>
      <p style={{ ...bodyText, marginTop: 'var(--space-4)' }}>As ferramentas de leitura também aparecem em contexto no <a href="/artigos/c#ferramentas" style={{ color: C.link }}>Artigo C</a>.</p>
    </BlockPage>
  );
}

export function Criterios() {
  return (
    <BlockPage letter="L">
      <div style={{ marginTop: 'var(--space-4)' }}><SourceLegend detailed /></div>
      <section id="responsabilidade" style={{ scrollMarginTop: 'calc(var(--tdh-nav-h) + 16px)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
        <Rule width={72} />
        <h2 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'var(--text-subtitle)' }}>Responsabilidade editorial</h2>
        {RESPONSABILIDADE.map((p) => <p key={p} style={bodyText}>{p}</p>)}
      </section>
    </BlockPage>
  );
}

export function Perguntas() {
  return (
    <>
      <BlockShell eyebrow="M · Conversão" title="Perguntas frequentes" headingLevel={1}>
        <FaqList items={FAQ} />
        <p style={{ ...bodyText, textAlign: 'center', color: C.muted }}>Não encontrou sua dúvida? <a href="/participe" style={{ color: C.link }}>Envie sua pergunta</a>.</p>
      </BlockShell>
      <BackHome />
    </>
  );
}

export function Participe() {
  const b = block('N');
  return (
    <>
      <BlockShell eyebrow={eyebrowOf(b)} title={b.title} lead={b.lead} headingLevel={1} center={false}>
        <Pieces items={b.body} />
        <SuggestForm />
      </BlockShell>
      <BackHome />
    </>
  );
}

/** Showroom index: the three demo articles (cards from the v3 landing). */
export function Artigos({ wide }: { wide: boolean }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 96px' }}>
      <section style={{ padding: 'clamp(64px,10vw,120px) 0 clamp(40px,6vw,72px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, textAlign: 'center' }}>
        <TitleBlock size={wide ? '30px' : '24px'} maxWidth={560}>Artigos</TitleBlock>
        <p style={{ margin: 0, maxWidth: '30ch', fontSize: 'clamp(19px,2.4vw,24px)', lineHeight: 1.45, color: C.muted, ...tw('balance') }}>Leitura, dados e ferramentas para a vida adulta com TDAH.</p>
        <span style={{ fontSize: 14, color: C.muted }}>Artigos demonstrativos com conteúdo placeholder e dados fictícios.</span>
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 12 }}>
        {ARTICLES.map((a) => {
          const surface = a.title.split(': ')[1];
          return (
            <a key={a.key} href={'/artigos/' + a.key} className="hv-raised"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', minHeight: 'clamp(420px,52vw,560px)', padding: 'clamp(48px,6vw,64px) 28px', boxSizing: 'border-box', background: C.surface, borderRadius: 'var(--radius-xl)', textDecoration: 'none', color: C.text }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.muted }}>{a.tag} · {a.time}</span>
              <span style={{ maxWidth: '16ch', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(24px,2.6vw,30px)', lineHeight: 1.18, letterSpacing: '-0.01em', ...tw('balance') }}>{surface[0].toUpperCase() + surface.slice(1)}</span>
              <span style={{ maxWidth: '34ch', fontSize: 17, lineHeight: 1.5, color: C.muted, ...tw('pretty') }}>{a.deck}</span>
              <span style={{ marginTop: 'auto', minHeight: 44, display: 'inline-flex', alignItems: 'center', color: C.link, fontSize: 17 }}>Ler artigo {a.letter} <span aria-hidden="true" style={{ marginLeft: 4 }}>›</span></span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/** Questionnaire area (feature block from the v3 landing). */
export function Questionarios() {
  return (
    <section style={{ background: C.surface, padding: 'clamp(72px,11vw,128px) 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>
      <span style={{ fontSize: 15, fontWeight: 500, color: C.muted }}><Hash mono={false} color="inherit" /> Questionários</span>
      <h1 id="page-title" tabIndex={-1} style={{ margin: 0, maxWidth: '18ch', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(30px,4.6vw,48px)', lineHeight: 1.12, letterSpacing: '-0.015em', ...tw('balance') }}>Organize suas observações para a consulta</h1>
      <p style={{ margin: 0, maxWidth: '44ch', fontSize: 'clamp(17px,1.9vw,21px)', lineHeight: 1.5, color: C.muted, ...tw('pretty') }}>Responda às afirmações e especifique situações da sua rotina. Ao concluir, visualize suas respostas e tire um print para conversar com seu profissional de saúde.</p>
      <div aria-hidden="true" style={{ display: 'flex', alignItems: 'baseline', gap: 36, padding: '28px 0 12px' }}>
        {[['S', 'im'], ['N', 'ão']].map(([big, rest]) => (
          <span key={big}><span style={{ fontSize: 'clamp(64px,9vw,96px)', fontWeight: 600, lineHeight: 1 }}>{big}</span><span style={{ fontSize: 'clamp(24px,3vw,32px)', color: C.muted }}>{rest}</span></span>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px 20px' }}>
        <PillButton href="/questionarios/consulta">Começar questionário</PillButton>
        <ActionLink href={DESIGN('TDH Revisao HIG.dc.html')}>Como foi pensado</ActionLink>
      </div>
      <span style={{ maxWidth: '52ch', fontSize: 14, lineHeight: 1.5, color: C.muted }}>Adaptado de Barkley e Benton. Não fornece diagnóstico nem classificação de gravidade.</span>
    </section>
  );
}

export function Sobre() {
  return <BlockPage letter="F"><div style={{ marginTop: 'var(--space-4)' }}><ActionLink href="/trajetoria">Conheça minha trajetória</ActionLink></div></BlockPage>;
}

const PLACEHOLDERS: Record<string, [string, string]> = {
  privacidade: ['Privacidade', 'Esta página vai explicar quais dados são coletados, para quê e por quanto tempo. Hoje o site guarda apenas preferências de leitura, tema e respostas do questionário no próprio dispositivo (armazenamento local do navegador); nada é enviado a servidores.'],
  direitos: ['Direitos autorais', 'Os textos autorais são do TDAH Adulto. O questionário é adaptado, com autorização, de Vencendo o TDAH adulto, de Russell A. Barkley e Christine M. Benton. Imagens e materiais de terceiros serão identificados com sua origem e condições de uso.'],
  contato: ['Contato', 'O canal de contato está em preparação. Enquanto isso, use a página “Envie sua pergunta” para registrar sua dúvida.'],
};

export function Placeholder({ slug }: { slug: string }) {
  const [title, text] = PLACEHOLDERS[slug];
  return (
    <>
      <BlockShell eyebrow="Informações" title={title} headingLevel={1} center={false}>
        <p style={bodyText}>{text}</p>
        <Pending>Conteúdo definitivo desta página.</Pending>
      </BlockShell>
      <BackHome />
    </>
  );
}

export function NotFound() {
  return (
    <BlockShell eyebrow="404" title="Página não encontrada" lead="O endereço pode ter mudado. Comece pelo início ou pelos cinco passos." headingLevel={1}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <PillButton href="/">Ir para o início</PillButton>
        <PillButton href="/passos" variant="outline">Os cinco passos</PillButton>
      </div>
    </BlockShell>
  );
}
