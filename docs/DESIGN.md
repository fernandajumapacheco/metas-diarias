# Design — Lavender Girl

## Direção

**Lavender Girl** é um planner digital delicado: muito branco, lavanda como voz principal e blush apenas nos momentos de recompensa. O objetivo é ser feminino e acolhedor sem infantilizar a interface.

## Paleta

| Uso | Hex |
|---|---|
| Lavanda principal | `#7A5BD0` |
| Lavanda hover | `#6A4CC0` |
| Lavanda clara | `#C4A7EE` |
| Bordas lavanda | `#E4D9F7` |
| Trilho / linhas | `#EDE6FA` |
| Fundo da tela | `#FBF8FF` |
| Fundo de concluído | `#F8F4FE` |
| Cards | `#FFFFFF` |
| Blush escuro | `#F0AEC8` |
| Blush claro | `#F7C8DA` |
| Texto sobre blush | `#5A2B44` |
| Texto principal | `#2E2540` |
| Texto secundário | `#8A7FA3` |
| Placeholder | `#A99EBE` |
| Rótulos | `#A08FC7` |
| Meta concluída | `#9D93B0` |
| Excluir hover | `#E2778E` |

## Tipografia

- **Instrument Serif**: títulos.
- **Karla**: restante da interface.
- Fallbacks existem para uso sem carregamento das fontes remotas.

Título: 40px no desktop e 26px no celular, line-height 1.05.

## Layout

- Desktop: coluna central de 520px, padding 34px.
- Celular (≤ 520px): padding 22px 18px.
- Ordem: cabeçalho → adicionar → progresso → metas → concluir dia → dados → histórico.

## Componentes

### Adicionar

Input de 52px, borda 1.5px, raio 16px. Botão lavanda de 52px, raio 16px. No celular, o botão vira um quadrado de 46px com `+`.

### Progresso

Contador de 13px e barra de 5px com preenchimento `linear-gradient(90deg,#C4A7EE,#7A5BD0)`.

### Meta pendente

Card branco, borda `#EDE6FA`, raio 14px, círculo de 22px com borda `#C4A7EE`.

### Meta concluída

Fundo `#F8F4FE`, círculo `#7A5BD0`, check branco e texto riscado em `#9D93B0`.

### Concluir o dia

Único botão rosa: degradê `#F7C8DA` → `#F0AEC8`, 54px, raio 18px.

### Seus dados

Área secundária, separada por borda tracejada, com links para salvar e restaurar backup.

### Histórico

Caixa branca com raio 16px. Cabeçalho clicável, título em Instrument Serif, seta que gira ao expandir.

## Movimento

- cards: 2px para a direita no hover;
- botões: 1px para cima no hover e 1px para baixo no active;
- nova meta: fade + slide 6px;
- check: pop curto + três `✦`;
- concluir dia: três `✦` de recompensa;
- transições entre 150 e 260ms;
- `prefers-reduced-motion` desativa movimento relevante.

## Acessibilidade

- foco visível com `#C4A7EE`;
- `aria-pressed` no controle da meta;
- `aria-label` no excluir;
- `aria-expanded` no histórico;
- contador e feedback com `aria-live`;
- alvos de toque de pelo menos 44px no celular;
- estado concluído não depende apenas de cor.

## Referências do handoff

Os prints fornecidos durante o redesign ficam em `docs/reference/` como documentação de processo. As capturas reais da implementação ficam em `assets/screenshots/`.
