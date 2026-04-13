#!/bin/bash
# Sync VSP docs vault with project .claude/ directory
# Receives JSON on stdin from Claude Code PostToolUse hook

VAULT="/Users/huykieu/Documents/vsp-docs"
PROJECT="/Users/huykieu/Documents/vsp-ui"

# Get file path from stdin JSON
FILE_PATH=$(cat | jq -r '.tool_input.file_path // empty' 2>/dev/null)

# Only run if the edited file is in .claude/ or is CLAUDE.md
if [ -n "$FILE_PATH" ]; then
  case "$FILE_PATH" in
    */.claude/*|*/CLAUDE.md) ;;
    *) exit 0 ;;
  esac
fi

# 1. Sync directories
for dir in agents features workflows reports skills; do
  src="$PROJECT/.claude/$dir"
  dest="$VAULT/$dir"
  if [ -d "$src" ] && [ ! -e "$dest" ]; then
    ln -sf "$src" "$dest"
  fi
done

# 2. Sync knowledge base files
mkdir -p "$VAULT/knowledge"
for file in design-principles.md pipeline.md ref-patterns.md ux-knowledge.md edge-case-library.md; do
  src="$PROJECT/.claude/$file"
  dest="$VAULT/knowledge/$file"
  [ -f "$src" ] && [ ! -e "$dest" ] && ln -sf "$src" "$dest"
done
# Special rename
[ -f "$PROJECT/.claude/ds-roadmap-10-10.md" ] && [ ! -e "$VAULT/knowledge/ds-roadmap.md" ] && \
  ln -sf "$PROJECT/.claude/ds-roadmap-10-10.md" "$VAULT/knowledge/ds-roadmap.md"
[ -f "$PROJECT/CLAUDE.md" ] && [ ! -e "$VAULT/knowledge/CLAUDE.md" ] && \
  ln -sf "$PROJECT/CLAUDE.md" "$VAULT/knowledge/CLAUDE.md"

# 3. Sync Ref/
[ -d "$PROJECT/Ref" ] && [ ! -e "$VAULT/ref" ] && ln -sf "$PROJECT/Ref" "$VAULT/ref"

# 4. Detect new features/agents not in index
WARNINGS=""
if [ -f "$VAULT/features/index.md" ]; then
  for dir in "$PROJECT/.claude/features"/*/; do
    [ -d "$dir" ] || continue
    fname=$(basename "$dir")
    grep -q "$fname" "$VAULT/features/index.md" 2>/dev/null || \
      WARNINGS="${WARNINGS}New feature '${fname}' — not in vault index\n"
  done
fi
if [ -f "$VAULT/agents/index.md" ]; then
  for f in "$PROJECT/.claude/agents"/*.md; do
    [ -f "$f" ] || continue
    fname=$(basename "$f" .md)
    [ "$fname" = "index" ] && continue
    grep -q "$fname" "$VAULT/agents/index.md" 2>/dev/null || \
      WARNINGS="${WARNINGS}New agent '${fname}' — not in vault index\n"
  done
fi

if [ -n "$WARNINGS" ]; then
  echo -e "vault-sync warnings:\n$WARNINGS"
fi
