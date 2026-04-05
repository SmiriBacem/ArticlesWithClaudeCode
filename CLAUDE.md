# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Architecture

React 19 + TypeScript SPA using Vite, Tailwind CSS v4 (via `@tailwindcss/vite` plugin), and React Router v7.

- `src/main.tsx` — entry point, renders `<App />`
- `src/App.tsx` — sets up `BrowserRouter` and defines all `<Route>` paths
- `src/pages/` — page-level components (one per route)
- `src/components/` — shared components; `Navbar.tsx` contains the top nav with `NavLink`s
- `src/components/ui/` — reusable UI primitives (e.g. `Button.tsx`)
- `src/components/comments/` — comment system components (thread, card, form, report modal)
- `src/services/` — all data access logic; no backend, all data persisted in `localStorage`
- `src/context/AuthContext.tsx` — global auth state via React context; consumed via `useAuth` hook
- `src/types/` — shared TypeScript types (`User`, `Comment`, `CommentReport`, `ModerationEntry`)

Routing: each page component maps to a route in `App.tsx`. Adding a page requires a new file in `src/pages/`, a `<Route>` in `App.tsx`, and a `<NavLink>` in `Navbar.tsx`.

## Data layer

All persistence is `localStorage`-only (no backend). The three services are:

- `authService` — register/login/logout, token stored in `comment_system_token`. Demo accounts exist with password `password123`: `user@example.com` (role: `user`), `moderator@example.com` (role: `moderator`), `admin@example.com` (role: `admin`).
- `commentService` — threaded comments scoped by `postId`, max nesting depth of 2. New comments with spam score > 0.7 are auto-set to `pending` status instead of `approved`.
- `spamService` — scores comments 0–1 based on keywords, URL count, caps ratio, and disposable email domain.
- `realtimeService` — in-memory pub/sub event emitter (no WebSocket); simulates realtime by emitting `comment:new`, `comment:status:changed`, `comment:reported` events.

## Auth and roles

`UserRole` is `'user' | 'moderator' | 'admin'`. The Navbar conditionally shows a **Moderation** link for `admin` and `moderator` roles. There are no route guards in the router — access control is enforced inside page components.

## Rules

- When creating a new page or component, always add a corresponding `<NavLink>` in `src/components/Navbar.tsx` in the same step.
- Use Tailwind CSS utility classes for styling — no separate CSS files per component.
