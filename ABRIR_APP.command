#!/bin/zsh

cd "${0:A:h}" || exit 1

if ! lsof -iTCP:8765 -sTCP:LISTEN >/dev/null 2>&1; then
  python3 -m http.server 8765 > /tmp/metas-fernanda-servidor.log 2>&1 &
  sleep 1
fi

open "http://localhost:8765"
