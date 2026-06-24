# Hugo Romat — Personal Website

A single-page personal/academic portfolio for **Hugo Romat, Ph.D.**, Senior Research
Engineer at Microsoft Research. Static HTML/CSS/JS — no build step required to deploy.

The design (warm paper palette, single teal accent, Manrope + Newsreader type, sticky
sidebar) is inspired by the layout of academic portfolio sites; all content, copy, and
code here are Hugo's own.

## Structure

```
index.html              # The whole page (sidebar + About / Experience / Research / Education)
styles.css              # All styling
script.js               # Cite popovers, copy-to-clipboard, smooth scroll, active-nav highlight
assets/
  hugo.png              # Portrait shown in the sidebar
  favicon.svg           # "HR" favicon
  logos/                # Institution logos (placeholders): microsoft, eth, inria, ensc, laval
```

## Run locally

```powershell
python -m http.server 8099
# then open http://localhost:8099/
```

## Replace the placeholder assets

The site works immediately, but swap these for the real thing:

| File | What to drop in |
| --- | --- |
| `assets/hugo.png` | Your portrait (already wired into the sidebar). Replace this file to change the photo, keeping the same name. |
| `assets/logos/*.svg` | Official institution logos (keep the same filenames, or update the `src`s). |

Profile photo and paper thumbnails are picked up automatically when present;
until then the site shows tasteful placeholders.

## Update the sidebar links

The sidebar links to Google Scholar, DBLP, ACM, and LinkedIn — all four point at the real
profiles. To change any of them, edit `index.html` (search for `scholar.google`,
`dblp.org`, `dl.acm.org`, and `linkedin.com`).

## Publications

The publication list is hand-authored directly in `index.html` (the year-grouped
`<ol class="pub-list">` blocks inside the `#publications` section). To add, edit, or
remove a paper, edit that HTML by hand. Each entry carries its own authors, venue label,
optional award badge (`<span class="award">…</span>`), DOI/arXiv links, and BibTeX block.

## Deploy

It's fully static, so any static host works — GitHub Pages, Netlify, Azure Static Web
Apps, etc. For GitHub Pages, push to a repo and enable Pages on the default branch root.

