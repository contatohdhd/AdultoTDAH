// Home blocks A–N (block O is the footer). Copy from design-source/briefs/home-reestruturada.md.
// Bracketed notes in the brief become `pending` pieces (rendered as “Em preparação”).

export type Piece =
  | { kind: 'p'; text: string }
  | { kind: 'muted'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'pending'; text: string }
  | { kind: 'cards'; items: { title: string; paras: string[] }[] }
  | { kind: 'quote'; text: string }
  | { kind: 'dl'; items: [string, string][] };

export interface HomeBlock {
  id: string; letter: string; movement: string; title: string; lead?: string;
  body: Piece[];
  /** Number of body pieces shown on the home page (rest lives on `route`). */
  homeCount: number;
  cta?: { label: string; href: string };
  route?: string;
  special?: 'steps' | 'faq' | 'form';
}

const p = (text: string): Piece => ({ kind: 'p', text });
const muted = (text: string): Piece => ({ kind: 'muted', text });
const h3 = (text: string): Piece => ({ kind: 'h3', text });
const list = (...items: string[]): Piece => ({ kind: 'list', items });
const pending = (text: string): Piece => ({ kind: 'pending', text });

export const MOVEMENTS: Record<string, string> = {
  A: 'Identificação', B: 'Identificação', C: 'Identificação',
  D: 'Orientação', E: 'Orientação',
  F: 'Credibilidade', G: 'Credibilidade', H: 'Credibilidade',
  I: 'Aplicação', J: 'Aplicação', K: 'Aplicação', L: 'Aplicação',
  M: 'Conversão', N: 'Conversão', O: 'Conversão',
};

