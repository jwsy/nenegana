# Nenegana 🪿🎌

A kid-friendly, offline-capable PWA that teaches Japanese kana by letting kids “honk” their answers aloud.

## Table of Contents

    1.	Overview
    2.	Features
    3.	Live Demo / Screenshots
    4.	Getting Started
    5.	Project Structure
    6.	Configuration & Settings
    7.	Progressive Web App Details
    8.	Accessibility & Performance
    9.	Contributing
    10.	License
    11.	Acknowledgements

## Overview

Nenegana is a mobile-first quiz and practice game that helps children (~7 yrs) master hiragana and katakana.
It runs entirely in the browser, works offline, and relies on the Web Speech API so kids can speak each character’s reading instead of typing.

Why “Nene”?
The Hawaiian nēnē goose is our friendly mascot. He keeps things light, cheers correct answers with a chime, and never honks unsolicited advice.

## Features

Category Highlights
Gameplay Practice & Quiz modes, adjustable question count, 2 s countdown, auto-advance toggle
Speech Web Speech API (ja-JP) starts automatically when a character appears
UX Bright, child-friendly theme, subtle goose animations, no ads & no sign-in
Data Single-user progress stored in localStorage (resettable)
Offline Service-worker caches shell + kana JSON; installable on iOS/Android
A11y Focus management, ARIA labels, “prefers-reduced-motion” honored
Tech Vite + TypeScript, Tailwind, vanilla DOM API—no heavy framework

## Live Demo / Screenshots

Coming soon!
After the first public deployment you’ll be able to play right from GitHub Pages. In the meantime, peek at the /docs folder for mock-ups and design files.

## Getting Started

Prerequisites

Tool Version
Node.js ≥ 18
npm ≥ 9

Installation

git clone https://github.com/your-org/nenegana.git
cd nenegana
npm install

Development server

npm run dev

Opens http://localhost:5173 with hot-reload.

Lint & format

npm run lint # ESLint (Airbnb + TS)
npm run format # Prettier

Production build

npm run build # outputs to /dist
npm run preview # serve prod build locally

Deploying to GitHub Pages is automated via deploy.yml—push to main and voilà.

## Project Structure

nenegana/
├─ public/ # static assets (goose.png, icons, sounds)
├─ src/
│ ├─ data/ # kana.json
│ ├─ hooks/ # custom hooks (speech.ts)
│ ├─ quiz/ # QuizSession logic
│ ├─ router.ts # tiny hash router
│ ├─ views/ # HomeView, PracticeView, QuizView, SummaryView
│ ├─ App.ts # root orchestrator
│ └─ main.ts # entry point
├─ tailwind.config.js
├─ vite.config.ts
└─ ...

## Configuration & Settings

Open the gear icon on the Home screen to adjust:

Setting Values Notes
Kana type Hiragana / Katakana default: Hiragana
Consonant groups a, ka, sa, … multi-select
Questions per round 5 – 20 default: 5
Timer limit 1-5 s default: 2 s
Sound on/off affects correct-answer chime
Auto-advance on/off when off, “Next” button appears
Romaji (Practice) show/hide defaults to show

All preferences persist in localStorage under neneganaSettings.

## Progressive Web App Details

Item Value
manifest.webmanifest name: Neneganashort_name: Neneganadisplay: standaloneorientation: portrait
Service Worker Generated via vite-plugin-pwaCache-first strategy for shell assetsNetwork-first fallback for kana.json
Installability ✅ iOS Safari “Add to Home Screen”✅ Android Chrome “Install App”

When an updated service-worker is waiting, users are politely prompted to refresh.

## Accessibility & Performance

Targets: Lighthouse ≥ 90 for Performance, Accessibility, Best Practices, SEO.

Key measures
• Uses semantic HTML and labelled controls
• Focus trapped inside modals, restores on close
• Respects prefers-reduced-motion media query
• Lazy-loads non-critical images and preloads kana JSON

## Contributing

    1.	Fork the repo and create a feature branch:

git checkout -b feat/my-cool-thing

    2.	Follow the Conventional Commits spec: feat: add goose wink.
    3.	Run npm run lint && npm run test before opening a PR.
    4.	Submit pull request; CI must pass for review.

See CONTRIBUTING.md for the full guidelines, code-style rules, and issue templates.

## License

Apache 2.0 — see LICENSE for details.
Feel free to honk, remix, and share responsibly! 🛠️🪿

## Acknowledgements

    •	Nēnē Goose artwork by [Jason Yee with Gemini] (CC-BY-4.0)
    •	Built with ♥, TypeScript, and plenty of onomatopoeia.
    •	Special thanks to the Web Speech API for letting browsers do the talking.

Let’s get quack—er, honking! いただきます！
