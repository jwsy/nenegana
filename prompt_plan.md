# Nenegana – Multi‑Layer Project Plan

Below you’ll find **four layers of planning, each more granular than the last.**

1. **High‑level blueprint** – what we’re building and why
2. **Milestone chunks (iteration 1)** – coarse, incremental deliverables
3. **Right‑sized steps (iteration 2)** – tasks that fit easily into a PR or pair‑programming session
4. **LLM prompts** – ready‑to‑paste instructions for a code‑generation model, one prompt per milestone, each building on the previous

---

## 1  High‑Level Blueprint

| Phase | Goal                             | Key Decisions / Best Practices                                                                   |
| ----: | -------------------------------- | ------------------------------------------------------------------------------------------------ |
|     0 | Project bootstrap & repo hygiene | ES‑modules, vanilla **TS** (no framework), Vite dev server, Prettier + ESLint, GitHub Actions CI |
|     1 | Static assets & manifest         | Store goose PNG/SVG, favicon, JSON kana list, `manifest.webmanifest`                             |
|     2 | Basic UI skeleton                | `index.html` shell, `App` root in `main.ts`, Tailwind for styling                                |
|     3 | Routing & state                  | Hash‑router (`#/home`, `#/practice`, …), global **AppState** in `localStorage`                   |
|     4 | Practice mode MVP                | Grid of kana cards → tap → romaji popup + goose wink animation                                   |
|     5 | Quiz mode MVP                    | Render 1 kana, manual “Next” button, score counter                                               |
|     6 | Speech recognition               | Web Speech API hook, debounce, confidence threshold, graceful rejection                          |
|     7 | Options panel & persistence      | Modal settings, validation, save to **AppState**                                                 |
|     8 | PWA offline & install            | Service‑worker via Vite‑PWA plugin, cache‑first strategy                                         |
|     9 | Polish & accessibility           | Focus rings, aria‑labels, reduced‑motion media query, i18n hooks                                 |
|    10 | Release & CI/CD                  | GitHub Pages deploy, version tag, CHANGELOG, Lighthouse score ≥ 90                               |

---

## 2  Milestone Chunks (iteration 1)

| #      | Milestone      | Deliverable                                                   |
| ------ | -------------- | ------------------------------------------------------------- |
| **M0** | Scaffold       | Repo w/ Vite + TypeScript + Tailwind + basic CI               |
| **M1** | Home screen    | Goose logo, two buttons, hash‑router initialized              |
| **M2** | Practice cards | Kana JSON loaded, responsive grid, romaji toggle              |
| **M3** | Quiz engine v1 | Random kana, manual next, in‑memory score                     |
| **M4** | Speech hook    | Auto‑start mic, capture result, compare string, stub feedback |
| **M5** | Quiz UX        | Timer, confetti on correct, summary screen                    |
| **M6** | Settings       | Options modal, `localStorage` persistence                     |
| **M7** | PWA            | Service worker, install banner, offline test passes           |
| **M8** | Polish         | Animations, sounds, accessibility audit                       |
| **M9** | Release        | GitHub Pages deployment & version bump                        |

---

## 3  Right‑Sized Steps (iteration 2)

Below, each milestone is decomposed into **3–5 atomic tasks**. None should take more than ≈1 hour of focused work.

<details>
<summary><strong>M0  Scaffold</strong></summary>

1. Initialise repo **nenegana** with `npm create vite@latest` → _vanilla‑ts_ template.
2. Add Tailwind (`npm i -D tailwindcss postcss autoprefixer` + scaffold config).
3. Add Prettier + ESLint configs and hook **lint** in CI (`.github/workflows/ci.yml`).
4. Commit goose PNG to `public/` and reference from `README.md`.
5. Verify `npm run dev` hot‑reloads.

</details>

<details>
<summary><strong>M1  Home screen</strong></summary>

1. Create `router.ts` – tiny hash‑router with `navigate("#/home")`.
2. Build **HomeView** component: goose `<img>` + two `<button>` elements.
3. Style portrait‑first layout with Tailwind; hide overflow on `body`.
4. Ensure navigation to `#/practice` and `#/quiz` changes `AppState.route`.

</details>

<details>
<summary><strong>M2  Practice cards</strong></summary>

1. Add `kana.json` (basic set only).
2. Create **PracticeView** – responsive CSS grid (≥ 3 cols @ 375 px).
3. Card click → modal overlay with romaji + goose wink (CSS keyframes).
4. Add romaji‑visibility toggle in top‑right corner (stateful).
5. Unit‑test `getSelectedKana()` util.

</details>

<details>
<summary><strong>M3  Quiz engine v1</strong></summary>

