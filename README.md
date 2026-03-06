# Sentiment Analysis

Media intelligence and executive positioning app with a Vite frontend and a small Express API.

## Local setup

1. Install dependencies:

```sh
npm ci
```

2. Create a local env file:

```sh
cp .env.example .env.local
```

3. Fill in the server-side secrets in `.env.local`:

```sh
PORT=8787
APP_EMAIL=you@yourcompany.com
APP_PASSWORD=your-shared-password
SESSION_SECRET=replace-with-a-random-long-secret
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

4. Start the app:

```sh
npm run dev
```

This starts:
- Vite on `http://localhost:8080`
- The API server on `http://127.0.0.1:8787`

## Production

Build the frontend:

```sh
npm run build
```

Start the server:

```sh
npm start
```

The Express server serves the built app from `dist/` and exposes the `/api/*` routes.

## Available scripts

- `npm run dev`
- `npm run dev:client`
- `npm run dev:server`
- `npm run build`
- `npm start`
- `npm run lint`
- `npm test`

## Security basics in place

- Login password and Anthropic API key are now server-side only.
- Auth uses an `HttpOnly` cookie instead of browser-stored credentials.
- Login and generation endpoints are rate-limited.
- Basic Helmet headers are enabled, including a production CSP.

## Notes

- Sessions are stored in memory for now, which is fine for a single-instance internal deployment.
- Do not commit real `.env` files or API keys.
