import { CLOSING, DISCLAIMER } from '../content/home';
import { C, DISPLAY, Eyebrow, Logo, Rule } from '../ui';

const COLS: { title: string; links: [string, string][] }[] = [
  { title: 'Explorar', links: [['Os cinco passos', '/passos'], ['Perguntas frequentes', '/perguntas'], ['Materiais para imprimir', '/ferramentas'], ['Aprenda com meus erros', '/erros'], ['Curadoria', '/curadoria']] },
  { title: 'Sobre o projeto', links: [['Sobre o autor', '/sobre'], ['Livro de referência', '/livro'], ['Participação profissional', '/fontes'], ['Fontes', '/referencias'], ['Critérios editoriais', '/criterios']] },
  { title: 'Informações', links: [['Contato', '/contato'], ['Privacidade', '/privacidade'], ['Direitos autorais', '/direitos'], ['Responsabilidade editorial', '/criterios#responsabilidade']] },
  { title: 'Blog', links: [['Artigos', '/artigos'], ['Questionários', '/questionarios'], ['Minha trajetória', '/trajetoria'], ['Inventário', '/inventario']] },
];

/** Block O — footer. */
export function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.divider}` }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: 'var(--space-12) 22px var(--space-12)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', fontSize: 'var(--text-micro)', lineHeight: 1.5, color: C.muted }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: 560 }}>
          <Logo />
          <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 'var(--text-card)', color: C.text }}>Entenda. Aprenda. Gerencie.</p>
          <p style={{ margin: 0, fontSize: 14 }}>Um espaço de estudo, curadoria e compartilhamento sobre o TDAH na vida adulta, com referências científicas, contribuições profissionais identificadas e experiências pessoais.</p>
        </div>
        <nav aria-label="Rodapé" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap: 'var(--space-6)' }}>
          {COLS.map((c) => (
            <div key={c.title} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Eyebrow style={{ paddingBottom: 6 }}>{c.title}</Eyebrow>
              {c.links.map(([l, h]) => (
                <a key={h} href={h} className="hv-ul" style={{ minHeight: 36, display: 'flex', alignItems: 'center', color: C.text, opacity: 0.85, textDecoration: 'none', fontSize: 14 }}>{l}</a>
              ))}
            </div>
          ))}
        </nav>
        <Rule width={72} />
        <p style={{ margin: 0, fontSize: 14, color: C.text }}>{CLOSING}</p>
        <p style={{ margin: 0, paddingBottom: 'var(--space-4)', borderBottom: `1px solid ${C.divider}` }}>{DISCLAIMER}</p>
        <p style={{ margin: 0 }}>TDAH Adulto — Entenda. Aprenda. Gerencie. · Conteúdo dos artigos demonstrativos em lorem ipsum; dados das demonstrações são fictícios.</p>
      </div>
    </footer>
  );
}
