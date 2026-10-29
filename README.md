# Daniel Moose — project portfolio

Public portfolio at https://danielmoose-web.github.io/applied-ai/.

## Site structure

- `/`: employer-facing portfolio, experience, skills, contact, and resume.
- `/projects/applied-ai-lab/`: learning design and implementation case study.
- `/projects/ozark-putting-league/`: operational workflow and scoring case study.
- `/lab/`: Applied AI Lab landing, walkthrough, and about sections.
- `/lab/foundations/`: Foundations course.
- `/lab/studio/`: Studio entry; `Index.html` is the hub and Game 1, `Projects.html` contains Games 2–8, and `resources.html` contains the resource library.
- `/putting-league/`: app screenshots and guide, with fictional players.
- `/assets/`: shared styles and accessibility support. `portfolio.css` styles the portfolio and case studies; `project-pages.css` changes only project landing-page presentation.
- `/assets/portfolio/`: actual project screenshots and the public resume PDF.
- `/foundations/` and `/studio/`: compatibility redirects to the nested course paths. Redirects preserve query strings and fragments.

## GitHub Pages

Publish the main branch from the repository root. This static site has no build step. Keep filename case: Studio uses both `index.html` and `Index.html`.

The previous applied-ai-lab repository redirects visitors to the corresponding paths here after migration. Both sites use the same github.io origin, so existing browser storage remains available. Course storage keys are unchanged; use the existing download/restore tools to back up progress.

## Public data boundary

Foundations and Studio run in the browser. Learner progress stays in localStorage, and sample analytics are synthetic. Putting League contains only app screenshots and a guide; the operational app, player records, organizer tools, and production endpoints are not included.

## Checks

Run `npm ci`, install Playwright Chromium, then run `npm test`. Set CHROMIUM_PATH when using an existing browser executable. The tests cover five-stage scoring, validation, draft persistence, downloads, backups, attempt history, and nested project navigation.
The Putting League showcase pairs a phone screenshot slideshow with LeagueTV. One game selector switches both displays between Singles, Doubles, and Baseball. All scores are samples; baseball uses the app’s isolated exhibition player cards. No operational app code or endpoints are bundled.

## Portfolio content

Experience and skills use existing project copy and Daniel’s supplied application materials. The public resume is the existing Program Leadership and Change Enablement version; it is not a newly fabricated resume. No project adoption, financial, or efficiency metrics have been invented. Case studies identify synthetic reporting and sample league data. The original course HTML, scripts, localStorage keys, compatibility redirects, and nine slideshow images are unchanged.
