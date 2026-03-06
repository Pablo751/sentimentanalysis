# Sentiment Analysis

Frontend application for media intelligence and executive positioning workflows.

## Local setup

1. Install dependencies:

```sh
npm ci
```

2. Create a local env file:

```sh
cp .env.example .env.local
```

3. Add your Anthropic API key to `.env.local`:

```sh
VITE_ANTHROPIC_API_KEY=your-key-here
```

4. Start the development server:

```sh
npm run dev
```

The app runs on `http://localhost:8080` by default.

## Available scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm test`

## Notes

- The current generation flow calls Anthropic directly from the browser for local/demo usage.
- Do not commit real `.env` files or API keys.
- For production deployment, move model calls behind a server-side proxy.