1. Create **QuizView** skeleton.
2. On mount, generate question array based on current settings.
3. Render first kana large‑font center, “Next” button.
4. Track correct / total in `QuizSession` object.
5. On finish → simple score alert.

</details>

<details>
<summary><strong>M4  Speech hook</strong></summary>

1. Abstract `useSpeechRecognition(lang: "ja-JP")` composable.
2. Auto‑start when kana renders; stop when result or timeout.
3. Compare normalised transcript to romaji mapping (basic mapping util).
4. Return `{status: "listening" | "success" | "fail"}`.
5. Fallback UI if `window.SpeechRecognition` undefined.

</details>

<details>
<summary><strong>M5  Quiz UX</strong></summary>

1. Add 2 s countdown bar (CSS width animation).
2. Trigger confetti canvas on correct; shake animation on wrong.
3. Summary screen component with missed kana list.
4. “Play again” resets state, navigates home.
5. Chime audio preload & play on success (respect sound toggle).

</details>

<details>
<summary><strong>M6  Settings</strong></summary>

1. Build **SettingsModal** (checkboxes, sliders) using Headless UI.
2. Validate & persist to `localStorage` under `neneganaSettings`.
3. Apply settings when generating quiz / practice views.
4. Add “Reset progress” button in modal footer.
5. Cypress test: settings persist after refresh.

</details>

<details>
<summary><strong>M7  PWA</strong></summary>

1. Install **vite-plugin-pwa**, generate `manifest.webmanifest`.
2. Add 512 × 512 goose icon, `theme-color` meta.
3. Service‑worker cache strategy: `index.html`, CSS, JS, kana JSON, images.
4. Test offline in Chrome DevTools.
5. Update README with install instructions (iOS Safari).

</details>

<details>
<summary><strong>M8  Polish</strong></summary>

1. `prefers-reduced-motion` media query → disable confetti animation.
2. Add `aria-label`s and focus management in modal.
3. Lighthouse performance & a11y passes ≥ 90.
4. i18n hook ready (stub for future English ↔ Japanese toggle).
5. Final visual QA on iPhone 15 Safari.

</details>

<details>
<summary><strong>M9  Release</strong></summary>

1. GitHub Pages action `deploy.yml` – build → `gh-pages` branch.
2. Tag **v1.0.0**, generate **CHANGELOG**.
3. Document contribution guide.
4. Archive design assets in `/docs`.
5. Celebrate 🍾.

</details>

---

## 4  Code‑Generation LLM Prompts

Copy‑paste each **Prompt N** into your favourite code‑gen model (e.g. GPT‑4o‑Code).
Each prompt is self‑contained, references prior artifacts, and results in integrated code.

### Prompt 0 — Scaffold

```text
You are setting up the Nenegana repo from scratch.

Tasks:
1. Initialise a Vite + TypeScript project named 'nenegana'.
2. Install and configure Tailwind CSS (JIT) with `@tailwind base/components/utilities`.
3. Add Prettier and ESLint (Airbnb + TypeScript) configs; extend package.json scripts with `lint` and `format`.
4. Commit a placeholder goose.png in `public/`, update `README.md` with a one-sentence project blurb.
5. Ensure `npm run dev` launches and hot-reloads.

Constraints:
- Use ES-modules everywhere.
- No framework; stick to vanilla TS and the DOM API.
Return: the full directory tree, plus the contents of `index.html`, `tailwind.config.js`, `vite.config.ts`, and sample `main.ts`.
```

---

### Prompt 1 — Home Screen

```text
The scaffold is merged on `main`.

Tasks:
1. Implement a minimal hash-router in `src/router.ts` exposing `navigate()` and `onRouteChange(cb)`.
2. Build `HomeView` in `src/views/HomeView.ts`:
   - Centered goose image (import from `/public/goose.png`).
   - Two large Tailwind buttons: “Practice” and “Quiz”.
3. Add `App` root component in `src/App.ts` that swaps views based on current route.
4. Style for portrait mobile (iPhone 15): 100 vh, no scroll, body background `bg-slate-50`.
5. Wire buttons to `navigate('#/practice')` and `navigate('#/quiz')`.

Return: modified/added files and a screenshot simulation (ASCII tree ok).
```

---

### Prompt 2 — Practice Cards

```text
Home screen is live.

Tasks:
1. Add `data/kana.json` containing the basic hiragana & katakana objects `{ char, romaji, type, group }`.
2. Create `PracticeView`:
   - Import kana JSON, filter by current settings (default: all hiragana).
   - Render responsive grid: min-width 110 px cards, Tailwind `aspect-w-1 aspect-h-1`.
   - On card click, show modal overlay with:
     * Large kana
     * Romaji reading
     * Goose wink CSS animation (scale +10%, rotate 2deg).
3. Add top-right romaji visibility toggle (persists in `AppState`).
4. Ensure ESC or outside-click closes modal.

Return: new/updated files + brief explanation of state flow.
```

