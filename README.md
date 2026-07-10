# Portfolio — Raffi Darrell Firmansyah

Dibuat dengan Vite + React + Tailwind CSS.

## Menjalankan di lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build untuk production

```bash
npm run build
```

Hasil build ada di folder `dist/`.

## Deploy

### Vercel (paling gampang)
1. Push project ini ke GitHub.
2. Buka https://vercel.com → New Project → import repo.
3. Framework preset: **Vite**. Build command `npm run build`, output dir `dist`.
4. Deploy.

### Netlify
1. Push ke GitHub.
2. Buka https://app.netlify.com → Add new site → Import from Git.
3. Build command: `npm run build`, publish directory: `dist`.

### GitHub Pages
1. Install: `npm install --save-dev gh-pages`
2. Tambahkan di `package.json`:
   ```json
   "homepage": "https://<username>.github.io/<repo>",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Di `vite.config.js`, tambahkan `base: '/<repo>/'`.
4. `npm run deploy`.

## Struktur

```
src/
  components/
    Nav.jsx
    Hero.jsx
    About.jsx
    Experience.jsx
    Projects.jsx
    Skills.jsx
    Contact.jsx
  App.jsx
  main.jsx
  index.css
```

## Kustomisasi
- Warna & font: `tailwind.config.js`
- Konten tiap section: langsung edit di file komponen masing-masing (semua data ada sebagai array/objek di atas tiap komponen, gampang diganti).
