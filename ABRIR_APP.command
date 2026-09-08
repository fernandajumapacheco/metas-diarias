#!/bin/zsh

set -u
APP_DIR="${0:A:h}"
PORT="8765"
HOST="127.0.0.1"
URL="http://${HOST}:${PORT}"
LOG_FILE="/tmp/metas-diarias-servidor.log"

cd "$APP_DIR" || exit 1

if ! command -v python3 >/dev/null 2>&1; then
  osascript -e 'display alert "Python 3 não foi encontrado" message "Instale o Python 3 para abrir a versão local do Metas Diárias." as critical'
  exit 1
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  if curl -fsS "$URL" 2>/dev/null | grep -q "Metas Diárias para Meninas"; then
    open "$URL"
    exit 0
  fi
  osascript -e 'display alert "A porta 8765 já está em uso" message "Feche o outro servidor que está usando essa porta e tente novamente." as warning'
  exit 1
fi

nohup python3 -m http.server "$PORT" --bind "$HOST" --directory "$APP_DIR" >"$LOG_FILE" 2>&1 &
sleep 1

if curl -fsS "$URL" >/dev/null 2>&1; then
  open "$URL"
else
  osascript -e 'display alert "Não consegui abrir o Metas Diárias" message "Veja o arquivo /tmp/metas-diarias-servidor.log para detalhes." as critical'
  exit 1
fi
