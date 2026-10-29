# Daniel Moose — project portfolio

Public portfolio at https://danielmoose-web.github.io/applied-ai/.

## Site structure

- `/`: two-project portfolio homepage.
- `/lab/`: Applied AI Lab landing, walkthrough, and about sections.
- `/lab/foundations/`: Foundations course.
- `/lab/studio/`: Studio entry; `Index.html` is the hub and Game 1, `Projects.html` contains Games 2–8, and `resources.html` contains the resource library.
- `/putting-league/`: app screenshots and guide, with fictional players.
- `/assets/`: shared Lab styles and accessibility support.
- `/foundations/` and `/studio/`: compatibility redirects to the nested course paths. Redirects preserve query strings and fragments.

## GitHub Pages

Publish the main branch from the repository root. This static site has no build step. Keep filename case: Studio uses both `index.html` and `Index.html`.

The previous applied-ai-lab repository redirects visitors to the corresponding paths here after migration. Both sites use the same github.io origin, so existing browser storage remains available. Course storage keys are unchanged; use the existing download/restore tools to back up progress.

## Public data boundary

Foundations and Studio run in the browser. Learner progress stays in localStorage, and sample analytics are synthetic. Putting League contains only app screenshots and a guide; the operational app, player records, organizer tools, and production endpoints are not included.

## Checks

Run `npm ci`, install Playwright Chromium, then run `npm test`. Set CHROMIUM_PATH when using an existing browser executable. The tests cover five-stage scoring, validation, draft persistence, downloads, backups, attempt history, and nested project navigation.
