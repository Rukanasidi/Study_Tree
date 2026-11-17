# Phonics Play Tree

Phonics practice for learners who need repetition. Works offline. Progress and settings stay on the device.

## Run
`python3 -m http.server 8000`, then open http://localhost:8000 (the offline cache needs http, not file://).

## Structure
- `index.html` – the page shell (sidebar, top bar, content area).
- `css/base.css` – colour tokens and the activity components. `css/theme.css` – the layout and the Adult / Kids looks.
- `js/config.js` – app name, donate link, and the sidebar menu (`NAV`, `NAV_BOTTOM`).
- `js/curriculum.js` – every activity (`A`) and lesson (`G`). `js/activities.js` – the activity engines. `js/calendar.js` – January calendar, special days (`EV`), all-month events (`MONTH`) and which days link to a reading passage (`RDAY`). `js/reading-data.js` – the January reading passages (KS1, LKS2, UKS2); `js/reading.js` – the reading viewer.
- `js/nav.js` – router (`show`) and the topic page. `js/dashboard.js` – dashboard, My learning, My progress, Support.
- `js/progress.js` – what the learner has done (`PT`). `js/settings.js` – name, look, text size, speech speed, motion. `js/ui.js` – sidebar, top bar, search.
- `sw.js` + `manifest.json` – installable and offline. Change `V` in `sw.js` after every update.

## Adding a feature (for example Review, Placement check, Chat)
1. Write the page: `A.review=['Review',el=>{ el.innerHTML=... },'🔁','','page'];` (the last item `'page'` makes it full width with its own heading).
2. Add it to the sidebar: one line in `NAV` in `js/config.js` (icons are in `js/ui.js`).
3. Optional dashboard widget: write a function returning HTML and place it inside `dash()` in `js/dashboard.js`.
Learner data: use `PT` in `js/progress.js` (add a method there) so everything reads it from one place.
Add the new file to `index.html` and to the list in `sw.js`.

## Publish
GitHub Pages, Netlify or Cloudflare Pages (free, HTTPS). Donations: put a Ko-fi, Open Collective or Stripe Payment Link URL in `DONATE_URL` in `js/config.js`.

## Not built yet
Accounts and Log out (progress is per device), recorded audio instead of the browser voice, spaced-repetition Review, placement check, content moved to JSON, a strict Content-Security-Policy (remove inline onclick handlers in `js/activities.js` first).
