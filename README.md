# Daniel Moose — project portfolio

A static portfolio with two independent projects: Applied AI Lab and Ozark Putting League.

- `/applied-ai-lab/`: minimal project introduction.
- `/applied-ai-lab/lab/`: full Applied AI Lab landing, walkthrough, and leadership/about sections.
- `/applied-ai-lab/foundations/` and `/applied-ai-lab/studio/`: existing learning activities. Course Home links return to `/lab/`.
- `/applied-ai-lab/putting-league/`: public demos and guide only, with fictional players and local interactions. No operational league application, admin tools, player records, or production endpoints are included.

Serve the entire repository root; the Lab landing uses relative sibling links to the existing assets and course directories. No build step or deployment configuration change is needed.

## Publish with GitHub Pages
1. Create a public GitHub repository (for example `applied-ai-lab`).
2. Upload `index.html` to the repository root.
3. Under Settings → Pages, choose Deploy from a branch, `main`, root (`/`).
4. Wait for GitHub to show the published URL; open it and test both desktop and mobile.

## Studio link
The Studio card opens the public browser-only frontend at `studio/`. The private Apps Script pilot and reporting credentials are not included.

## Portability
This is a single-file static site. It can be moved to another host or integrated into a personal portfolio without changing the course deployments.

## Scope
The existing Foundations website is linked but not modified. The Studio frontend is included; reporting backends are not deployed by this package.

## Public Studio frontend

`studio/Index.html` contains the Studio hub and Game 1 (The Reporting Rescue).
`studio/Projects.html` provides the independent workspaces for Games 2–8.
`studio/index.html` opens the hub when visiting `/studio/`.
The existing Google Sites Foundations course and its links are preserved.

Studio runs entirely in the browser. There is no build step, backend, reporting
submission, cloud synchronization, or AI API requirement. Progress stays in
localStorage; download a progress backup before clearing browser data or changing
browser/device. Restore that file to recover work. Demo analytics are synthetic;
“My saved attempts” shows only the current browser's Game 1 activity.

Run locally from the repository root:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

For GitHub Pages, deploy `main` from the repository root as described above.
The Studio entry path is `studio/`; relative links also support project Pages
paths. No private reporting workbook, Apps Script backend, or bundled Foundations
copy is needed. For a separate static host, publish the contents of `studio/`.
Preserve filename case, particularly `Index.html` and `Projects.html`.

### Browser regression checks

Node/npm and Playwright are needed only for tests, not to serve or deploy the site.

```bash
npm ci
npx playwright install chromium
npm test
```

The test defaults to `/usr/bin/chromium` on this cloud environment. For another
installation, set `CHROMIUM_PATH` to its Chromium executable. Tests use an ephemeral
local server and fresh browser storage; no real learner data or backend is used.
They cover Game 1's five stages and 100-point result, required-field validation,
draft persistence, CSV/receipt downloads, prompt copying, file backup recovery,
attempt history, local analytics, project navigation, desktop/mobile fit, and
absence of reporting requests.
