// Block D — the five steps and the 30 reference chapters (Barkley & Benton, 2ª ed.).

export interface Step {
  n: number; label: string; title: string; motto: string; paras: string[]; find: string;
  chapters: [number, string, number][]; cta: string;
}

export const STEPS: Step[] = [
  {
    n: 1, label: 'Primeiro passo', title: 'Entenda os sinais e prepare-se para buscar ajuda.', motto: 'Para começar, seja avaliado.',
    paras: [
      'A proposta desta etapa é ajudar você a reconhecer possíveis dificuldades, compreender como funciona a avaliação profissional e organizar suas perguntas antes de procurar ajuda.',
      'Receber um diagnóstico pode esclarecer muitas coisas, mas também pode gerar dúvidas sobre o que acontece depois.',
      'O primeiro passo é compreender o processo e participar dele com informações claras.',
    ],
    find: '9 respostas sobre suspeita de TDAH e avaliação, 3 estratégias para organizar suas dúvidas e 1 checklist para imprimir e levar à consulta.',
    chapters: [[1, 'É possível que você tenha TDAH?', 3], [2, 'Você consegue lidar sozinho com o seu problema?', 11], [3, 'Onde você pode conseguir ajuda?', 15], [4, 'O que você precisa para a avaliação?', 18], [5, 'O que a avaliação lhe dirá?', 22]],
    cta: 'Entenda a avaliação',
  },
  {
    n: 2, label: 'Segundo passo', title: 'Conheça seu TDAH e entenda suas dificuldades.', motto: 'Mude seu pensamento: conheça e assuma o seu TDAH.',
    paras: [
      'A proposta desta etapa é compreender como o transtorno pode estar relacionado à impulsividade, ao autocontrole, à atenção, à organização e às funções executivas.',
      'O objetivo não é reduzir uma pessoa ao diagnóstico. É reconhecer as dificuldades que aparecem na rotina e entender os mecanismos que podem contribuir para elas.',
      'Conhecer o problema permite observar situações com mais clareza e buscar formas de gerenciamento.',
    ],
    find: '9 respostas sobre impulsividade, autocontrole e funções executivas, 3 estratégias para reconhecer dificuldades cotidianas e 1 mapa de dificuldades e pontos fortes para imprimir.',
    chapters: [[6, 'Conheça o seu TDAH', 39], [7, 'Resistindo aos impulsos: o primeiro passo no autocontrole', 50], [8, 'Autocontrole: como conseguir o que você quer', 56], [9, 'Funções executivas: as sete habilidades que compõem o autocontrole', 61], [10, 'A natureza do TDAH e como você pode controlá-lo', 88], [11, 'Assuma o seu TDAH', 93]],
    cta: 'Compreenda seu TDAH',
  },
  {
    n: 3, label: 'Terceiro passo', title: 'Entenda o tratamento e acompanhe sua evolução.', motto: 'Mude o seu cérebro: compreenda o papel dos medicamentos no tratamento do TDAH.',
    paras: [
      'Esta etapa apresenta informações sobre o tratamento medicamentoso, suas possibilidades, limitações e acompanhamento.',
      'Os capítulos organizam a discussão em quatro questões: por que considerar medicamentos, quais são as categorias apresentadas, o que esperar do tratamento e quais dúvidas conversar com o profissional responsável.',
      'Compreender as opções não significa decidir sozinho. A proposta é ajudar você a preparar perguntas, registrar observações e participar de maneira informada das decisões sobre seu cuidado.',
    ],
    find: '9 respostas sobre medicamentos e expectativas de tratamento, 3 estratégias para preparar perguntas e registrar sua experiência e 1 ficha de acompanhamento para imprimir e levar às consultas.',
    chapters: [[12, 'Por que faz sentido tentar o medicamento?', 107], [13, 'Estimulantes', 115], [14, 'Não estimulantes', 130], [15, 'O que esperar do tratamento', 137]],
    cta: 'Entenda o tratamento',
  },
  {
    n: 4, label: 'Quarto passo', title: 'Transforme conhecimento em ações no dia a dia.', motto: 'Mude sua vida: regras cotidianas para o sucesso.',
    paras: [
      'Compreender o TDAH é importante, mas o cotidiano continua apresentando interrupções, esquecimentos, decisões, tarefas e responsabilidades.',
      'Esta etapa apresenta as oito regras práticas descritas no livro, relacionadas à interrupção da resposta imediata, ao uso do passado para orientar o futuro, à exteriorização de informações, ao fracionamento de objetivos e ao uso de recursos físicos e manuais.',
      'A proposta é criar condições práticas para orientar a ação, acompanhar objetivos e diminuir dificuldades decorrentes da desorganização.',
    ],
    find: '9 respostas sobre organização, planejamento e execução, 3 estratégias para tornar informações visíveis e dividir tarefas e 1 roteiro diário para imprimir e acompanhar suas ações.',
    chapters: [[16, 'Regra 1: Pare a ação!', 151], [17, 'Regra 2: Olhe para o passado… e depois para o futuro', 155], [18, 'Regra 3: Expresse o passado… e depois o futuro', 158], [19, 'Regra 4: Exteriorize as informações fundamentais', 162], [20, 'Regra 5: Contemple o futuro', 168], [21, 'Regra 6: Fracione o futuro… e faça valer a pena', 173], [22, 'Regra 7: Torne os problemas externos, físicos e manuais', 179], [23, 'Regra 8: Tenha senso de humor!', 184]],
    cta: 'Conheça as estratégias',
  },
  {
    n: 5, label: 'Quinto passo', title: 'Aplique as estratégias às diferentes áreas da vida.', motto: 'Mude sua situação: gerenciando o TDAH nos contextos da vida adulta.',
    paras: [
      'O TDAH não aparece somente quando você precisa estudar ou executar uma tarefa.',
      'As dificuldades podem afetar trabalho, educação, dinheiro, relacionamentos, saúde, direção de veículos e outros aspectos da vida cotidiana.',
      'Esta etapa relaciona os conhecimentos anteriores aos diferentes contextos da vida adulta. O objetivo é reconhecer demandas, possíveis prejuízos e estratégias que podem ajudar a organizar prioridades e buscar apoio adequado.',
    ],
    find: '9 respostas sobre desafios em diferentes áreas da vida, 3 estratégias para identificar prioridades e adaptar sua rotina e 1 mapa das áreas da vida para imprimir e escolher por onde começar.',
    chapters: [[24, 'Educação', 189], [25, 'Trabalho', 199], [26, 'Dinheiro', 213], [27, 'Relacionamentos', 221], [28, 'Riscos na condução de veículos, para a saúde e o estilo de vida', 230], [29, 'Outros problemas mentais e emocionais', 242], [30, 'Drogas e crime', 249]],
    cta: 'Explore as áreas da vida',
  },
];

export const STEPS_INTRO = [
  'O livro Vencendo o TDAH Adulto, de Russell A. Barkley e Christine M. Benton, apresenta um percurso que vai da avaliação às estratégias práticas para diferentes áreas da vida.',
  'Utilizei essa organização como referência para estruturar cinco caminhos de leitura.',
  'Você pode seguir a sequência completa ou começar pelo assunto que mais precisa compreender agora.',
];
