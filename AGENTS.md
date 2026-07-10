# Project Agent Rules

## Mission
Rebuild and evolve this art portfolio as a fast, modern, high-fidelity website that feels colourful, psychedelic, and professional.

## Architecture Contract
- Keep framework as Next.js App Router + TypeScript (strict mode).
- Keep state management in Zustand for client-only UI state.
- Keep design tokens as CSS variables with primitive -> semantic -> component mapping.
- Keep content in typed files validated with Zod.
- Keep contact flow server-side or mailto-only without exposing secrets.

## Quality Rules
- Do not regress Core Web Vitals targets in `docs/PERFORMANCE_BUDGETS.md`.
- Use responsive image sizes and avoid rendering large variants in grids.
- Respect reduced-motion settings.
- Preserve keyboard accessibility for all interactive controls.

## Workflow Rules
- Read `docs/PRODUCT_BRIEF.md` before changing UI tone or layout direction.
- Read `docs/DESIGN_TOKENS.md` before adding new colors, spacing, or typography values.
- Read `docs/CONTENT_SCHEMA.md` before changing artwork/content structures.
- Keep edits incremental and compile-safe.
- Add brief rationale in PR/commit notes for major design or performance tradeoffs.

## Data and Security Rules
- Never commit secrets or API keys.
- Keep enquiry email as environment-configurable (`NEXT_PUBLIC_ENQUIRY_EMAIL` placeholder for now).
- Do not add client-side third-party scripts unless explicitly requested.

## Legacy Code Rule
- Treat `legacy-src/` as legacy CRA reference until migration is complete.
- Do not delete legacy files until content parity is validated.
