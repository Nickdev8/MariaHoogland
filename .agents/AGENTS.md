# Frontend conventions

## Formatting

- Keep every Svelte, TypeScript, CSS, and JSON file formatted with the repository's Prettier configuration.
- Run `npm run format` from `app/` after frontend changes, then verify with `npm run lint`.
- Do not compress markup, script blocks, or Tailwind class lists into single long lines. Let Prettier wrap them so templates remain easy to review.

## Styling

- Use Tailwind utilities as the default styling mechanism for all frontend work.
- Use a component-scoped `<style>` block only when Tailwind cannot express a genuinely component-specific need, and keep it small.
- Reuse the existing theme colours and spacing system before adding arbitrary values.
- Prefer simple layouts, thin borders, restrained motion, and normal form controls. Avoid generic card grids, oversized radii, gradients, glass effects, and decorative UI elements.
