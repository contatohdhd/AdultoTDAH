// Questionnaire statements — adapted from Vencendo o TDAH adulto (Barkley & Benton).
// Ported verbatim from design-source/prototypes/TDH Questionario v3.dc.html.

export const QUIZ_AREAS = [
  {
    key: '1', name: 'Tempo, planejamento e objetivos', items: [
      'Adio ou evito fazer as coisas até o último minuto.', 'Tenho pouca noção de tempo.', 'Desperdiço ou administro mal meu tempo.',
      'Não estou preparado para o trabalho ou para as tarefas atribuídas a mim.', 'Falho no cumprimento dos prazos das tarefas.',
      'Tenho dificuldade para planejar antecipadamente ou me preparar para eventos futuros.', 'Esqueço de fazer as coisas que deveria.',
      'Não consigo cumprir as metas que estabeleci para mim mesmo.', 'Chego atrasado ao trabalho ou aos compromissos.',
      'Não consigo manter em mente as coisas que preciso lembrar de fazer.', 'Tenho dificuldade para me concentrar no propósito ou no objetivo das minhas atividades.',
      'Acho difícil acompanhar várias atividades ao mesmo tempo.', 'Pareço não conseguir fazer as coisas, a menos que haja um prazo final imediato.',
      'Tenho dificuldade para pensar em quanto tempo vou demorar para fazer algo ou chegar a algum lugar.', 'Tenho dificuldade para me motivar a começar a trabalhar.',
      'Tenho dificuldade para me motivar a persistir em meu trabalho até realizá-lo.', 'Não sou motivado a me preparar antecipadamente para as coisas que sei que deveria fazer.',
      'Tenho dificuldade para terminar uma atividade antes de iniciar outra.', 'Tenho dificuldade para fazer o que digo a mim mesmo para fazer.',
      'Tenho dificuldade para cumprir promessas ou compromissos que posso ter firmado com outras pessoas.', 'Não tenho muita autodisciplina.',
      'Tenho dificuldade para organizar ou realizar meu trabalho por prioridade de importância; não consigo “priorizar” bem.', 'Tenho dificuldade para iniciar ou dar continuidade às coisas que preciso fazer.',
    ],
  },
  {
    key: '2', name: 'Organização, resolução de problemas e memória de trabalho', items: [
      'Não consigo focar minha atenção em tarefas ou trabalho tão bem quanto nos outros.', 'Tenho dificuldade com a aritmética mental.',
      'Não consigo lembrar do que ouvi ou li anteriormente.', 'Tenho dificuldade para organizar meus pensamentos ou pensar com clareza.',
      'Esqueço o ponto principal que estava tentando abordar ao conversar com outras pessoas.',
      'Quando me mostram algo complicado de fazer, não consigo manter as informações em mente para imitar ou fazê-lo corretamente.',
      'Não gosto de trabalhos ou atividades escolares nos quais eu precise pensar mais do que o habitual.',
    ],
  },
];

export const QUIZ_FLAT = QUIZ_AREAS.flatMap((a, ai) =>
  a.items.map((text, i) => ({ key: a.key + String.fromCharCode(65 + i), id: String.fromCharCode(65 + i), text, ai, i, total: a.items.length })),
);

export const QUIZ_ATTRIBUTION = 'Conteúdo adaptado, com autorização, de Vencendo o TDAH adulto, de Russell A. Barkley e Christine M. Benton, [edição, editora, ano e páginas].';
export const QUIZ_DISCLAIMER = 'Interface desenvolvida pelo TDAH Adulto. Este recurso organiza relatos pessoais; não fornece diagnóstico nem classificação de gravidade.';
