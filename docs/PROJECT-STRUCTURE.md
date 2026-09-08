# Estrutura do projeto

O projeto é propositalmente pequeno e não precisa de `src/`, framework ou build.

```text
metas-diarias/
├── index.html
├── style.css
├── script.js
├── ABRIR_APP.command
├── CRIAR_ATALHO_MAC.command
├── assets/
│   ├── icons/
│   └── screenshots/
├── docs/
│   ├── DESIGN.md
│   ├── INSTALL-MAC.md
│   ├── PROJECT-STRUCTURE.md
│   ├── PUBLISH-GITHUB.md
│   └── reference/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
├── LICENSE
└── .gitignore
```

## Arquivos principais

### `index.html`

Estrutura semântica da interface. Contém cabeçalho, formulário, lista, progresso, backup e histórico. Não contém dados pessoais nem lógica de persistência.

### `style.css`

Implementa a identidade **Lavender Girl**, estados, responsividade e acessibilidade visual.

### `script.js`

Cuida de estado, `localStorage`, migração dos dados antigos, metas, histórico, backup, restauração e eventos.

### `ABRIR_APP.command`

Launcher do macOS. Sobe um servidor Python somente em `127.0.0.1:8765` e abre o navegador.

### `CRIAR_ATALHO_MAC.command`

Cria um alias chamado **Metas Diárias** na Mesa, apontando para o launcher.

## `assets/`

Somente arquivos visuais do projeto. `screenshots/` recebe capturas reais da versão publicada; `icons/` fica reservado para ícones próprios. Não armazenar fontes ou segredos.

## `docs/`

Documentação longa que não precisa ocupar o README principal.

- `DESIGN.md`: design system Lavender Girl.
- `INSTALL-MAC.md`: instalação local e atalho.
- `PUBLISH-GITHUB.md`: publicação, Topics, Pages e Release.
- `reference/`: material de referência fornecido durante o redesign.

## `.github/`

Arquivos usados pelo GitHub para organizar contribuições: templates de Bug, Sugestão e Pull Request.

## Documentos da raiz

- `README.md`: apresentação pública e instruções rápidas.
- `CONTRIBUTING.md`: como contribuir.
- `SECURITY.md`: limites de segurança e privacidade.
- `CHANGELOG.md`: histórico de versões.
- `LICENSE`: licença MIT.
- `.gitignore`: arquivos locais que não devem entrar no Git.
