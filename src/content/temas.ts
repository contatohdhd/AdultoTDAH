// The five posts = the five steps. From the zip “Capas conteúdo”: folders 01–04 are the posts of
// steps 1–4 and the loose files are the post of step 5. Each post has one GIF cover; the remaining
// images are distributed inside the content, next to the chapter they relate to.
// Files: public/temas/<slug>.jpg (still) and <slug>.mp4 (when the original was an animated GIF).

export interface Imagem {
  slug: string;
  alt: string;
  /** Short caption (working title of the topic the image illustrates). */
  legenda: string;
  animated: boolean;
}

export interface Post {
  passo: 1 | 2 | 3 | 4 | 5;
  capa: Imagem;
  /** Inline images keyed by the chapter they are placed before. */
  imagens: { cap: number; img: Imagem }[];
}

const img = (slug: string, legenda: string, alt: string, animated: boolean): Imagem => ({ slug, legenda, alt, animated });

export const POSTS: Post[] = [
  {
    passo: 1,
    capa: img('dias-passam', 'Os dias passam e a dúvida continua', 'Calendário virando as folhas sem parar', true),
    imagens: [
      { cap: 2, img: img('lidar-sozinho', 'Dá para lidar sozinho?', 'Pessoa empurrando uma pedra enorme ladeira acima', true) },
      { cap: 3, img: img('onde-buscar-ajuda', 'Onde buscar ajuda', 'Pessoa sentada dentro da própria cabeça, olhando para fora', true) },
    ],
  },
  {
    passo: 2,
    capa: img('comecar-a-tarefa', 'Começar a tarefa', 'Relógio girando enquanto uma pessoa alterna entre a mesa de trabalho e a cama', true),
    imagens: [
      { cap: 7, img: img('rolagem-infinita', 'A rolagem que nunca termina', 'Celular dentro de celular, em uma rolagem infinita', true) },
    ],
  },
  {
    passo: 3,
    capa: img('acompanhar-evolucao', 'Acompanhe sua evolução', 'Pombo com uma câmera de vigilância no lugar da cabeça', true),
    imagens: [
      { cap: 13, img: img('observar-efeitos', 'O que observar no tratamento', 'Duas câmeras de vigilância girando sobre fundo cinza', true) },
    ],
  },
  {
    passo: 4,
    capa: img('pare-a-acao', 'Pare a ação!', 'Mãos saindo da tela de um celular e puxando a pessoa para dentro', true),
    imagens: [
      { cap: 19, img: img('exteriorize', 'Tire da cabeça o que importa', 'Rolo de papel com um post escrito “Post about very important things”', false) },
      { cap: 21, img: img('armadilha-recompensa', 'A armadilha da recompensa imediata', 'Celular transformado em ratoeira, com uma notificação de curtida', true) },
      { cap: 23, img: img('senso-de-humor', 'Rir dos próprios tropeços', 'Rolo de papel higiênico impresso como um feed de rede social', false) },
    ],
  },
  {
    passo: 5,
    capa: img('procrastinacao', 'Procrastinação', 'Relógio de pulso se deformando enquanto os ponteiros giram', true),
    imagens: [
      { cap: 25, img: img('tempo-e-seu-amigo', 'O tempo é seu amigo', 'Frasco de remédio derramando relógios no lugar de comprimidos', false) },
      { cap: 27, img: img('relacionamentos', 'Relacionamentos', 'Cartela de comprimidos “Friends” com miniaturas de pessoas', false) },
      { cap: 28, img: img('sono', 'Sono', 'Cérebro com um menu de computador aberto na opção “Refresh”', false) },
      { cap: 28, img: img('abuso-cafeina', 'Abuso de cafeína', 'Bolsa de soro cheia de café, com o rótulo “coffee”', false) },
      { cap: 29, img: img('positividade-toxica', 'Positividade tóxica', 'Frasco de remédio com o rótulo “Positive thinking”', false) },
    ],
  },
];

export const postDoPasso = (n: number) => POSTS.find((p) => p.passo === n);