---

### Prompt 3 — Quiz Engine v1

```text
Practice mode works.

Tasks:
1. Implement `QuizSession` class in `src/quiz/QuizSession.ts`:
   - Constructor accepts array of kana objects, shuffles, slices to desired length (5).
   - Methods: `current()`, `recordResult(isCorrect)`, `next()`, `isFinished()`.
2. Build `QuizView`:
   - On mount, create new `QuizSession`.
   - Show current kana large in center; below it a “Next” button (disabled until `recordResult` called).
   - Track correct/incorrect counts in memory.
   - When session finished, alert `X/5 correct` (placeholder).
3. Add navigation from summary back to `#/home`.

Return: diff or full files for new classes and views.
```

---

### Prompt 4 — Speech Hook

```text
Quiz engine skeleton is merged.

Tasks:
1. Add `useSpeechRecognition()` in `src/hooks/speech.ts` that:
   - Accepts `lang` (default `ja-JP`) and `onResult(transcript: string)`.
   - Starts mic automatically, stops on first interim final result or timeout (3 s).
   - Handles unsupported browsers with a reject callback.
2. Integrate hook into `QuizView`:
   - Start listening when a new kana appears.
   - Compare transcript to romaji via `normalise(transcript)` util (strip spaces, lowercase, kana synonyms allowed).
   - Call `recordResult(true|false)` then enable “Next”.
3. Provide visual listening state (animated mic icon).

Return: hook source, updated `QuizView`, and explain how errors are handled.
```

---

### Prompt 5 — Quiz UX Polish

```text
Basic speech grading works.

Tasks:
1. Replace alert summary with `SummaryView`:
   - Big score badge, list missed kana cards.
2. Add 2 s progress bar beneath kana; on expiry auto-records incorrect.
3. Play `public/chime.mp3` on correct (respect setting `soundEnabled`).
4. Confetti canvas animation on success using Canvas API; reduced-motion users skip.
5. Goose bob animation with speech bubble 「いってみて」 while listening.

Return: new components and any asset additions.
```

---

### Prompt 6 — Settings & Persistence

```text
Quiz UX polished.

Tasks:
1. Create `SettingsModal` reachable from home via gear icon.
2. Controls: kana type radio (hiragana/katakana), consonant group checkboxes, question count slider (5-20), timer slider (1-5 s), sound toggle, auto-advance toggle, romaji toggle.
3. Validate inputs and save to `localStorage` key `neneganaSettings`.
4. On app start, load settings into `AppState`; fall back to defaults if parse fails.
5. Add “Reset progress” button that clears `localStorage` and reloads.

Return: modal markup, settings util, and unit tests for persistence.
```

---

### Prompt 7 — PWA & Offline

```text
Settings are live.

Tasks:
1. Install and configure `vite-plugin-pwa`. Generate `manifest.webmanifest` with:
   - name/short_name “Nenegana”
   - icons (192 & 512) goose PNG
   - display: standalone, orientation: portrait
   - background/theme colors #f8fafc
2. Add service-worker:
   - Cache‐first for app shell (HTML/CSS/JS)
   - Network-first with fallback cache for `kana.json`
3. Trigger update flow: when new SW waiting, prompt user to refresh.
4. Verify offline mode in DevTools and iOS Safari.
5. Update README with install GIF.

Return: `vite.config.ts` diff and service-worker code.
```

---

### Prompt 8 — Accessibility & Polish

```text
PWA is functional.

Tasks:
1. Audit with Lighthouse; fix issues → score ≥ 90 on a11y & performance.
2. Add `aria-label` and `role` attributes for interactive elements.
3. Trap focus inside modals; return focus on close.
4. Add prefers-reduced-motion CSS to disable confetti & heavy animations.
5. Final visual tweaks: goose drop-shadow, button hover scale 102%.

Return: updated CSS, screenshots before/after, and Lighthouse report snippet.
```

---

### Prompt 9 — Release

```text
All features complete.

Tasks:
1. Add GitHub Action `deploy.yml` to build and push `dist/` to `gh-pages`.
2. Increment version to `v1.0.0`, create `CHANGELOG.md` using Conventional Commits.
3. Write CONTRIBUTING.md (branch naming, commit style, issue template).
4. Archive source goose artwork and design docs in `/docs`.
5. Verify deploy URL loads offline and descriptors are correct.

Return: workflow YAML, changelog excerpt, and confirmation of public URL.
```

---

You now have a **clear, multi‑pass plan** and a concrete sequence of prompts that safely guide a code‑generation LLM from zero to a fully wired Nenegana PWA, step by step.
