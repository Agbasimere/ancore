# Git Hooks (Husky)

This directory contains Git hooks managed by [Husky](https://typicode.github.io/husky/).

## Hooks Overview

### `pre-commit`

Runs **before every commit** to ensure code quality:

- Lints and formats only staged files using `lint-staged`
- Fixes auto-fixable issues automatically
- Fast execution (only checks changed files)

**What it checks:**

- ESLint for TypeScript/JavaScript files
- Prettier formatting for all files

### `pre-push`

Runs **before pushing to remote** to prevent CI failures:

1. **Build**: Runs `pnpm build` to ensure all packages compile
2. **Test**: Runs `pnpm test` to ensure all tests pass
3. **Lint**: Runs `pnpm lint` to catch any remaining lint issues
4. **Format Check**: Runs `pnpm format:check` to ensure formatting

**Why pre-push?**

- Catches errors before they hit CI
- Saves CI minutes and time
- Prevents broken commits from reaching remote

## Skipping Hooks

### Skip pre-commit (not recommended):

```bash
git commit --no-verify
```

### Skip pre-push (use sparingly):

```bash
git push --no-verify
```

## Configuration

- Hook scripts: `.husky/pre-commit`, `.husky/pre-push`
- lint-staged config: `package.json` → `lint-staged` field
- Installed automatically via `pnpm prepare` (runs after `pnpm install`)
