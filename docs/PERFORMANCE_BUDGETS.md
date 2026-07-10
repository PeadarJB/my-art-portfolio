# Performance Budgets

## Core Web Vitals Targets (mobile p75)
- LCP <= 2.5s
- INP <= 200ms
- CLS <= 0.1

## Delivery Budgets
- Initial route JS: keep minimal; defer non-critical client components.
- Gallery cards: use responsive image sizes, avoid loading large assets in lists.
- Above-the-fold image: only one priority image per route when needed.

## Asset Rules
- Prefer AVIF/WebP output.
- Set explicit image dimensions to prevent layout shift.
- Keep animation GPU-friendly (transform/opacity where possible).

## Tooling
- Lighthouse checks before release.
- Track payload impact for every major media/content change.
