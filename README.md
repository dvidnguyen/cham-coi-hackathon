# Chạm Cội — Care to Belong

> _"From caring for seniors → to empowering seniors to care, teach, and inspire others."_

Chạm Cội is a digital platform that connects elderly **Senior Advisors** — retired artisans, teachers, historians, and experienced professionals — with **university students** seeking real-life mentorship and cultural knowledge. Universities, businesses, and families can sponsor or book sessions; the platform sources, vets, and schedules Senior Advisors so their knowledge keeps a place in society — and so they earn an income for sharing it.

This repository contains the web application for the project (currently in early/MVP scaffold stage — see [Project Status](#project-status) below).

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Who It's For](#who-its-for)
- [Features](#features)
- [Project Status](#project-status)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Running in the Cloud](#running-in-the-cloud)
- [User Guide](#user-guide)
- [5-Year Roadmap](#5-year-roadmap)
- [Risk Management](#risk-management)
- [Contributing](#contributing)
- [License](#license)

---

## Problem Statement

Ho Chi Minh City has **1.3M+** elderly residents, and Vietnam's population is aging rapidly toward a pattern of "independent aging":

| Stat | Meaning                                                                             |
| ---- | ----------------------------------------------------------------------------------- |
| 35%  | of elderly are still working, but often in roles that underuse their real expertise |
| 34%  | of elderly do not live with their children                                          |
| 60%  | of elderly report feeling they have "no one to share with"                          |

At the same time, traditional knowledge, craftsmanship, and life experience are being lost between generations, while university students (18–24) say they want mentorship and cultural understanding that goes beyond what they get from textbooks — but lack access to real-life mentors.

**How might we help the elderly regain a meaningful social role and a sense of belonging, while giving young people access to real mentorship?**

Existing solutions each solve part of the problem but leave a gap:

| Existing Solution                | Strength                           | Limitation                                                  |
| -------------------------------- | ---------------------------------- | ----------------------------------------------------------- |
| Senior clubs / community centers | Reduce loneliness                  | Connection stays within the same age group                  |
| Elder care centers               | Provide daily/professional support | Position seniors as care _recipients_, not contributors     |
| Part-time jobs for seniors       | Generate income                    | Often low-skilled, no security/contract, underuse expertise |
| Volunteer programs               | Create purpose                     | Usually unpaid and hard to sustain                          |

No existing solution systematically connects elderly knowledge-holders with younger generations while creating **both** social belonging **and** sustainable income.

## Solution Overview

Chạm Cội is that missing layer: a booking and matching platform where a **payer** (university, business, or family) funds a session, the platform **sources and vets** a Senior Advisor whose expertise fits the request, and the platform **schedules and supports** a workshop or mentorship session between the Advisor and one or more students.

Core loop:

```
Senior Advisor profile  →  Match to student/topic request  →  Scheduled workshop
        ↓                                                            ↓
   Recognition, income                                   Knowledge transfer for student
```

The long-term vision (see [roadmap](#5-year-roadmap)) extends this into a permanent digital knowledge repository and AI-assisted matching/scheduling, so an Advisor's knowledge keeps generating value (and income) long after any single session.

## Who It's For

**Senior Advisors** — Retired artisans, teachers, historians, and other experienced seniors aged 55–75.

- _Pain:_ Rich experience, but limited access to younger generations.
- _Want:_ Stay socially valuable, pass down knowledge, be recognized and respected, earn flexible income.
- _Quote:_ "I still have many things worth sharing."

**Students** — University students, 18–24, digital-native and experience-seeking.

- _Pain:_ Want meaningful learning, but lack access to real-life mentors.
- _Want:_ Learn from real stories, gain practical life experience, understand culture beyond textbooks, meet inspiring mentors.
- _Quote:_ "I want to learn from real experiences, not just textbooks."

**Partners** — Universities, businesses (CSR budgets), and families who book/sponsor sessions on behalf of either side.

## Features

### Current (this repo, MVP scaffold)

- [x] Project scaffold (routing, layout, base styling) ready for feature build-out
- [x] Landing page shell ("About Us" / mission framing)

> Most product features below are **planned**, not yet implemented in this repo. They're listed here so the codebase's structure (routes, layout, types) can be built against them from the start.

### Phase 1 — Testing (Year 1)

- [ ] Advisor directory / public profile pages
- [ ] Family-assisted registration form (low digital literacy is a known onboarding barrier)
- [x] Workshop calendar & booking flow
- [x] Transparent policies page (trust & safety, to address fear of online scams)
- [x] Gallery / social recognition page for Advisors

### Phase 2 — Acceleration (Year 2–3)

- [ ] University/business partnership portal
- [ ] Advisor story promotion (impact stories, blog)
- [ ] Video/audio recording & documentation of workshop sessions

### Phase 3 — Legacy (Year 4–5)

- [ ] Permanent digital knowledge repository for Advisors
- [ ] AI matching engine (Advisor expertise ↔ student/topic interest)
- [ ] AI-generated session prep & summaries
- [ ] AI models trained on Advisor voice/lecture samples ("AI courses")
- [ ] Automated passive revenue-sharing system for Advisors

## Project Status

This repository is at the **scaffold stage**: a working dev environment with routing/layout/styling set up, but no booking, matching, scheduling, or auth logic yet. Treat the structure below as the skeleton the Phase 1 features get built into — `src/pages` and `src/router` are where new feature pages and routes should be added.

## Tech Stack & Architecture

| Layer                          | Choice                                   |
| ------------------------------ | ---------------------------------------- |
| Framework                      | React 19 + TypeScript                    |
| Build tool / dev server        | Vite                                     |
| Styling                        | TailwindCSS v4 (via `@tailwindcss/vite`) |
| Routing                        | React Router v7                          |
| Package manager                | pnpm                                     |
| Backend (planned)              | Not yet implemented — see note below     |
| AI services (Phase 3, planned) | Not yet implemented — see note below     |

**Current architecture** is a frontend-only single-page app:

```
src/
├── layouts/      # MainLayout: header/footer wrapper + <Outlet /> for routed pages
├── pages/        # Route-level views (Home, NotFound, ...future feature pages)
├── router/       # Central route config (src/router/index.tsx)
├── index.css     # TailwindCSS entry
└── main.tsx      # App entry point
```

- New feature routes are added as children of `MainLayout` in `src/router/index.tsx`.
- The `@/` import alias points to `src/`.

**Planned architecture (Phase 1+)** once backend features are added:

```
Frontend (this repo)  →  Backend API (auth, advisors, bookings, scheduling)
                              ↓
                    Database (advisor/student/session records)
                              ↓ (Phase 3)
                    AI matching/scheduling service  +  Media storage (recordings)
```

A managed backend (e.g., Supabase or Firebase) is a reasonable first choice for Phase 1 to avoid building auth/DB infrastructure from scratch; a dedicated API layer can replace it later if needed.

Reference `vite.config.ts` setup for the Tailwind v4 plugin (already present in this repo):

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

## Prerequisites

- **Node.js** ≥ 20.x
- **pnpm** ≥ 9.x (`npm install -g pnpm` if you don't have it)
- **Git**

## Installation

```bash
git clone https://github.com/dvidnguyen/cham-coi-hackathon.git
cd cham-coi-hackathon
pnpm install
```

- Only variables prefixed `VITE_` are exposed to the browser bundle — anything without that prefix stays server-side only.
- **Never** put real secrets (AI API keys, database credentials) behind a `VITE_` prefix — they would ship to every visitor's browser.

## Running Locally

```bash
pnpm dev          # starts the dev server at http://localhost:5173
```

Other useful commands:

```bash
pnpm build        # type-check (tsc) + production build
pnpm preview       # preview the production build locally
pnpm typecheck     # type-check only, no build output
```

## Running in the Cloud

**Quick cloud dev environment** (no local setup):

- Open the repo in [GitHub Codespaces](https://github.com/features/codespaces) → run `pnpm install && pnpm dev` in the terminal → forward port `5173`.
- Or import the repo into [StackBlitz](https://stackblitz.com/) for an instant in-browser dev environment.

**Production deployment** (this is a static Vite SPA, so any static host works):

_Vercel_

1. Import the GitHub repo in the Vercel dashboard.
2. Framework preset: **Vite**.
3. Build command: `pnpm build` — Output directory: `dist`.
4. Add environment variables (mirroring `.env.example`) under Project Settings → Environment Variables.
5. Deploy.

_Netlify_

1. Import the GitHub repo.
2. Build command: `pnpm build` — Publish directory: `dist`.
3. Add environment variables under Site settings → Environment variables.
4. Deploy.

Once a backend (Phase 1+) is added, it will need its own deploy target (e.g., a managed backend like Supabase, or a separate API service on Render/Fly.io) — this section should be extended at that point.

## User Guide

**As a Supporter of a Senior Advisor**

1. Visit the site and read the About/mission page to understand the program.
2. Start registration — a family-assisted form is available if you'd rather have a relative help fill it in.
3. Complete your profile: area of expertise, short bio, availability.
4. Wait for verification (the platform vets Advisors before they're listed).
5. Get matched to a request, or appear in the workshop calendar for students/partners to book.
6. Host your session (in person or online).
7. Receive payment and recognition (your story can be featured on the Gallery page).

**As a Student**

1. Browse the Advisor directory or workshop calendar.
2. Filter by topic or area of expertise.
3. Book a session or workshop.
4. Attend, and leave feedback afterward — this feeds the platform's quality/trust signals.

**As a University, Business, or Family (Partner)**

1. Reach out to set up a partnership or sponsorship.
2. Book/fund workshops for a group of students.
3. Access impact reporting (sessions held, students reached, satisfaction rate) for CSR or program reporting.

## 5-Year Roadmap

|                    | Year 1                                                           | Year 2–3                                                                                      | Year 4–5                                                                                                             |
| ------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Objective**      | Validate the business model & build trust                        | Scale up & digitalize brand positioning                                                       | AI legacy system & generate passive income                                                                           |
| **Plans**          | Launch brand website, recruit Advisors, pilot offline workshops  | Sign partnerships with target universities, promote Advisor stories, record workshop sessions | Build a permanent knowledge repository, train AI models on voice/lecture samples, activate automated revenue-sharing |
| **Target metrics** | 20+ Advisors, 5+ workshops, 2 university partners, 100+ students | 10+ universities, 1,000+ learners, 100+ workshops, 80% satisfaction                           | 500+ recording hours, AI courses live, stable passive cash flow                                                      |

## Risk Management

| Risk                                              | Mitigation                                                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Difficulty recruiting & retaining Senior Advisors | Partner with elderly associations, craft villages, and retired-teacher networks                               |
| Low university adoption                           | Start with free pilot workshops and discounted partnerships; lead with measurable social impact               |
| Inconsistent workshop quality                     | Standardize workshop formats; collect student feedback after every session                                    |
| Knowledge ownership concerns (AI phase)           | Implement clear consent and revenue-sharing agreements with Advisors before any AI training on their material |

## Contributing

This is an early-stage hackathon project. If you're contributing:

1. Branch from `main`.
2. Keep feature routes under `src/pages` and register them in `src/router/index.tsx`.
3. Run `pnpm typecheck` before opening a PR.

## License

Not yet specified. Add a `LICENSE` file before any public/production release.
