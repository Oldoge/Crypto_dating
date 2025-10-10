# Crypto Dating ("Crypto Tinder")

An interactive crypto prediction app where users swipe left/right on coins to predict price direction. Built with Vue 3 + Vite + Tailwind on the frontend and a Laravel 12 API on the backend (with Sanctum bearer tokens). Anonymous users’ swipes are stored locally and synced to the backend after login/registration.

## Monorepo structure

- `crypto_dating/` — Vue 3 + TypeScript + Vite frontend
	- Proxies `/api` to the backend during development
	- Uses CoinGecko public API to stream price data
- `crypto-dating-backend/` — Laravel 12 API
	- PHP 8.2+, Composer
	- SQLite database (default) with migrations present

## Prerequisites

- Node.js 18+ (Vite 6)
- npm (or another Node package manager)
- PHP 8.2+
- Composer
- SQLite 3

On Windows, ensure PHP and Composer are in your PATH. You can verify with `php -v` and `composer -V` in PowerShell.

## Quick start (development)

The frontend dev server proxies `/api` to the backend at `http://127.0.0.1:8000` (see `crypto_dating/vite.config.ts`). Start the backend first, then the frontend.

### 1) Backend (Laravel API)

```powershell
cd .\crypto-dating-backend
composer install

# Create env file if missing and generate key
if (-not (Test-Path .env) -and (Test-Path .env.example)) { Copy-Item .env.example .env }
php artisan key:generate

# Use SQLite (recommended for local dev)
# Ensure these lines exist in .env (adjust path if needed):
# DB_CONNECTION=sqlite
# DB_DATABASE=database/database.sqlite

# Create database file if it doesn't exist
if (-not (Test-Path .\database\database.sqlite)) { New-Item .\database\database.sqlite -ItemType File | Out-Null }

# Run migrations
php artisan migrate

# Start the API (defaults to http://127.0.0.1:8000)
php artisan serve
```

### 2) Frontend (Vite + Vue)

Open a new PowerShell terminal:

```powershell
cd .\crypto_dating
npm install
npm run dev
# Vite will show a local URL (typically http://localhost:5173)
```

Now visit the frontend URL. All calls to `/api/...` will be proxied to the Laravel server.

## How it works

- Browse a stream of coins; for each card, swipe right (predict “up”) or left (predict “down”).
- Swipes are captured with the coin’s current price and timestamp.
- After ~5 minutes, the app checks the actual price using CoinGecko and marks the prediction as correct/incorrect.
- If authenticated, the app notifies the backend to increment your correct answers count.
- Anonymous users’ swipes are stored locally and synced to the backend upon login.

Key files:

- Frontend
	- `crypto_dating/src/App.vue` — main UX logic (swiping, persistence, result checks)
	- `crypto_dating/src/api/axios.ts` — API client (`baseURL: '/api'`)
	- `crypto_dating/src/api/auth.ts` — auth API helpers
	- `crypto_dating/src/api/predictions.ts` — predictions API helpers
	- `crypto_dating/vite.config.ts` — dev proxy `/api -> http://127.0.0.1:8000`
- Backend
	- `crypto-dating-backend/routes/api.php` — API routes
	- Controllers in `crypto-dating-backend/app/Http/Controllers/Api`
	- Models in `crypto-dating-backend/app/Models`
	- SQLite DB file at `crypto-dating-backend/database/database.sqlite`

## Frontend scripts

From `crypto_dating/`:

- `npm run dev` — start Vite dev server
- `npm run build` — type-check then build
- `npm run preview` — preview built app
- `npm run lint` — lint sources
- `npm run typecheck` — TypeScript check only

## Backend commands

From `crypto-dating-backend/`:

- `php artisan serve` — run local API server
- `php artisan migrate` — run database migrations
- `php artisan tinker` — interactive shell
- `php artisan test` — run backend tests (PHPUnit)

## Authentication model (Bearer tokens via Sanctum)

The backend uses Laravel Sanctum to issue API tokens. The frontend stores the token in `localStorage` and sends it via `Authorization: Bearer <token>` headers. No cookie-based session is required in development because Vite proxies to the same origin.

## API reference (summary)

Base URL in dev: `/api` (proxied to `http://127.0.0.1:8000/api`). All endpoints return JSON.

Public:

- `GET /api/ping` — health check, returns `{ message: "pong" }`.
- `POST /api/register` — body: `{ email, password, password_confirmation, name? }` → `{ user, token }`.
- `POST /api/login` — body: `{ email, password }` → `{ user, token }`.

Authenticated (requires `Authorization: Bearer <token>`):

- `GET /api/user` — current user object.
- `POST /api/logout` — revoke current token.
- `GET /api/profile` — `{ name, email, created_at, correct_answers }`.
- `POST /api/quiz/correct` — increments the authenticated user’s `correct_answers`.
- `GET /api/predictions` — paginated list of user’s predictions (latest first).
- `POST /api/predictions` — create/update one prediction. Body:
	```json
	{
		"client_id": "uuid-optional",
		"type": "coin",
		"payload": {
			"coinId": "bitcoin",
			"coinName": "Bitcoin",
			"coinSymbol": "btc",
			"action": "like|dislike",
			"initialPrice": 61234.56,
			"timestamp": "2025-10-10T12:34:56.000Z"
		},
		"score": 0.95
	}
	```
	- If `client_id` is provided, the backend will `updateOrCreate` on `(user_id, client_id)`.
- `POST /api/predictions/bulk` — bulk create/update. Body:
	```json
	{ "items": [ { "client_id": "...", "type": "coin", "payload": { ... }, "score": 0.1 } ] }
	```

## Environment configuration

Frontend

- No env variables required for development; `/api` proxy is configured in `vite.config.ts`.

Backend (`.env`)

- For SQLite (recommended for local dev):
	```env
	DB_CONNECTION=sqlite
	DB_DATABASE=database/database.sqlite
	```

## Notes and limitations

- CoinGecko rate limits apply (the app fetches prices periodically; avoid running multiple dev tabs to stay within limits).
- Anonymous predictions are stored locally and synced on login; network errors are handled best-effort.
- The app marks predictions after 5 minutes by comparing current price vs. initial price at swipe time.

## Troubleshooting

- Frontend cannot reach API
	- Ensure `php artisan serve` is running at `http://127.0.0.1:8000`.
	- Confirm the Vite proxy in `crypto_dating/vite.config.ts` points to the same host/port.
- SQLite migration issues
	- Make sure the DB file exists: `database/database.sqlite`.
	- Verify `.env` uses `DB_CONNECTION=sqlite` and correct `DB_DATABASE` path.

## License

This project is provided as-is without a specified license. If you plan to publish or distribute, add a suitable license file.

