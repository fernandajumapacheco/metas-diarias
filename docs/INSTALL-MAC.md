# Instalar e abrir no Mac

O Metas Diárias pode ser usado pelo navegador ou como uma pequena ferramenta local.

## Opção 1 — usar pelo GitHub Pages

Depois que o GitHub Pages estiver ativado, basta abrir o endereço publicado no navegador.

## Opção 2 — usar localmente

1. No GitHub, clique em **Code → Download ZIP**.
2. Extraia o ZIP em uma pasta que você pretende manter.
3. Abra o Terminal nessa pasta e, apenas na primeira vez, rode:

```bash
chmod +x ABRIR_APP.command CRIAR_ATALHO_MAC.command
```

4. Dê dois cliques em `ABRIR_APP.command`.
5. O navegador abrirá `http://127.0.0.1:8765`.

O launcher inicia um servidor Python limitado ao próprio computador. Ele **não** usa `0.0.0.0`.

## Criar um atalho na Mesa automaticamente

Depois de tornar os arquivos executáveis, dê dois cliques em:

```text
CRIAR_ATALHO_MAC.command
```

Ele cria um alias chamado **Metas Diárias** na Mesa apontando para o launcher dentro da pasta do projeto.

> Não mova apenas o launcher para longe do projeto. O launcher precisa continuar junto de `index.html`, `style.css` e `script.js`. O alias pode ficar onde você quiser.

## Criar o alias manualmente

No Finder:

1. selecione `ABRIR_APP.command`;
2. menu **Arquivo → Criar Alias**;
3. mova o alias para a Mesa;
4. renomeie para **Metas Diárias**.

## Colocar no Dock

A forma mais simples é criar um pequeno aplicativo no **Automator**:

1. Abra o Automator.
2. Escolha **Aplicativo**.
3. Adicione a ação **Executar AppleScript**.
4. Use um script que abra o `ABRIR_APP.command` da pasta onde você decidiu manter o projeto.
5. Salve como **Metas Diárias.app** em Aplicativos ou na sua pasta pessoal.
6. Arraste o app para o Dock.

Como o caminho depende de onde cada pessoa guardou o projeto, ele não é gravado no repositório.

## Onde os dados ficam

As metas são salvas automaticamente no `localStorage` do navegador para o endereço:

```text
http://127.0.0.1:8765
```

Você **não precisa exportar e importar todo dia**.

Faça backup quando quiser uma cópia de segurança ou quando for trocar de computador, navegador ou endereço de acesso.

## Localhost e GitHub Pages não compartilham os mesmos dados

O navegador trata estes endereços como lugares diferentes:

```text
http://127.0.0.1:8765
https://seu-usuario.github.io/seu-repositorio/
```

Para levar as metas de um para o outro:

1. clique em **Salvar backup** no ambiente antigo;
2. abra o novo ambiente;
3. clique em **Restaurar backup** e escolha o JSON.
