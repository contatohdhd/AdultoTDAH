# TDAH Adulto — Entenda. Aprenda. Gerencie.

Blog sobre TDAH na vida adulta: a landing oficial (Jornada TDAH), a home em 15 blocos (A–O), os cinco
passos com os 30 capítulos de referência, o questionário para a consulta e o showroom editorial
(três artigos demonstrativos com todos os componentes). Vite + React + TypeScript, saída estática.

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # → dist/
npm run deploy    # wrangler deploy de dist/ (rode npm run build antes)
```

**Publicado em:** https://tdah-adulto.contato-adulto-tdah.workers.dev — Cloudflare Workers Builds
(build `npm run build`, deploy `npx wrangler deploy`, branch `main`).

## Tokens — uma única fonte

`src/tokens.css` é a única origem de cor, tipografia, espaço, raio e sombra.

1. **Camada oficial**, copiada sem alterações (nomes e valores) do design system
   `design-source/prototypes/_ds/design-system-1a9a97b3…/_ds_bundle.css`. Inclui o tema claro e o escuro
   (`data-theme` no `<html>`) e a escala responsiva (≤ 734 px).
2. **Extensões `--tdh-*`**, só onde o sistema oficial não tem token: os grifos por fonte
   (amarelo = referência, laranja = experiência pessoal, azul = participação profissional), as
   categorias dos gráficos de área, a linha delimitadora dupla, o anel de foco e o alvo de toque de 44 px.
   Todas as combinações de texto passam no contraste AA nos dois temas.

Os componentes não usam valores hexadecimais: usam `var(--…)` pelos atalhos de `src/ui.tsx` (`C`, `SANS`,
`DISPLAY`, `MONO`). Quando o design system mudar, atualize a parte 1 de `tokens.css`.

## Rotas

| Caminho | Conteúdo |
|---|---|
| `/` | Abertura Jornada, linha emocional A–H, ciclos, Jornada v2 (03 farol · 04 livro · 05 autor · 06 sumário · 07 trechos · 08 dados · frase · 09 clube · fontes) e blocos A–N |
| `/passos`, `/passos/1…5` | Cinco passos e capítulos 1–30 |
| `/trajetoria`, `/sobre` | Narrativa completa, os dois gráficos e o bloco F |
| `/duvidas`, `/referencias`, `/livro`, `/fontes`, `/erros`, `/curadoria` | Blocos C, E, G, H, J e K completos |
| `/ferramentas` | Bloco I, ferramentas de leitura e acesso ao questionário |
| `/criterios` (`#responsabilidade`) | Bloco L: legenda das fontes e responsabilidade editorial |
| `/perguntas`, `/participe` | Bloco M (perguntas frequentes) e bloco N (sugestão de pauta) |
| `/questionarios`, `/questionarios/consulta` | Apresentação e fluxo completo do questionário (salvo no dispositivo) |
| `/artigos`, `/artigos/a|b|c` | Showroom: leitura e grifos, dados interativos, processos e ferramentas |
| `/inventario` | Componente → página → seção → comportamento, com a contagem de palavras |
| `/privacidade`, `/direitos`, `/contato` | Páginas provisórias, identificadas como tal |
| `/design/*` | Protótipos originais do Claude Design, para referência |

Os links antigos do showroom (`#/a`, `#/c/ferramentas`…) são redirecionados para as rotas novas.

## O que ainda depende de você

- as imagens da Jornada v2 em `public/jornada/` (veja `LEIA-ME.txt` lá dentro);

Os itens “Em preparação” vêm das notas entre colchetes da copy:

- dados ainda não verificados (como os 556%);
- a participação das profissionais;
- a edição e as páginas do livro na atribuição do questionário;
- o envio online de perguntas, que hoje copia o texto em vez de enviar;
- as fotografias dos marcos, que hoje são espaços reservados.

## Estrutura

- `src/tokens.css`, `src/base.css`: tokens e regras globais.
- `src/content/`: textos e dados (`home.ts` com os blocos A–N, `steps.ts`, `journey.ts`, `quiz.ts`, `articles.ts`).
- `src/components/`: páginas, cabeçalho, rodapé, gráficos, questionário e componentes dos artigos.
- `src/router.ts`: roteador mínimo com a History API.
- `design-source/`: protótipos, design system e briefings que deram origem ao projeto.
