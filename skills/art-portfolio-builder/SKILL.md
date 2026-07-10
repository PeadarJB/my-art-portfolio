---
name: art-portfolio-builder
description: Build and maintain this repository as a modern art portfolio using Next.js, TypeScript, Zustand, design tokens, and performance-first image delivery. Use when implementing pages, components, content migration, theming, animation, image pipeline updates, or launch hardening in this project.
---

# Art Portfolio Builder

Follow the project contract in `AGENTS.md` and these docs before major work:
- `docs/PRODUCT_BRIEF.md`
- `docs/DESIGN_TOKENS.md`
- `docs/CONTENT_SCHEMA.md`
- `docs/PERFORMANCE_BUDGETS.md`
- `docs/ANIMATION_GUIDELINES.md`

## Workflow
1. Confirm affected area (UI, content, image pipeline, performance, deployment).
2. Read only the relevant docs for the task.
3. Implement smallest complete change.
4. Validate with lint/typecheck/build when available.
5. Report tradeoffs and next actions.

## Non-Negotiables
- Keep TypeScript strict and content schema typed with Zod.
- Keep theme styling token-driven.
- Keep gallery image delivery responsive and budget-aware.
- Respect reduced-motion and accessibility requirements.
- Never expose secrets or API keys.

## Migration Rule
- Legacy CRA source under `legacy-src/` is reference material.
- Do not delete legacy content until parity is confirmed.
