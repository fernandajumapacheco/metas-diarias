#!/bin/zsh

set -u
APP_DIR="${0:A:h}"
LAUNCHER="$APP_DIR/ABRIR_APP.command"

chmod +x "$LAUNCHER"

osascript - "$LAUNCHER" <<'APPLESCRIPT'
on run argv
  set launcherPath to item 1 of argv
  tell application "Finder"
    set launcherAlias to POSIX file launcherPath as alias
    try
      delete file "Metas Diárias" of desktop
    end try
    make new alias file at desktop to launcherAlias with properties {name:"Metas Diárias"}
    activate
  end tell
end run
APPLESCRIPT

osascript -e 'display notification "Atalho criado na Mesa." with title "Metas Diárias"'