export const HOME_BLOCKS: HomeBlock[] = [
  {
    id: 'entenda', letter: 'A', movement: MOVEMENTS.A, title: 'Entenda seu TDAH. Aprenda a gerenciar.',
    lead: 'Não existe fórmula mágica nem uma estratégia que funcione da mesma forma para todas as pessoas. Existe conhecimento para compreender suas dificuldades e ferramentas para aprender a gerenciá-las.',
    body: [
      p('Respostas, estratégias e ferramentas para lidar com os desafios da vida adulta, reunindo referências científicas, contribuições profissionais e experiências pessoais.'),
      p('Este espaço nasceu das dúvidas que encontrei quando recebi meu diagnóstico na vida adulta. Descobri que compreender o TDAH é diferente de aprender a gerenciá-lo. A proposta deste blog é ajudar você a percorrer esse caminho, da avaliação às estratégias para o cotidiano.'),
    ],
    homeCount: 2, cta: { label: 'Explore os cinco passos', href: '/passos' },
  },
  {
    id: 'beneficios', letter: 'B', movement: MOVEMENTS.B, title: 'Conhecimento para compreender. Ferramentas para agir.',
    body: [{
      kind: 'cards', items: [
        { title: 'Conhecimento para compreender', paras: ['Encontre explicações sobre diagnóstico, avaliação, autocontrole, tratamento, funções executivas e dificuldades cotidianas. Uma curadoria que parte das dúvidas de adultos com TDAH e apresenta informações em linguagem simples, com fontes identificadas para você consultar e aprofundar.'] },
        { title: 'Ferramentas para agir', paras: ['Conhecer suas dificuldades é um começo. Aprender a organizar informações, registrar situações e experimentar estratégias faz parte do processo.', 'Cada um dos cinco passos foi planejado para reunir nove respostas, três estratégias e uma ferramenta para imprimir. O objetivo é ajudar você a organizar perguntas, visualizar dificuldades, preparar consultas e transformar conhecimento em ações possíveis no cotidiano.'] },
        { title: 'Gerenciamento contínuo', paras: ['O TDAH não desaparece simplesmente porque você recebeu um diagnóstico, leu um livro ou encontrou uma ferramenta.', 'Aprender a gerenciá-lo envolve reconhecer dificuldades, desenvolver habilidades, rever estratégias e adaptar o que funciona conforme a vida muda.'] },
      ],
    }],
    homeCount: 1,
  },
  {
    id: 'duvidas', letter: 'C', movement: MOVEMENTS.C, title: 'As dúvidas que nos trouxeram até aqui',
    lead: 'Como funciona o diagnóstico? Quanto custa a consulta neuropsicológica? E o medicamento? O que fazer depois de descobrir o TDAH?',
    body: [
      p('Essas são algumas das perguntas que acompanham adultos que suspeitam do transtorno, receberam um diagnóstico ou continuam enfrentando dificuldades que ainda não conseguiram compreender.'),
      p('Em meio a diferentes explicações, opiniões e informações na internet, nem sempre é fácil distinguir conhecimento científico de desinformação.'),
      p('O excesso de conteúdos também pode dificultar a escolha do próximo passo. Foi o que aconteceu comigo: encontrei muitas respostas, mas também passei por momentos de paralisia diante de tantos assuntos, dúvidas e possibilidades.'),
      h3('O que você encontra neste blog?'),
      p('Um caminho organizado para compreender o TDAH adulto, conhecer o tratamento, encontrar ferramentas e explorar os desafios da vida cotidiana.'),
      p('A proposta não é oferecer uma resposta universal. É apresentar informações fundamentadas, experiências identificadas e caminhos que você possa discutir com os profissionais responsáveis pelo seu cuidado.'),
      h3('Dados, pesquisas e dúvidas do público'),
      p('Esta área reunirá informações sobre o TDAH na população adulta brasileira, a procura por diagnósticos e o interesse por temas como medicação, avaliação, organização e tratamento.'),
      p('Entre as pautas de investigação estão:'),
      list(
        'Quantidade estimada de adultos com TDAH no Brasil.',
        'Crescimento das buscas relacionadas ao transtorno, incluindo a alegação de aumento de 556%, ainda dependente de confirmação da fonte, do período e da metodologia.',
        'Dúvidas mais frequentes sobre diagnóstico tardio, medicação e acompanhamento.',
        'TDAH tax — os custos e prejuízos cotidianos associados às dificuldades de gerenciamento.',
        'Pesquisas sobre expectativa de vida, ansiedade, depressão e outros problemas de saúde relacionados.',
      ),
      pending('Cards de dados com fonte, ano, população analisada e link para o estudo. Estatísticas ainda não verificadas não são apresentadas como fatos.'),
    ],
    homeCount: 3, route: '/duvidas', cta: { label: 'Explore as dúvidas mais frequentes', href: '/duvidas' },
  },
  {
    id: 'passos', letter: 'D', movement: MOVEMENTS.D, title: 'Por onde começar? Conheça os cinco passos.',
    body: [], homeCount: 0, route: '/passos', special: 'steps',
  },
  {
    id: 'ciencia', letter: 'E', movement: MOVEMENTS.E, title: 'O conhecimento científico por trás das dúvidas',
    lead: 'Conhecer o TDAH é também aprender a distinguir o que sabemos, o que ainda precisa ser investigado e o que cada pessoa experimenta em sua própria vida.',
    body: [
      p('Os conteúdos do blog serão organizados a partir das dúvidas do público, das referências científicas e das contribuições dos profissionais participantes.'),
      p('Entre os assuntos que serão aprofundados estão avaliação, sintomas, funções executivas, tratamento, autorregulação, produtividade, dificuldades emocionais e consequências do transtorno no cotidiano.'),
      p('Gráficos, pesquisas e explicações serão acompanhados da identificação das fontes, permitindo que você consulte a origem da informação.'),
      p('O conhecimento que me ajudou a compreender minhas dificuldades pode ser um ponto de partida para você encontrar suas próprias respostas.'),
      pending('Cards de evidências e perguntas frequentes, vinculados aos artigos dos cinco passos.'),
    ],
    homeCount: 2, route: '/referencias', cta: { label: 'Consulte os dados e as referências', href: '/referencias' },
  },
  {
    id: 'origem', letter: 'F', movement: MOVEMENTS.F, title: 'Minhas dúvidas deram origem a este espaço.',
    lead: 'Sempre fui curioso. Meu diagnóstico trouxe algumas respostas e muitas perguntas novas.',
    body: [
      p('Recebi o diagnóstico de TDAH na vida adulta, em 2022, aos 26 anos. Até então, muitas das dificuldades que apareciam na minha rotina eram interpretadas por mim como falhas pessoais, falta de organização ou incapacidade de administrar determinadas situações.'),
      p('Eu queria entender por que tinha tanta dificuldade para fazer coisas que pareciam simples: concentrar-me, prestar atenção, organizar atividades, planejar, resolver problemas, controlar emoções e manter uma rotina.'),
      p('Também tinha dúvidas sobre a avaliação, os profissionais responsáveis, os custos, o tratamento e o que realmente poderia fazer para lidar com as dificuldades.'),
      p('Foi a partir dessas perguntas que comecei a buscar informações, estudar Psicologia e explorar referências sobre o transtorno.'),
      h3('Entre o excesso de informações e a necessidade de agir'),
      p('Durante a busca, encontrei conteúdos científicos, explicações simplificadas, mensagens motivacionais e informações contraditórias.'),
      p('Em alguns momentos, senti-me paralisado diante do volume de materiais. Não sabia exatamente por onde começar nem como transformar tudo aquilo em algo útil para minha vida.'),
      p('A leitura me ajudou a compreender parte das minhas dificuldades. Também me fez perceber que reconhecer um problema não elimina automaticamente suas consequências.'),
      p('Aprender a gerenciar o TDAH exige um processo contínuo de observação, responsabilidade, aprendizado e adaptação.'),
      p('Por isso criei este blog: para organizar o conhecimento que venho estudando, compartilhar o que aprendi com meus erros e oferecer um ponto de partida para outros adultos que enfrentam dúvidas semelhantes.'),
      h3('Minha trajetória — 2022 a 2026'),
      pending('Gráfico cronológico editorial com acontecimentos documentados: diagnóstico, dificuldades percebidas, estudos, experiências com tratamento, leitura, desenvolvimento de ferramentas e evolução do projeto. Somente datas confirmadas.'),
      muted('O gráfico não será uma demonstração clínica de melhora ou piora. Será um registro da trajetória pessoal, incluindo altos e baixos, dificuldades com organização, gerenciamento, medicação e condução de veículos, quando os acontecimentos forem devidamente contextualizados.'),
    ],
    homeCount: 2, route: '/trajetoria', cta: { label: 'Conheça minha trajetória', href: '/trajetoria' },
  },
  {
    id: 'livro', letter: 'G', movement: MOVEMENTS.G, title: 'A leitura que orientou meu caminho.',
    lead: 'Um livro não resolveu meu TDAH. Mas me ajudou a compreender melhor o que eu precisava aprender a gerenciar.',
    body: [
      p('Uma das referências centrais deste projeto é o livro Vencendo o TDAH Adulto, de Russell A. Barkley e Christine M. Benton.'),
      p('Russell A. Barkley é um pesquisador conhecido por suas contribuições ao estudo do TDAH. A obra organiza informações sobre o transtorno, avaliação, tratamento e estratégias para diferentes situações da vida cotidiana.'),
      p('A segunda edição brasileira, publicada pela Artmed, apresenta o conteúdo em cinco passos e aproximadamente trinta capítulos.'),
      p('Foi essa organização que me ajudou a criar um percurso de estudo mais claro.'),
      p('Ao longo da leitura, comecei a relacionar os conceitos do livro com situações da minha rotina, dificuldades pessoais e estratégias que poderia experimentar.'),
      p('O livro não substitui avaliação profissional nem oferece uma fórmula universal. Sua contribuição, para mim, foi oferecer uma estrutura para compreender o transtorno e buscar maneiras mais informadas de lidar com ele.'),
      h3('Identificação da referência'),
      { kind: 'dl', items: [['Título', 'Vencendo o TDAH Adulto'], ['Subtítulo', 'Transtorno de déficit de atenção/hiperatividade'], ['Autores', 'Russell A. Barkley e Christine M. Benton'], ['Edição brasileira utilizada', '2ª edição'], ['Editora', 'Artmed'], ['Área', 'Psicoterapia e saúde mental']] },
      h3('O que você encontra a partir desta leitura?'),
      p('Explicações sobre os conhecimentos científicos disponíveis, formas de avaliação, tratamentos, habilidades de autorregulação e estratégias para lidar com dificuldades que aparecem nos diferentes contextos da vida.'),
      p('Também apresentarei recomendações, questionários, vídeos e outras referências de estudo. Quando utilizar conteúdos originalmente publicados em inglês, procurarei oferecer uma síntese em português com indicação do material de origem.'),
    ],
    homeCount: 2, route: '/livro', cta: { label: 'Conheça o livro e seus autores', href: '/livro' },
  },
  {
    id: 'colaboracao', letter: 'H', movement: MOVEMENTS.H, title: 'Informação científica, participação profissional e responsabilidade.',
    lead: 'A experiência pessoal ajuda a formular perguntas. As referências e os profissionais ajudam a investigá-las com mais rigor.',
    body: [
      p('A proposta do blog é reunir três perspectivas complementares: o conhecimento científico, as contribuições profissionais e os relatos de quem vive o TDAH na vida adulta.'),
      p('A estrutura editorial prevê a colaboração de uma neuropsicóloga e de uma psiquiatra, apresentadas no planejamento como Silvana e Ana, respectivamente.'),
      p('A participação de cada profissional, quando confirmada, será identificada com nome, especialidade e contribuição específica, distinguindo respostas, comentários e eventuais revisões técnicas.'),
      p('Os primeiros artigos serão estruturados para apresentar dúvidas recorrentes do público e relacioná-las às informações do livro, aos comentários profissionais e às minhas próprias experiências.'),
      { kind: 'quote', text: 'Não pretendo substituir a orientação de um especialista.' },
      p('Quero organizar perguntas, compartilhar fontes confiáveis e tornar as informações mais acessíveis para que o leitor possa compreender melhor suas dificuldades e conversar com os profissionais responsáveis pelo seu acompanhamento.'),
      pending('Apresentação profissional somente após confirmação da participação, credenciais e autorização. A página não afirma que alguém revisou, aprovou ou endossou conteúdos.'),
    ],
    homeCount: 2, route: '/fontes', cta: { label: 'Conheça nossas fontes e colaboradores', href: '/fontes' },
  },
  {
    id: 'papel', letter: 'I', movement: MOVEMENTS.I, title: 'Da leitura para o papel.',
    lead: 'Uma informação pode ser mais útil quando você consegue encontrá-la, registrá-la e utilizá-la no momento necessário.',
    body: [
      p('Uma dúvida anotada pode acompanhar você até a consulta. Uma tarefa dividida pode tornar mais claro por onde começar. Um registro pode ajudar a explicar uma dificuldade que, durante uma conversa, você não consegue descrever.'),
      p('Foi pensando nisso que comecei a utilizar ferramentas de anotação, materiais imprimíveis e estratégias para tornar informações mais visíveis na minha rotina.'),
      h3('Ferramentas e questionários'),
      p('Nesta área, você encontrará materiais relacionados aos cinco passos, como:'),
      list(
        'Fichas para organizar perguntas antes de uma avaliação.', 'Mapas de dificuldades e pontos fortes.', 'Registros para acompanhar observações sobre o tratamento.',
        'Roteiros de planejamento, execução e retomada de tarefas.', 'Mapas das diferentes áreas da vida.', 'Questionários de reflexão e acompanhamento pessoal.',
        'Referências e ferramentas de terceiros, quando suas condições de uso e disponibilização permitirem.',
      ),
      p('Também compartilharei a ferramenta de anotação que desenvolvi a partir das minhas próprias necessidades, explicando o processo, o modo de utilização e as adaptações que experimentei.'),
      p('Além dos materiais próprios, esta área poderá apresentar ferramentas de gestão do tempo e organização desenvolvidas ou divulgadas por outras instituições, incluindo referências acadêmicas como Harvard, devidamente identificadas.'),
      p('O objetivo é simples: dar um lugar concreto às informações e ajudar você a transformar uma intenção em uma ação que possa acompanhar.'),
      muted('Os materiais serão apresentados com finalidade, instruções de preenchimento, origem e limites de utilização. Questionários de reflexão não serão apresentados como instrumentos de diagnóstico.'),
    ],
    homeCount: 2, route: '/ferramentas', cta: { label: 'Explore os materiais para imprimir', href: '/ferramentas' },
  },
  {
    id: 'erros', letter: 'J', movement: MOVEMENTS.J, title: 'Aprenda com meus erros.',
    lead: 'Nem tudo o que aprendi veio dos meus acertos. Parte importante do conhecimento que busquei nasceu das consequências dos meus próprios erros.',
    body: [
      p('Minha trajetória inclui dificuldades com organização, planejamento, tomada de decisões, gerenciamento das emoções e situações que tiveram consequências reais na minha vida.'),
      p('Compartilhar somente as estratégias que deram certo deixaria uma parte importante dessa história de fora.'),
      p('Por isso, esta seção apresentará experiências que vivi, os problemas que percebi, as consequências que enfrentei e o que tentei modificar.'),
      h3('Riscos na condução de veículos — minha experiência'),
      p('Foi a partir da leitura sobre o TDAH que comecei a compreender de outra forma minhas dificuldades e a diminuir parte da culpa que carregava por ter causado acidentes de carro.'),
      p('Isso não elimina minha responsabilidade pelos acontecimentos. Mas ajuda a compreender que reconhecer fatores de risco e buscar estratégias de prevenção faz parte do processo de mudança.'),
      p('Também apresentarei experiências menores do cotidiano, como esquecimentos e situações em que precisei criar lembretes físicos — por exemplo, uma plaquinha para verificar se o gás ficou aberto.'),
      muted('Esses exemplos não são recomendações clínicas universais. São relatos sobre o que aconteceu comigo e o que procurei aprender.'),
      h3('Fatores que podem ajudar ou dificultar'),
      p('Existem condições, hábitos e estratégias que podem contribuir para lidar com dificuldades associadas ao transtorno. Também existem situações que aumentam a exposição aos problemas.'),
      p('É a partir dessa relação entre contexto, comportamento, consequências e possíveis adaptações que quero compartilhar minha experiência.'),
      { kind: 'quote', text: 'O que aconteceu, por que isso importa e o que posso aprender para agir de outra forma?' },
    ],
    homeCount: 2, route: '/erros', cta: { label: 'Aprenda com meus erros', href: '/erros' },
  },
  {
    id: 'curadoria', letter: 'K', movement: MOVEMENTS.K, title: 'Uma seleção para aprofundar.',
    lead: 'Você não precisa depender de uma única explicação para compreender um assunto.',
    body: [
      p('Livros, artigos científicos, vídeos, materiais profissionais e fontes especializadas podem ajudar a aprofundar questões que uma página inicial não consegue desenvolver.'),
      p('Esta seção reunirá uma curadoria organizada por tema, referência e finalidade.'),
      p('Além do livro que orientou meu percurso, apresentarei outros materiais que ajudem a compreender diferentes aspectos do TDAH adulto, incluindo pesquisas, explicações sobre tratamentos, estratégias de gerenciamento e ferramentas.'),
      p('Quando utilizar vídeos em inglês, como materiais de Russell A. Barkley disponíveis na internet, a proposta é apresentar sínteses em português e orientar o acesso ao conteúdo original.'),
      p('Cada indicação explicará por que o material foi selecionado, qual assunto aborda e como se relaciona aos conteúdos do blog.'),
      pending('Lista da curadoria por tema, referência e finalidade.'),
    ],
    homeCount: 2, route: '/curadoria', cta: { label: 'Explore a curadoria', href: '/curadoria' },
  },
  {
    id: 'criterios', letter: 'L', movement: MOVEMENTS.L, title: 'Como identificar cada tipo de conteúdo?',
    lead: 'Quero que você saiba quem está falando e de onde vem cada informação.',
    body: [
      p('Para isso, os conteúdos terão identificações escritas acompanhadas de uma linguagem visual própria. As categorias são identificadas também por texto, sem depender exclusivamente da cor.'),
    ],
    homeCount: 1, route: '/criterios', cta: { label: 'Conheça os critérios editoriais', href: '/criterios' },
  },
  {
    id: 'perguntas', letter: 'M', movement: MOVEMENTS.M, title: 'Perguntas frequentes',
    body: [], homeCount: 0, route: '/perguntas', special: 'faq', cta: { label: 'Veja outras dúvidas', href: '/perguntas' },
  },
  {
    id: 'participe', letter: 'N', movement: MOVEMENTS.N, title: 'Qual dúvida acompanha você agora?',
    lead: 'Talvez você esteja tentando compreender o diagnóstico. Talvez queira organizar melhor seu trabalho, preparar uma consulta ou encontrar palavras para explicar uma dificuldade.',
    body: [
      p('As dúvidas do público são parte importante deste projeto.'),
      p('Quero conhecer as perguntas que ainda não foram respondidas, os assuntos que merecem ser aprofundados e os problemas que aparecem no cotidiano de outros adultos com TDAH.'),
      p('Você poderá sugerir temas sobre avaliação, tratamento, autocontrole, organização, trabalho, relacionamentos, finanças e outras áreas da vida.'),
      p('As sugestões poderão orientar os próximos artigos, questionários, materiais e entrevistas com profissionais.'),
      muted('Para proteger sua privacidade, não é necessário compartilhar dados clínicos ou informações pessoais sensíveis.'),
    ],
    homeCount: 1, route: '/participe', special: 'form', cta: { label: 'Envie sua pergunta', href: '/participe' },
  },
];

