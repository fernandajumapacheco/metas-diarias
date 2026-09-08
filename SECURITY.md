# Segurança

Metas Diárias para Meninas é um aplicativo estático que armazena os dados localmente no navegador.

## Dados

O aplicativo não envia metas para um servidor próprio. Os dados ficam no `localStorage` do navegador usado para abrir o app.

## Informações sensíveis

Não use a lista para armazenar:

- senhas;
- tokens;
- chaves privadas;
- credenciais;
- números completos de documentos;
- informações altamente sensíveis.

## Backups

Os backups são arquivos JSON. Guarde-os em local apropriado se suas metas contiverem informações pessoais.

A importação valida a estrutura do JSON antes de gravar os dados e os textos das metas são exibidos como texto, não como HTML executável.

## Relatar vulnerabilidade

Se encontrar uma vulnerabilidade, evite publicar detalhes exploráveis imediatamente em uma Issue pública.

Entre em contato com a mantenedora pelo perfil do GitHub ou utilize o canal de reporte de segurança do repositório, se ele estiver habilitado.
