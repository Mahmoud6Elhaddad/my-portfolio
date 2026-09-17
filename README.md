# Mahmoud Mohamed El-Saeed — Portfolio

Personal portfolio for **Mahmoud Mohamed El-Saeed**, Junior AI & Machine Learning Engineer.

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies, no backend —
it runs anywhere that can serve static files, GitHub Pages included.

---

## File structure

```
portfolio/
├── index.html              # the whole page (all content lives here)
├── .nojekyll               # tells GitHub Pages to serve files as-is
├── css/
│   └── style.css           # design tokens + all styling
├── js/
│   └── script.js           # nav, reveals, accordions, background canvas
├── assets/
│   ├── profile.jpg         # your portrait (880 × 1100, 4:5)
│   ├── og-image.png        # link preview image (1200 × 630)
│   ├── favicon.svg         # browser tab icon
│   ├── project-images/     # empty — optional project screenshots
│   └── resume/
│       └── Mahmoud_CV.pdf  # the CV the "Download CV" buttons point to
└── README.md
```

---

## Deploy to GitHub Pages

1. Create a new repository on GitHub — for example `portfolio`.
   (If you name it `YOUR-USERNAME.github.io`, the site will live at the root of your domain.)
2. Upload everything **inside** the `portfolio/` folder to the repository root, so that
   `index.html` sits at the top level of the repo. Either drag the files into GitHub's
   "Add file → Upload files" screen, or push from your machine:

   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/Mahmoud6Elhaddad/portfolio.git
   git push -u origin main
   ```

3. In the repository: **Settings → Pages**.
4. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: `main`**,
   **Folder: `/ (root)`**, then **Save**.
5. Wait about a minute and open the URL GitHub shows you:
   `https://Mahmoud6Elhaddad.github.io/portfolio/`

Every path in the site is relative (`css/style.css`, `assets/profile.jpg`, …), so it works
both at a repo subpath and at a domain root. No localhost URLs, no build artifacts.

### One thing to update after the first deploy

Open `index.html` and change these three lines to your real URL so link previews on
LinkedIn, WhatsApp and Twitter show the preview image:

```html
<link rel="canonical" href="https://Mahmoud6Elhaddad.github.io/portfolio/">
<meta property="og:image" content="https://Mahmoud6Elhaddad.github.io/portfolio/assets/og-image.png">
<meta name="twitter:image" content="https://Mahmoud6Elhaddad.github.io/portfolio/assets/og-image.png">
```

---

## How to change things

### Replace your photo

Overwrite **`assets/profile.jpg`**. Keep the same filename and nothing else has to change.

- Best result: a **4:5 portrait** (e.g. 880 × 1100 px), face in the upper third, under ~200 KB.
- If your new photo sits differently in the frame, adjust one line in `css/style.css`:

  ```css
  .portrait img { object-position: 54% 26%; }   /* left/right %, top/bottom % */
  ```

The frame, glow, corner marks and the badge are drawn by CSS around whatever image you drop in.

### Replace your CV

Overwrite **`assets/resume/Mahmoud_CV.pdf`** (keep that exact path and filename). All three
"Download CV" buttons — navbar, hero and contact — point at it.

### Add a GitHub or live demo link to a project

Nothing on the site links to a repo yet, because there was no verified link to use. To add one,
find the project in `index.html` and drop a button in. For the featured project there is already
a comment marking the spot — look for `<!-- Add a repo or demo link here later …`:

```html
<a class="btn btn-ghost" href="https://github.com/Mahmoud6Elhaddad/REPO-NAME" target="_blank" rel="noopener">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-github"/></svg>
  View repository
</a>
```

For projects 02–04, paste the same snippet just after the `<div class="chip-row" …>` block
inside that project's panel. Available icons: `#i-github`, `#i-eye` (live demo), `#i-doc` (paper),
`#i-sparkle` (Hugging Face Space).

### Add project images

Put screenshots in `assets/project-images/` and place them where you want them, for example
above the metrics in the featured case study:

```html
<img src="assets/project-images/plant-disease-detection.png"
     alt="Detection output showing identified leaf diseases"
     width="1200" height="750" loading="lazy"
     style="border:1px solid var(--line);border-radius:8px;margin-bottom:20px">
```

Keep images under ~300 KB and always write real `alt` text.

### Change the colours

Everything comes from the tokens at the top of `css/style.css`:

```css
:root {
  --bg: #07080a;        /* page background      */
  --panel: #0e1116;     /* raised surfaces      */
  --ink: #edeff4;       /* primary text         */
  --accent: #7b93ff;    /* the one accent colour */
  --signal: #4fd6c0;    /* status / output nodes */
}
```

Change `--accent` and the whole site follows — buttons, links, diagram nodes, the background canvas
(the canvas colour is set in `js/script.js`, in the `rgba(123,147,255, …)` strings).

### Add a new project row

Copy one whole `<div class="row">…</div>` block in `index.html`, change the number, title,
text and chips, and give the button/panel a new matching `aria-controls` / `id` pair
(`p5`, `p6`, …). The accordion picks it up automatically.

---

## What's inside

- **Sticky rail layout** — each section has its label and one-line summary in a sticky left rail.
- **Case study + accordions** — the graduation project gets a full-width case study; the other
  three expand in place with their own architecture diagram.
- **Architecture diagrams** — built from HTML and CSS (no image files, no library), so they stay
  sharp, reflow on mobile and can be edited as text.
- **Canvas background** — a light node/edge field, ~24–72 points, paused when the tab is hidden
  and removed entirely under `prefers-reduced-motion`.
- **Accessibility** — semantic landmarks, one `h1`, skip link, keyboard-operable accordions with
  `aria-expanded`, visible focus rings, `aria-current` on the active nav item, alt text.
- **Performance** — no framework, no icon font (icons are one inline SVG sprite), three web fonts,
  everything else local. Total page weight is dominated by the photo and the CV.

## Browser support

Current Chrome, Edge, Firefox and Safari, desktop and mobile. Older browsers still get the full
content and layout; only the accordion open/close animation degrades.

---

© 2026 Mahmoud Mohamed El-Saeed
