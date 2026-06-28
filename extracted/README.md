# LiveTV71 — Free Live IPTV Streaming

Bangladesh-focused IPTV web app with 161+ live channels, built with React + Vite.

## Features
- 161+ live TV channels (Bangla, English News, Islamic, Kids, Sports, Music, FM Radio…)
- HLS M3U8 streaming via hls.js with auto-retry and 15-second timeout
- Dark / Light mode
- Bangla / English bilingual UI
- Favorites (saved in localStorage)
- Category filtering & instant search
- All Category page with left-panel navigation
- Fully responsive — mobile + desktop optimised

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for Production

```bash
npm run build
npm run preview
```

Output goes to `dist/`.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import the GitHub repo.
3. Vercel auto-detects Vite. Leave all settings as default.
4. Click **Deploy** — done!

`vercel.json` handles SPA routing automatically.

## Stack

| Tool | Purpose |
|---|---|
| React 19 + TypeScript | UI |
| Vite 6 | Build & dev server |
| Tailwind CSS 4 | Styling |
| hls.js | HLS M3U8 streaming |
| Framer Motion | Animations |
| Wouter | Client-side routing |
| next-themes | Dark/light mode |
| Radix UI | Accessible components |

## Developer

**Md. Salim Hossain**  
📞 01737462871  
Facebook / Instagram: `salim.naogaon`
