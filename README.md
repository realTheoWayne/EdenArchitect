# EdenArchitect

AI-powered garden planner with 2D layout, calendar scheduling, and a 3D garden explorer.

## Run locally

```bash
npm install
npm run dev
```

## Optional AI setup (Gemini)

To enable live AI responses in **Consultant** and live Almanac predictions, create a `.env` file:

```bash
VITE_GEMINI_API_KEY=your_key_here
```

Without this key, the app still runs and falls back to friendly offline/default responses.
