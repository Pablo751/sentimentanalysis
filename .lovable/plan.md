

## Intelligence Loader Screen

### What We're Building
A 6-second animated loader screen that plays after login and before the dashboard, simulating real-time intelligence processing across 3 stages.

### New Files
1. **`src/pages/LoadingScreen.tsx`** — Full-screen loader component with 3 timed stages:
   - **Stage 1 (0-2s):** Shield icon, "Loading ENEC Knowledge Base" heading, progress bar animating 0→100% with percentage counter
   - **Stage 2 (2-4s):** Brain icon, "Applying Edelman Strategic Intelligence" heading, three pulsing dots animation
   - **Stage 3 (4-5.7s):** Satellite icon, "Scanning Global News Sources" heading, 10 publication name labels appearing sequentially (greyscale text, since we don't have actual logos — will use styled text badges for Reuters, FT, Bloomberg, WSJ, AP, S&P Global, Arab News, Khaleej Times, Gulf Today, Oil & Gas Middle East)
   - **Confirmation (5.7-6s):** "Intelligence Ready — 1,247 articles processed across 50+ publications"
   - Auto-navigates to dashboard with fade transition after 6s

   Uses `useState` for current stage + progress, `useEffect` with timers for sequencing. Each stage fades in/out using CSS opacity transitions.

### Modified Files

2. **`src/pages/Login.tsx`** — Change `navigate("/")` to `navigate("/loading")` on sign-in

3. **`src/App.tsx`** — Add `/loading` route pointing to `LoadingScreen`

4. **`src/context/AppContext.tsx`** — Add `hasSeenLoader` boolean state (default `false`, set to `true` after loader completes, reset on logout). This ensures the loader only plays once per session.

### Layout Details
- White background, centered content column (max-w-lg)
- Top bar: "edelman" logo left, "ENEC" right (matching nav styling)
- Bottom: small grey footer text
- Lucide icons: `Shield`, `Brain`, `Radio` (satellite dish equivalent)
- Progress bar: 6px height, rounded, Edelman blue fill on grey track
- Stage transitions: 300ms opacity fade

### Session Guard
If user navigates directly to `/` and `hasSeenLoader` is false, they still go straight to the dashboard (no forced redirect). The loader only triggers from the login flow. On logout, `hasSeenLoader` resets so the next login shows it again.

