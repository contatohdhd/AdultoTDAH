// Jornada TDAH v2 — sections 03–09 + sources, placed below the vicious/virtuous cycles.
// Copy verbatim from design-source/prototypes/Jornada TDAH v2.dc.html.

/** Images live in public/jornada/ (originals from the Claude Design project assets/). */
export const IMG = {
  farol: '/jornada/farol.gif',
  capa: '/jornada/livro-capa.jpg',
  estante: '/jornada/livro-estante.jpg',
  sumario1: '/jornada/sumario-1.jpg',
  sumario2: '/jornada/sumario-2.jpg',
  pag211: '/jornada/pag-211.jpg',
  cap26: '/jornada/cap-26.jpg',
};

/** [chapter, title, page, highlighted in my copy] */
export type Cap = [number, string, number, 0 | 1];

export const SUMARIO: { nome: string; titulo: string; note?: boolean; caps: Cap[] }[] = [
  { nome: 'Primeiro passo', titulo: 'Para começar, seja avaliado', caps: [[1, 'É possível que você tenha TDAH?', 3, 1], [2, 'Você consegue lidar sozinho com o seu problema?', 11, 1], [3, 'Onde você pode conseguir ajuda?', 15, 1], [4, 'O que você precisa para a avaliação?', 18, 1], [5, 'O que a avaliação lhe dirá?', 22, 1]] },
  { nome: 'Segundo passo', titulo: 'Mude o seu pensamento: conheça e assuma o seu TDAH', caps: [[6, 'Conheça o seu TDAH', 39, 1], [7, 'Resistindo aos impulsos: o primeiro passo no autocontrole', 50, 1], [8, 'Autocontrole: como conseguir o que você quer', 56, 1], [9, 'Funções executivas: as sete habilidades que compõem o autocontrole… e mais', 61, 1], [10, 'A natureza do TDAH e como você pode controlá-lo', 88, 1], [11, 'Assuma o seu TDAH', 93, 1]] },
  { nome: 'Terceiro passo', titulo: 'Mude o seu cérebro: medicamentos para controlar o TDAH', caps: [[12, 'Por que faz sentido tentar o medicamento?', 107, 1], [13, 'Estimulantes', 115, 1], [14, 'Não estimulantes', 130, 1], [15, 'O que esperar do tratamento', 137, 1]] },
  { nome: 'Quarto passo', titulo: 'Mude a sua vida: regras cotidianas para o sucesso', note: true, caps: [[16, 'Regra 1: Pare a ação!', 151, 1], [17, 'Regra 2: Olhe para o passado… e depois para o futuro', 155, 1], [18, 'Regra 3: Expresse o passado… e depois o futuro', 158, 1], [19, 'Regra 4: Exteriorize as informações fundamentais', 162, 1], [20, 'Regra 5: Contemple o futuro', 168, 1], [21, 'Regra 6: Fracione o futuro… e faça valer a pena', 173, 1], [22, 'Regra 7: Torne os problemas externos, físicos e manuais', 179, 1], [23, 'Regra 8: Tenha senso de humor!', 184, 1]] },
  { nome: 'Quinto passo', titulo: 'Mude a sua situação: controlando o TDAH em áreas específicas da sua vida', caps: [[24, 'Educação', 189, 0], [25, 'Trabalho', 199, 0], [26, 'Dinheiro', 213, 1], [27, 'Relacionamentos', 221, 0], [28, 'Riscos na condução de veículos, para a saúde e o estilo de vida', 230, 0], [29, 'Outros problemas mentais e emocionais', 242, 0], [30, 'Drogas e crime', 249, 0]] },
];

/** Author stats: [value, text, footnote]. */
export const AUTOR_STATS: [string, string, number][] = [
  ['270+', 'artigos científicos e capítulos sobre TDAH e transtornos relacionados.', 5],
  ['23', 'livros, escalas e manuais clínicos, somando 41 edições.', 5],
  ['800+', 'palestras convidadas em todo o mundo.', 5],
  ['1º', 'Consenso Internacional sobre TDAH foi liderado por ele.', 7],
  ['225 mil', 'exemplares impressos da edição original deste livro, Taking Charge of Adult ADHD.', 6],
  ['BAARS-IV · BDEFS', 'Escalas de sua autoria para avaliar TDAH em adultos e funções executivas.', 8],
];

export const TRECHOS = [
  { ref: 'Cap. 25 · Trabalho · p. 211', text: 'Uma caminhada rápida de apenas alguns minutos melhorará sua concentração durante cerca de uma hora.', img: IMG.pag211, alt: 'Página 211 com trechos grifados e anotação à mão' },
  { ref: 'Cap. 26 · Dinheiro · p. 213', text: 'Qualquer oportunidade de gastar pode se transformar em um impulso para comprar.', img: IMG.cap26, alt: 'Abertura do capítulo 26, Dinheiro, com trecho grifado' },
];

export const CLUBE_PASSOS = ['1 · Seja avaliado', '2 · Mude o seu pensamento', '3 · Mude o seu cérebro', '4 · Mude a sua vida', '5 · Mude a sua situação'];

/** Sources (consulted Oct 2026): [html-free label parts, links]. */
export const FONTES: { text: string; italic?: string; after?: string; links: [string, string][] }[] = [
  { text: 'Song P. et al. The prevalence of adult ADHD: a global systematic review and meta-analysis.', italic: 'J Glob Health', after: ', 2021.', links: [['Link', 'https://www.semanticscholar.org/paper/The-prevalence-of-adult-attention-deficit-disorder:-Song-Zha/192011a4f73082bea24963cf069e90b503887510'], ['faixas etárias', 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9197091/']] },
  { text: 'Sibley M. et al. Variable Patterns of Remission From ADHD in the MTA.', italic: 'Am J Psychiatry', after: '.', links: [['Link', 'https://psychiatryonline.org/doi/full/10.1176/appi.ajp.2021.21010032']] },
  { text: 'Coortes de nascimento de Pelotas, 1982 e 1993.', links: [['Link', 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10566560/']] },
  { text: 'Barkley R., Fischer M. Hyperactive Child Syndrome and Estimated Life Expectancy at Young Adult Follow-Up.', italic: 'J Atten Disord', after: ', 2019.', links: [['DOI', 'https://doi.org/10.1177/1087054718816164'], ['ADDitude', 'https://www.additudemag.com/why-does-adhd-reduce-life-expectancy/']] },
  { text: 'ADDitude — Russell Barkley, Ph.D.', links: [['Link', 'https://www.additudemag.com/author/russell-barkley-ph-d/']] },
  { text: 'Guilford Press — Taking Charge of Adult ADHD, 2ª ed. (2021).', links: [['Link', 'https://www.guilford.com/books/Taking-Charge-of-Adult-ADHD/Russell-Barkley/9781462546855'], ['Biografia', 'https://www.amazon.com/Taking-Charge-Adult-ADHD-Second/dp/1462546854']] },
  { text: 'Wikipedia — Russell Barkley.', links: [['Link', 'https://en.wikipedia.org/wiki/Russell_Barkley']] },
  { text: 'Journal of Clinical Child & Adolescent Psychology — Past Presidents Series: Russell A. Barkley.', links: [['Link', 'https://www.tandfonline.com/doi/full/10.1080/15374416.2025.2521848']] },
];
