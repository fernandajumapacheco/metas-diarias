# Publicar no GitHub

## 1. Nome do projeto

Nome público: **Metas Diárias para Meninas**  
Nome recomendado do repositório: **`metas-diarias`**

Para renomear o repositório atual no GitHub:

1. Abra o repositório.
2. Vá em **Settings → General**.
3. Em **Repository name**, troque `meu-primeiro-projeto-github` por `metas-diarias`.
4. Confirme a alteração.

O GitHub normalmente redireciona o endereço antigo, mas clones locais devem atualizar o `origin` quando necessário.

## 2. Descrição pública

Use:

> Planner diário simples e delicado para organizar metas e acompanhar o progresso, feito com HTML, CSS e JavaScript puro.

## 3. Topics

Sugestão de Topics:

- `daily-planner`
- `daily-goals`
- `todo-list`
- `productivity`
- `planner`
- `html`
- `css`
- `javascript`
- `localstorage`
- `beginner-friendly`
- `open-source`
- `responsive-design`
- `accessibility`

Opcional, se fizer sentido para o posicionamento público: `women-in-tech`.

## 4. GitHub Pages

Como o projeto é estático:

1. **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Branch: `main`.
4. Pasta: `/root`.
5. Salve.

Depois de publicado, o GitHub mostrará o endereço final.

Lembrete: o `localStorage` do Pages é separado do `localStorage` do `127.0.0.1:8765`. Use backup/restauração para migrar dados entre eles.

## 5. Contribuições

Deixe **Issues** habilitadas. Os templates já estão em `.github/ISSUE_TEMPLATE/`.

Labels recomendadas:

- `good first issue`
- `help wanted`
- `bug`
- `enhancement`
- `documentation`
- `accessibility`

O `CONTRIBUTING.md` explica o fluxo de fork, branch e Pull Request.

## 6. Primeira Release

Tag: `v1.0.0`

Título:

> Metas Diárias para Meninas v1.0.0

Texto sugerido:

> Primeira versão pública do Metas Diárias para Meninas com a identidade Lavender Girl, salvamento automático no navegador, histórico diário, backup/restauração e layout responsivo.

Antes de publicar a Release, teste:

- adicionar, marcar, desmarcar e excluir;
- limpar concluídas;
- reload e reabertura;
- migração dos dados antigos;
- mudança de dia;
- concluir o dia;
- exportar e restaurar backup;
- arquivo de backup inválido;
- desktop e mobile;
- teclado e foco visível;
- console sem erros;
- ausência de segredos e dados pessoais.

## 7. Segurança antes do push

Confira com `git status` e confirme que não há:

- `.env`;
- tokens;
- senhas;
- certificados;
- arquivos pessoais;
- backups reais com suas metas;
- dados sensíveis.

O `.gitignore` cobre os arquivos locais mais comuns, mas ele não substitui a revisão antes do commit.
