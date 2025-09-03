# Repository Guidelines

## Project Structure & Modules
- `src/app`: Next.js App Router (layouts, pages, `globals.css`).
- `src/components`: Reusable UI (`ui/`) and feature sections (`sections/`).
- `src/lib`: Utilities (`utils.ts`) and shared hooks (`lib/hooks`). Additional app hooks live in `src/hooks`.
- `public`: Static assets.  Place images, icons, and favicons here.
- `src/visual-edits`: Visual editing instrumentation (`VisualEditsMessenger.tsx`) and a custom Turbopack loader.

## Build, Test, and Development
- `npm run dev`: Start dev server with Turbopack at `http://localhost:3000`.
- `npm run build`: Production build.
- `npm start`: Run the production server.
- `npm run lint`: Lint with Next/ESLint rules.
Notes: Use one package manager consistently. This repo ships an `npm` lockfile; prefer `npm`.

## Coding Style & Naming
- Language: TypeScript with strict settings; path alias `@/*` maps to `src/*`.
- Linting: ESLint via `eslint.config.mjs` (extends Next). Fix issues before PRs.
- Conventions: PascalCase for React components (`MyCard.tsx`), camelCase for variables/functions, lowercase route segments in `src/app`.
- Styling: Tailwind CSS (see `src/app/globals.css`). Use `cn()` from `src/lib/utils.ts` to merge classes.

## Testing Guidelines
- Frameworks are not set up yet. Recommended: Vitest + React Testing Library.
- Location: `src/__tests__/` or co-locate as `Component.test.tsx`.
- Commands: add `"test"` and `"test:watch"` scripts when introducing tests.

## Commit & Pull Request Guidelines
- Commits: Follow Conventional Commits seen in history (e.g., `feat: ...`, `refactor: ...`).
- PRs: Include a clear description, linked issues, and screenshots/GIFs for UI changes.
- Checks: Run `npm run lint` and `npm run build` locally; ensure no type errors.

## Security & Configuration Tips
- Env: Use `.env.local` for secrets; never commit credentials.
- Images: `next.config.ts` allows remote images from any host—tighten `remotePatterns` for production.
- Visual edits: `VisualEditsMessenger` and the Turbopack loader in `src/visual-edits` support in-iframe tooling. Keep these imports intact unless intentionally removing the feature.

