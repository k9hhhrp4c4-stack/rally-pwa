# Rally — Multi-Sport Americano PWA

Mobile-first local-first tournament app for Tennis, Padel, and Pickleball. Indonesian is the default UI language.

## Current MVP
- Create tournaments with sport, Americano/Mexicano/Fixed Teams format labels, scoring mode, player list, courts, rounds, and point target.
- Americano schedule generation with multiple courts, rotating partners, repeat-penalty optimization, sit-outs, and transparent schedule notes.
- Live score entry, fixed-total-points validation, score confirmation, standings recalculation, match history/correction, CSV/JSON export, JSON backup import.
- IndexedDB persistence using Dexie, offline service-worker caching, PWA manifest, responsive layout, and light/dark themes.
- Pure scoring utilities for tennis game/deuce/tie-break transitions and pickleball side-out/rally scoring.

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Data is stored in this browser profile only.

## Verify and build

```bash
npm test
npm run build
npm run preview
```

## Deploy
Deploy the contents of `dist/` to any static HTTPS host (for example Netlify, Vercel, or GitHub Pages with the correct base path). PWA installation requires HTTPS in production. For iPhone, open the HTTPS URL in Safari, tap Share, then **Add to Home Screen**. For Android, open in Chrome and choose **Install app** or **Add to Home screen**.

## Important MVP limitations
- Mexicano is currently represented in setup but does not yet dynamically generate each next round from live standings.
- Fixed Teams currently shares the schedule/data shell; a dedicated team ranking view is not complete.
- Conventional Tennis/Padel and Pickleball scoring utilities are in progress and are not yet fully connected to the live scoreboard. Tennis utility currently covers game/deuce/advantage and basic set/tie-break transitions; it is not a complete rules-certified match engine.
- Mixed-doubles preference is stored but not enforced in the pairing optimizer.
- Scheduler optimizes pairings by repeat penalties for up to 12 active players; larger groups use a deterministic court grouping fallback. Rotation quality is heuristic, not guaranteed globally optimal.
- Score correction is available by reopening a completed result; this MVP does not yet maintain an immutable audit trail for corrections or full undo-by-event controls.
- The app is local-only and single-device. There is no cloud sync or multi-device collaboration.
- Offline support caches the application shell; external Google Fonts may not load offline.
