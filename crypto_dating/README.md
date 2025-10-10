Crypto Dating — Frontend

Vue 3 + TypeScript + Vite single-page app for swiping on cryptocurrencies to predict direction. Proxies API calls to the Laravel backend during development.

Dev scripts

- npm run dev — start Vite dev server
- npm run build — type-check then build
- npm run preview — preview the built app
- npm run lint — lint sources
- npm run typecheck — TypeScript check only

Dev proxy

- See `vite.config.ts`; `/api` is proxied to `http://127.0.0.1:8000`.

Key sources

- `src/App.vue` — main UI and app logic
- `src/api/axios.ts` — API client (`baseURL: '/api'`)
- `src/api/auth.ts`, `src/api/predictions.ts` — backend clients