export const RESPONSABILIDADE = [
  'Divulgar informações sobre TDAH, seus sintomas e seus tratamentos exige cuidado. O objetivo do blog é compartilhar conhecimento, não realizar diagnósticos nem substituir decisões tomadas em acompanhamento profissional.',
  'Não existe estratégia que funcione de maneira idêntica para todas as pessoas. Por isso, cada conteúdo procurará distinguir evidências, interpretações, opiniões e experiências.',
];

export const FAQ: [string, string][] = [
  ['Como saber se posso ter TDAH?', 'A suspeita pode surgir a partir de dificuldades persistentes com atenção, impulsividade, organização ou autocontrole. A avaliação adequada depende de um profissional habilitado e da análise da história e do contexto de cada pessoa.'],
  ['É possível receber o diagnóstico na vida adulta?', 'Sim. Algumas pessoas procuram avaliação somente na vida adulta, inclusive quando tiveram dificuldades durante a infância que não foram reconhecidas na época.'],
  ['Quanto custa uma avaliação?', 'Os valores dependem do serviço, da região, do profissional e dos procedimentos necessários. O blog pretende explicar os caminhos possíveis e as perguntas úteis antes de contratar um serviço.'],
  ['O tratamento sempre envolve medicamentos?', 'As opções dependem da avaliação clínica e das necessidades individuais. O blog apresentará informações sobre medicamentos estimulantes e não estimulantes, além de estratégias e outras modalidades de acompanhamento.'],
  ['O TDAH afeta somente os estudos ou o trabalho?', 'Não. As dificuldades podem surgir em diferentes áreas, como finanças, relacionamentos, organização cotidiana, saúde, direção e gerenciamento das emoções.'],
  ['Por que apresentar ferramentas no papel?', 'Porque algumas informações podem ser mais fáceis de consultar quando estão visíveis e disponíveis durante a atividade. Os materiais impressos são uma possibilidade de organização, não uma solução superior para todas as pessoas.'],
  ['Este blog substitui o acompanhamento profissional?', 'Não. O conteúdo é educativo e oferece referências, exemplos e ferramentas de reflexão.'],
];

export const CLOSING = 'Conhecimento para compreender. Ferramentas para agir. Um caminho para continuar aprendendo a gerenciar o TDAH adulto.';
export const DISCLAIMER = 'Aviso: Conteúdo educativo. Não substitui avaliação, diagnóstico, tratamento ou acompanhamento profissional de saúde.';
