# Content Schema

## Source of Truth
- `lib/content-schema.ts`
- `content/artworks.ts`
- `content/site.ts`

## Artwork Shape
- `id: string`
- `title: string`
- `year: number`
- `medium: string`
- `dimensions: string`
- `image: { small, medium, large, alt, width, height }`

## Collection Shape
- `year: number`
- `works: Artwork[]`

## Validation
- All content is validated using Zod before rendering.

## Rules
- Keep IDs stable once published.
- Always provide meaningful alt text.
- Use medium variants for grid cards and reserve large variants for detail contexts.
- Do not introduce fields without updating schema and docs in the same change.
