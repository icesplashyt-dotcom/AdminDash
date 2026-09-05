# RMBpay Admin Dashboard

A React + Tailwind admin dashboard UI (mock data, no backend).

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

The static site is output to `dist/`.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy to GitHub Pages

1. In `vite.config.js`, set `base: "/<your-repo>/"` (matching your repo name).
2. Build the site: `npm run build`.
3. Push the `dist/` folder to a `gh-pages` branch, e.g. using the
   [`gh-pages`](https://www.npmjs.com/package/gh-pages) package:
   ```bash
   npm install -D gh-pages
   npx gh-pages -d dist
   ```
4. In your repo's Settings → Pages, set the source to the `gh-pages` branch.

Alternatively, deploy `dist/` to Vercel or Netlify with zero extra config.
