# Task Manager UI

A React + Vite frontend for managing tasks: login, create/edit/delete tasks, mark complete, and paginate through the list.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (CSS-first config, see `src/index.css`)
- oxlint for linting

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_URL to point at your backend
npm run dev
```

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:4000/api` |

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

## Project structure

```
src/
├── api/          # fetch client (auth + tasks endpoints)
├── components/   # UI components
├── context/      # Auth and Toast providers
├── hooks/        # shared hooks (e.g. useAsyncAction)
└── utils/        # small shared helpers
```
