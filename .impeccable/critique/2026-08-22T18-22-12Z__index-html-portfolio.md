---
target: "index.html#portfolio"
total_score: 19
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 4
timestamp: 2026-08-22T18-22-12Z
slug: index-html-portfolio
---
Method: dual-agent (A: design review · B: evidência determinística)
Modo da superfície: Experience. Heurística 10 marcada n/a.

## Design Health Score — 19/36

| # | Heurística | Nota | Achado |
|---|---|---|---|
| 1 | Visibilidade do estado | 2 | Nada indicava quais cards eram clicáveis nem quais projetos tinham site no ar. |
| 2 | Sistema ↔ mundo real | 3 | Card 4 chamado "App Mobile" (categoria, não nome); "Minha Cripto" no subtítulo. |
| 3 | Controle e liberdade | 3 | Escape/backdrop/close/retorno de foco OK; faltava focus trap. |
| 4 | Consistência | 2 | `.tech-badges` existe na página, mas o modal lista stack como texto itálico. |
| 5 | Prevenção de erro | 2 | Kinoplex com os dois links `#` abria modal com área de ações vazia. |
| 6 | Reconhecer vs. lembrar | 1 | Título e resumo só no `:hover`; em toque a seção não tinha palavra nenhuma. |
| 7 | Flexibilidade | 2 | Nenhum caminho ao site no ar com menos de 2 cliques; sem navegação entre projetos. |
| 8 | Estética/minimalismo | 2 | Grade assimétrica boa, mas 5 assets em escalas de conteúdo diferentes. |
| 9 | Recuperação de erro | 2 | Projeto sem links falhava em silêncio. |
| 10 | Ajuda/documentação | n/a | Grade de 5 projetos não pede documentação. |

## Veredito de especificidade

Template. Removidas as imagens e a copy, sobra o bloco "portfolio" mais clonado da década.
Única decisão autoral: a grade de 6 colunas com dois destaques em span 3.
O Perseus tem um teclado como mapa estelar (brilho = domínio da tecla) e a seção comunicava zero disso.

Varredura determinística: detector saiu `[]` exit 0, mas em modo DEGRADED — sem os parsers,
`detect-html.mjs` retorna antes de `collectStaticCssText`, então `style.css` nunca foi lido e
as 12 regras de estilo computado foram puladas. `[]` é undercount, não aprovação.

## Números medidos (agente B)

- Contraste: 24 elementos, nenhuma falha. Pior caso `.skill-card p` = 4.57:1 (piso 4.5).
  `.portfolio-overlay h3` = 3.74:1 sobre região clara, passa só como texto grande.
- Overflow horizontal: 0 em repouso de 1896 a 360. +16px transitório por ~0,7s a ≤768px,
  causado por `slideInRight` (`translateX(32px)`), escondido pelo `overflow-x: hidden` do body.
- Alvos de toque: 6 links de nav a 24,8px de altura, 4 com menos de 44px de largura.
  Botão de fechar 30,6 × 32.
- Texto <14px: cert-year 11,52 · cert-verify 12,48 · cert-issuer 13,12 · tech-badges 13,6.
- A 1000px o Kinoplex renderizava 936×300 — 2,06× os irmãos — por `:last-child` (0,2,0)
  vencer `.portfolio-item` (0,1,0). Item mais fraco promovido a banner.

## Funcionando bem

1. Grade assimétrica de 6 colunas com degrau de altura 420/330, fechando as linhas sem órfão.
2. Trabalho de teclado e `prefers-reduced-motion` acima da média da categoria.
3. Copy do modal nomeia decisão técnica real (motor TS puro, validação de keystroke no servidor).

## Problemas prioritários

- [P0] Sem palavra alguma em toque — nenhum `@media (hover: hover)`. RESOLVIDO: legenda permanente.
- [P1] Status de live/código invisível antes do clique. RESOLVIDO: pílula de status no card.
- [P1] Modal do Kinoplex sem afordância nenhuma. RESOLVIDO: nota explicativa.
- [P1] Hierarquia invertida a ≤1100px. RESOLVIDO: destaques passam a ocupar a linha inteira.
- [P1] Dois cards não mostram o trabalho (rafa4.webp é foto de monitores; cinema.webp é logo).
  EM ABERTO — precisa de captura real dos dois projetos.
- [P2] Sem focus trap no modal. RESOLVIDO: trap + `inert` no resto do documento.
- [P3] Âncora escondida atrás da nav fixa. RESOLVIDO: `scroll-margin-top`.

## Personas

Alex (impaciente): todo demo custa 2 cliques; sem navegação entre projetos dentro do modal;
sem stack escaneável no card. Parcialmente resolvido (tags no hover, status no card).

Sam (leitor de tela + teclado): nome acessível repetido 3× (alt + h3 + p), nada anunciava
diálogo, sem focus trap. RESOLVIDO: `alt=""` nas imagens de card, `aria-haspopup="dialog"`,
foco no título ao abrir, trap, `inert`.

## Em aberto

- Capturas reais de RaizTech e Kinoplex.
- Stack no modal ainda é texto itálico em vez de reusar `.tech-badges`.
- Sem navegação prev/next entre projetos dentro do modal.
- "App Mobile" ainda é categoria, não nome.
