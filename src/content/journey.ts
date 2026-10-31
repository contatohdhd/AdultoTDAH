// Official landing page data — from design-source/prototypes/Jornada TDAH.dc.html
// and design-source/briefs/jornada-graficos.md.

export interface Marco { id: string; v: number; simbolo: string; titulo: string; funcao: string; texto: string; foto?: string }

export const MARCOS: Marco[] = [
  { id: 'A', v: -1, simbolo: 'Escola', titulo: 'Infância, 7–8 anos', funcao: 'Primeiros sinais e dificuldades escolares', texto: 'Aos sete ou oito anos, eu já enfrentava dificuldades na escola e ouvia falar em DDA e hiperatividade, mas não compreendia muito bem o que isso significava.' },
  { id: 'B', v: -2, simbolo: 'Trabalho', titulo: 'Empregos e faculdades', funcao: 'Percepção dos prejuízos acumulados', texto: 'Na vida adulta comecei a perceber as consequências: empregos instáveis, oportunidades perdidas, faculdades que não concluí e dificuldades para manter uma trajetória profissional.' },
  { id: 'C', v: 0.6, simbolo: 'Avaliação', titulo: 'Psiquiatra e avaliação de três meses', funcao: 'Busca por respostas', texto: 'Procurei uma psiquiatra, que me encaminhou para uma avaliação neuropsicológica de três meses.' },
  { id: 'D', v: 2, simbolo: 'Tratamento', titulo: 'Laudo e início da medicação', funcao: 'Compreensão clínica e tratamento', texto: 'Depois do laudo e da comunicação entre as profissionais, comecei o tratamento medicamentoso.' },
  { id: 'E', v: -0.6, simbolo: 'Empresa', titulo: 'Encerramento da empresa', funcao: 'Consequências continuam', texto: 'O diagnóstico e a medicação não eliminaram automaticamente os problemas. Minha empresa acabou encerrando as atividades.' },
  { id: 'F', v: -3, simbolo: 'Acidente', titulo: 'Uber, acidente e perda do carro', funcao: 'Ponto de maior autocobrança', texto: 'Fui trabalhar como motorista de aplicativo, sofri um acidente e perdi o carro. Vieram a culpa, a autocobrança e a ansiedade.', foto: 'Fotografia do carro' },
  { id: 'G', v: 1.2, simbolo: 'Livro', titulo: 'Livro de Barkley e psicoeducação', funcao: 'Início da mudança de perspectiva', texto: 'Leitura de Russell Barkley, compreensão do TDAH e início de uma nova maneira de lidar com os próprios erros.' },
  { id: 'H', v: 2.8, simbolo: 'Canal', titulo: 'Estruturação do canal', funcao: 'Progresso, propósito e compartilhamento', texto: 'Hoje, uma das minhas conquistas é conseguir estruturar este canal e compartilhar o conhecimento que venho adquirindo.' },
];

export const VICIOSO = ['Dificuldades não compreendidas', 'Prejuízos e oportunidades perdidas', 'Culpa, ansiedade e autocobrança', 'Maior dificuldade para se reorganizar'];
export const VIRTUOSO = ['Psicoeducação e conhecimento', 'Compreensão das dificuldades', 'Menos culpa e mais responsabilidade informada', 'Estratégias, organização e acompanhamento', 'Progresso observável e novos aprendizados'];

/** Full narrative (brief §4), shown on /trajetoria. */
export const HISTORIA = [
  'Minha história com o TDAH começou muito antes do diagnóstico.',
  'Aos sete ou oito anos, eu já enfrentava dificuldades na escola e ouvia falar em DDA e hiperatividade, mas não compreendia muito bem o que isso significava.',
  'Foi na vida adulta que comecei a perceber as consequências. Empregos instáveis, oportunidades perdidas, faculdades que não concluí e dificuldades para manter uma trajetória profissional.',
  'Procurei uma psiquiatra, que me encaminhou para uma avaliação neuropsicológica de três meses. Depois do laudo e da comunicação entre as profissionais, comecei o tratamento medicamentoso.',
  'Mas o diagnóstico e a medicação não eliminaram automaticamente os problemas.',
  'Minha empresa acabou encerrando as atividades. Depois fui trabalhar como motorista de aplicativo, sofri um acidente e perdi o carro. Vieram a culpa, a autocobrança e a ansiedade.',
  'A mudança começou quando encontrei no livro de Russell Barkley e na psicoeducação uma maneira diferente de compreender minhas dificuldades. Passei a reconhecer melhor os problemas, a me culpar menos e a procurar estratégias para lidar com eles.',
  'Hoje, uma das minhas conquistas é conseguir estruturar este canal e compartilhar o conhecimento que venho adquirindo.',
  'Os dois gráficos mostram essa trajetória por perspectivas diferentes: o primeiro apresenta os altos e baixos da minha jornada; o segundo mostra como a falta de compreensão pode alimentar um ciclo de dificuldades e como o conhecimento, o acompanhamento e as estratégias podem ajudar a construir um ciclo de aprendizado.',
  'Meu objetivo não é mostrar que superei o TDAH. É mostrar como comecei a aprender a gerenciá-lo.',
];
