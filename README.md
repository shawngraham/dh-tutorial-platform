# DHPrimer: Tutorial Lab

An interactive web-based tutorial environment for introduction to digital humanities. Features personalized learning pathways, in-browser Python code execution, note-taking, and Obsidian export.

All data stays on your device. No accounts, no tracking, no servers.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (included with Node.js)

## Local Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Building for Production

```bash
npm run build
```

Output goes to the `dist/` directory.

## Deploying

The build output is a static site (HTML + JS + CSS). No backend server is needed.

> **Important — SPA routing:** This app uses client-side routing (React Router with the HTML5 History API). When a user refreshes the page, navigates directly to a URL like `/lesson/python-basics-01`, or uses the browser back/forward buttons after a hard navigation, the browser makes a real HTTP request to the server. The server must respond with `index.html` for every path instead of returning a 404. Each section below explains how to configure this.

### Netlify / Cloudflare Pages / Render

1. Connect your repository.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist`.
4. Deploy.

The `public/_redirects` file in this repository (`/* /index.html 200`) is automatically picked up by Netlify, Cloudflare Pages, and Render — no extra configuration needed.

### Vercel

1. Connect your repository.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add a `vercel.json` at the project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### GitHub Pages

GitHub Pages does not natively support SPA fallback routing. The recommended approach is to copy `index.html` as `404.html` in your build output so that GitHub Pages serves it for unknown paths:

```bash
npm run build
cp dist/index.html dist/404.html
```

Then push the `dist/` folder to a `gh-pages` branch, or use a GitHub Action to automate this step.

Note: if the app is served from a sub-path (e.g. `https://user.github.io/repo/`), set the `base` option in `vite.config.ts` to match:

```ts
export default defineConfig({
  base: '/repo/',
  // ...
})
```

### Self-hosting (nginx)

Serve the `dist/` directory with nginx, configured to fall back to `index.html` for all routes:

```nginx
server {
    listen 80;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Self-hosting (Apache)

Add an `.htaccess` file inside `dist/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Local preview

Use Vite's built-in preview server, which handles SPA routing automatically:

```bash
npm run preview
```

> **Note:** `python3 -m http.server` does **not** support SPA fallback routing and will return 404 on refresh or direct URL access. Use `npm run preview` instead.

## Tech Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4
- Zustand (state management, persisted to localStorage)
- React Router v7
- react-markdown + remark-gfm
- JSZip (Obsidian export)
- Vitest + React Testing Library


