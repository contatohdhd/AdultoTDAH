import { ARTICLES } from '../content/articles';
import { Hash, SANS, TitleBlock } from '../ui';

const INV: [string, string, string, string, string][] = [
  ['Tokens oficiais', 'Todas', '/', 'src/tokens.css', 'Camada oficial do design system (cores claro/escuro, tipografia, espaço, raios) + extensões --tdh-*; nenhum hex nos componentes.'],
  ['Tema claro/escuro', 'Todas', '/', 'Navegação e menu #', 'data-theme no <html>; segue o sistema por padrão; escolha salva no dispositivo.'],
  ['Logo TDAH Adulto', 'Todas', '/', 'Navegação e rodapé', 'Marca oficial na fonte de display; link para o início.'],
  ['Navegação com desfoque', 'Todas', '/', 'Topo fixo (52 px)', 'Fundo translúcido; links textuais ≥860 px; menu # sempre disponível.'],
  ['Abertura Jornada', 'Início', '/', 'Topo', 'Eyebrow mono, H1 de display, dois botões em pílula (DS Button lg).'],
  ['Linha emocional A–H', 'Início, Trajetória', '/#trajetoria', '01 · Linha emocional', 'Traço desenhado na rolagem; marcos por toque, foco ou cursor; abas A–H; cartão com espaço de imagem; lista em texto.'],
  ['Ciclos vicioso e virtuoso', 'Início, Trajetória', '/#ciclos', '02 · Dois circuitos', 'Arcos desenhados ao entrar; etapas focáveis; rótulo central aria-live; sequência em texto oculta.'],
  ['Blocos A–N', 'Início', '/#entenda', 'Home em blocos', 'Eyebrow letra · movimento, H2, linha fina, resumo e CTA para a página completa.'],
  ['Capas e imagens dos posts', 'Passos 1–5', '/passos/1', 'Topo do post · entre capítulos', 'GIF de capa e imagens ligadas ao capítulo; animação só ao tocar em “Animar” ou passar o cursor; parada com movimento reduzido.'],
  ['Cinco passos + 30 capítulos', 'Início, Passos', '/passos', 'D · Orientação', 'Cartões por passo; página por passo com capítulos e páginas; publicação a definir.'],
  ['Perguntas frequentes', 'Início, Perguntas', '/perguntas', 'M · Conversão', 'Disclosure por pergunta (aria-expanded).'],
  ['Sugestão de pauta', 'Início, Participe', '/participe', 'N · Conversão', 'Campo, temas opcionais, aviso de privacidade; envio online em preparação (copia o texto).'],
  ['Em preparação', 'Várias', '/duvidas', 'Notas da copy entre colchetes', 'Caixa tracejada para dados, colaboradores e materiais ainda não confirmados.'],
  ['Rodapé (bloco O)', 'Todas', '/', 'Final', 'Explorar · Sobre o projeto · Informações · Blog; aviso educativo.'],
  ['Questionário (Barkley e Benton)', 'Questionários', '/questionarios/consulta', 'Fluxo completo', 'Sim/Não com S e N grandes, Especifique, ponteiro da proporção de Sim, revisão, resumo em telas numeradas para print.'],
  ['Menu #', 'Todas', '/', 'Cabeçalho', 'Abre e fecha; aria-expanded; Esc fecha e devolve o foco; fecha ao navegar.'],
  ['Navegação textual', 'Início, Inventário', '/', 'Cabeçalho (≥1024 px), menu, rodapé', 'Palavras clicáveis; item atual sublinhado com aria-current.'],
  ['Controles compactos do artigo', 'A, B, C', '/artigos/a', 'Cabeçalho fixo', 'Índice, Ouvir e Aa no cabeçalho; nada se acumula antes do texto.'],
  ['Bloco de título piramidal', 'Início, A, B, C, Inventário', '/artigos/a', 'Topo', 'H1 mono no cinza; linha curta acima, longa abaixo; recebe foco ao trocar de página.'],
  ['Respiro após o título', 'A, B, C', '/artigos/a', 'Entre título e texto', 'Espaço proporcional à tela (11% da altura, 48–112 px).'],
  ['Modo foco (estado inicial)', 'A, B, C', '/artigos/a', 'Artigo inteiro', 'Título → respiro → texto; recursos complementares sob controle.'],
  ['Índice “Nesta página”', 'A, B, C', '/artigos/b', 'Cabeçalho', 'Rótulo com número de seções; seta gira entre fechado e aberto; leva à seção e move o foco.'],
  ['Ouvir', 'A, B, C', '/artigos/a', 'Cabeçalho', 'Ouvir, Pausar, Continuar; Parar e progresso aparecem só durante a reprodução.'],
  ['Aa + pop-up explicativo', 'A, B, C', '/artigos/a', 'Cabeçalho', 'No primeiro toque explica; Ajustar leitura (CTA azul) ou Fechar; Esc fecha; não abre sozinho.'],
  ['Preferências de leitura', 'A, B, C · C', '/artigos/c#preferencias', 'Painel Aa · Ferramentas e ajustes', 'Tamanho, espaçamento, fonte, largura; salvo no dispositivo.'],
  ['Título com #', 'A, B, C', '/artigos/a', 'Todas as seções', '# decorativo oculto do leitor de tela; H2 real em mono.'],
  ['Parágrafo (Inter)', 'A, B, C', '/artigos/a', 'Corpo', 'Alinhado à esquerda; escala com as preferências.'],
  ['Link textual', 'A, B, C', '/artigos/a', 'A: Sinais, Aplicação · B: Pergunta, Próximos · C: Agrupar', 'Sublinhado; leva a outro artigo ou às ferramentas.'],
  ['Grifos por fonte', 'A, Critérios', '/artigos/a', 'Contexto, Sinais, Atenção, Destaques, Aplicação', 'Amarelo = referência, laranja = experiência pessoal, azul = participação profissional; etiqueta escrita após cada grifo; revela na rolagem uma vez, estático com movimento reduzido.'],
  ['Superfície cinza editorial', 'A, B, C, Início', '/artigos/a', 'A: Sinais · B: Tempo · C: Síntese · cartões', 'Área ampla com frase, dado ou conclusão na base; cresce com o texto.'],
  ['Gráfico de áreas (treemap)', 'B', '/artigos/b', 'Estratégias por grupo', 'Área proporcional; leve variação de cor ao entrar na tela; seleção por toque ou teclado.'],
  ['Controle de arraste (período)', 'B', '/artigos/b', 'Estratégias por grupo', '“Arraste para explorar”; slider nativo: arraste, toque ou setas; atualiza as áreas.'],
  ['Filtro de grupo', 'B', '/artigos/b', 'Estratégias por grupo', 'Adultos, Estudantes, Profissionais.'],
  ['Legenda + detalhe da seleção', 'B', '/artigos/b', 'Estratégias / Tempo', 'Todos os valores; seleção mostra respostas e descrição (aria-live).'],
  ['Tabela alternativa', 'B', '/artigos/b', 'Estratégias por grupo', 'Recolhível; acompanha o período escolhido.'],
  ['Grade de áreas (100 blocos)', 'B', '/artigos/b', 'Tempo até começar', 'Alternar versão do layout; destacar faixa; resumo textual.'],
  ['Flowchart circular R1', 'C', '/artigos/c', 'Ciclo de reforço', 'Giro breve uma vez ao entrar na tela; “Selecione uma etapa para explorar”; lista ordenada.'],
  ['Esquema de agrupamento', 'C', '/artigos/c', 'Agrupar e hierarquizar', 'Agora / Próximo / Depois; hierarquia por borda e peso.'],
  ['Área de ferramentas', 'C, Início', '/artigos/c#ferramentas', 'Ferramentas e ajustes', 'Linha curta + título; Abrir/Fechar e Copiar.'],
  ['Sobre este artigo', 'A, B, C', '/artigos/a', 'Final do artigo', 'Disclosure com seta: linha fina, autoria, data, categoria, leitura, legenda dos grifos.'],
  ['Compartilhar', 'A, B, C', '/artigos/a', 'Final do artigo', 'WhatsApp e Facebook por link; Instagram via compartilhamento do sistema ou link copiado.'],
  ['Próximo artigo', 'A, B, C', '/artigos/a', 'Final do artigo', 'A → B → C → A.'],
  ['Destaque de questionário', 'Questionários, Ferramentas', '/questionarios', '# Questionários', 'Superfície com título, S e N grandes e CTA azul; abre o questionário.'],
  ['Cartão de artigo', 'Artigos', '/artigos', 'Índice de artigos', 'Superfície com categoria, título, linha fina; cartão inteiro clicável.'],
];

