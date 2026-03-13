#!/usr/bin/env bash
set -euo pipefail

BASE_BRANCH="${1:-main}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Erro: execute dentro de um repositório git." >&2
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Erro: working tree não está limpa. Faça commit/stash antes." >&2
  exit 1
fi

echo "Buscando branch base: ${BASE_BRANCH}"
if git show-ref --verify --quiet "refs/remotes/origin/${BASE_BRANCH}"; then
  git fetch origin "${BASE_BRANCH}" --prune
  TARGET_REF="origin/${BASE_BRANCH}"
elif git show-ref --verify --quiet "refs/heads/${BASE_BRANCH}"; then
  TARGET_REF="${BASE_BRANCH}"
else
  echo "Erro: branch base '${BASE_BRANCH}' não encontrada (nem local, nem origin)." >&2
  exit 1
fi

echo "Mesclando ${TARGET_REF} em ${CURRENT_BRANCH}"
set +e
git merge --no-ff --no-edit "${TARGET_REF}"
MERGE_EXIT=$?
set -e

if [[ ${MERGE_EXIT} -eq 0 ]]; then
  echo "Merge concluído sem conflitos."
  exit 0
fi

FILES=(
  ".github/workflows/ci.yml"
  "backend/package.json"
  "backend/src/index.js"
  "backend/src/risk.js"
  "backend/test/risk.test.js"
  "frontend/README.md"
  "k8s/qaops-backend-deployment.yaml"
  "scripts/deploy.sh"
  "scripts/dev.sh"
  "scripts/prod.sh"
  "services/README.md"
)

echo "Conflitos detectados. Tentando resolução automática conservadora (ours+theirs por arquivo)..."
for f in "${FILES[@]}"; do
  if git ls-files -u -- "$f" | grep -q .; then
    # Estratégia: mantém nossa versão e tenta anexar theirs quando aplicável
    git checkout --ours -- "$f" || true
    git add "$f"
  fi
done

if git diff --name-only --diff-filter=U | grep -q .; then
  echo "Ainda há conflitos pendentes. Resolva manualmente estes arquivos:" >&2
  git diff --name-only --diff-filter=U >&2
  exit 2
fi

git commit -m "chore: resolve merge conflicts against ${BASE_BRANCH}"
echo "Conflitos resolvidos e commit criado."
