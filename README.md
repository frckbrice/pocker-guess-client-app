# PockerPlay Frontend: WIP.

![PockerPlay Banner](pockerplay-fe/public/images/pocker-home.png)

Mobile-first PWA frontend for **PockerPlay**, a real-time two-player guessing game.
Built with Next.js + TypeScript + Tailwind and connected to a NestJS backend through Socket.IO.

## Product Goal

PockerPlay is designed to let two remote players start and complete a fast guessing session with minimal friction:
- host creates a game session
- shares a link with another player
- players exchange choices and guesses in real time
- score and round progression update live
- end-of-game statistics summarize performance

The frontend goal is to provide a low-latency, mobile-first experience with resilient reconnect behavior and smooth gameplay feedback.

## Core Features

- **Realtime gameplay** via Socket.IO events (`init`, `joingame`, `generate`, `send_choice`, `send_guess`, etc.)
- **Optimistic mutations** for user actions (create game, generate, send choice/guess, verification submit)
- **Deduplicated notifications** using centralized toast helpers and toast IDs
- **PWA behavior** via `next-pwa` for installability and better repeat-load performance
- **Responsive UI** tailored first for mobile while scaling to larger screens

## Frontend Architecture

### Layers

1. **App Router layer** (`src/app`)
   - route-level pages and layouts
   - page orchestration for dashboard/game state
2. **UI layer** (`src/components`)
   - atoms / molecules / organisms composition
3. **Service layer** (`src/utils/service`)
   - websocket constants and backend API calls
4. **Shared UX utilities** (`src/utils`)
   - notifications and optimistic mutation helpers

### Data & Realtime Flow

- HTTP mutation for verification/user bootstrap (`POST /users`)
- Socket.IO channel for game lifecycle and round actions
- localStorage persistence for session continuity (`home_player`, `guess_player`, role/status)

## Project Structure

```txt
src/
  app/
    Context/
      AppContext.tsx
    dashboard/
      page.tsx
      [id]/page.tsx
    verification/page.tsx
    register/page.tsx
    layout.tsx
    nextToast.ts
  components/
    atoms/
    molucles/
    organisms/
  utils/
    notifications.ts
    optimistic-mutation.ts
    service/
      api-call.ts
      constant.ts
      supabaseClient.ts
.github/
  workflows/
    frontend-ci.yml
```

## Security & Performance Standards Applied

- Removed unsafe wildcard image host from Next image config
- Added security headers in Next.js (`CSP`, `X-Frame-Options`, `nosniff`, `Permissions-Policy`, `Referrer-Policy`)
- Enabled strict runtime defaults (`reactStrictMode`, `poweredByHeader: false`, `compress: true`)
- Added request timeout and username validation for verification mutation
- Prevented socket listener leaks by subscribing/unsubscribing inside `useEffect`
- Removed direct DOM event listener mutation that caused memory leaks

## Realtime Stability Notes

- Socket listeners are lifecycle-managed with `socket.on` + `socket.off`
- Reconnect handling updates UI status and retries connection
- Toast notifications are centralized and deduplicated to avoid repeated success/error spam

## Git Workflow (CI)

A GitHub Actions workflow is included at:
- `.github/workflows/frontend-ci.yml`

Pipeline on push/PR (`main`, `master`, `develop`):
- install dependencies
- run lint
- run production build

This keeps frontend changes safe and reviewable before merge.

## Local Development

### Prerequisites

- Node.js 20+
- Yarn 1.x/Classic

### Setup

```bash
yarn install
yarn dev
```

App runs on `http://localhost:3000`.

### Environment Variables

Create `.env` (or `.env.local`) and configure at minimum:

- `NEXT_PUBLIC_REMOTE_BURL` backend base URL (e.g. `http://localhost:3000`)
- `NEXT_PUBLIC_VERCEL_URL` frontend public URL for share links
- `NEXT_PUBLIC_GOOGLE_CLIENT` Google OAuth client id (if used)

## Related Backend

This frontend is intended to work with the companion backend (`pockerplay-backend`) in the same workspace, especially for websocket event contracts.
# pocker-guess-app