const cell = { padding: '12px 14px' };

export function Inventory({ wide }: { wide: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingTop: 40 }}>
      <div style={{ maxWidth: 680, width: '100%', margin: '0 auto' }}>
        <TitleBlock size={wide ? '30px' : '24px'} padding="32px 20px 36px" gap={20} kicker="Showroom | verificação">Inventário de componentes</TitleBlock>
      </div>
      <section aria-labelledby="h-wc" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 id="h-wc" style={{ margin: 0, font: `600 20px ${SANS}` }}><Hash /> Contagem de palavras</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 12 }}>
          {ARTICLES.map((a) => (
            <a key={a.key} href={'/' + a.key} className="hv-border" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 20, border: '1px solid var(--color-divider)', borderRadius: 8, textDecoration: 'none', color: 'var(--color-text)' }}>
              <span style={{ font: `500 14px ${SANS}`, color: 'var(--color-text-muted)' }}>Artigo {a.letter}</span>
              <span style={{ font: `600 32px/1.1 ${SANS}` }}>{a.words}</span>
              <span style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>palavras · limite 1.200 · {a.words <= 1200 ? 'dentro do limite' : 'acima do limite'}</span>
            </a>
          ))}
        </div>
        <span style={{ fontSize: 15, color: 'var(--color-text-muted)' }}>Conta título, linha fina, títulos de seção, parágrafos e legendas. Rótulos de gráficos e controles não entram.</span>
      </section>
      <section aria-labelledby="h-inv" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 id="h-inv" style={{ margin: 0, font: `600 20px ${SANS}` }}><Hash /> Componente → página → seção → comportamento</h2>
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-divider)', borderRadius: 8 }}>
          <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', fontSize: 15, lineHeight: 1.45 }}>
            <thead>
              <tr style={{ textAlign: 'left', background: 'var(--color-surface)' }}>
                <th scope="col" style={{ ...cell, width: '22%' }}>Componente</th>
                <th scope="col" style={{ ...cell, width: '14%' }}>Página</th>
                <th scope="col" style={{ ...cell, width: '24%' }}>Seção</th>
                <th scope="col" style={cell}>Comportamento disponível</th>
              </tr>
            </thead>
            <tbody>
              {INV.map(([c, p, href, s, b]) => (
                <tr key={c} style={{ borderTop: '1px solid var(--color-divider)' }}>
                  <th scope="row" style={{ ...cell, textAlign: 'left', font: `500 14px/1.4 ${SANS}` }}>{c}</th>
                  <td style={cell}><a href={href} style={{ color: 'var(--color-text)' }}>{p}</a></td>
                  <td style={cell}>{s}</td>
                  <td style={{ ...cell, color: 'var(--color-text-muted)' }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
