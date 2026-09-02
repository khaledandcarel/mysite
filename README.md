# Khaled Gamal — Architect &amp; Urban Researcher

A static site. No build step, no dependencies, no Node required.
Double-click `index.html` and it works.

---

## Pages

Each section is its own page — nothing is buried down a long scroll.

| File | Section |
|---|---|
| `index.html` | Home — the whole site as a numbered index, fits one screen |
| `about.html` | 01 About |
| `cv.html` | 02 CV |
| `works.html` | 03 Selected works |
| `work-saint-george.html` | The St. George Hotel and Bay |
| `work-europan-18.html` | Polymnia Futura |
| `work-marconi.html` | Viale Marconi |
| `work-indexing.html` | Indexing the Missing |
| `work-abdali.html` | Shelter — Abdali Farmhouse |
| `publications.html` | 04 Publications |
| `blog.html` | 05 Blog |
| `post-fragile-narrative.html` | The Fragile Narrative |
| `contact.html` | 06 Contact |

Supporting files: `assets/css/site.css`, `assets/js/site.js`, `favicon.svg`,
`assets/khaled-gamal-cv.pdf`, and `assets/img/`.

---

## What still needs you

Nothing is a placeholder any more. Every page draws on your CV, your bio, your
project text, your slide decks and the citation metadata in your saved
publication pages.

Two things left off deliberately: your date of birth, gender and nationality are
on the Europass CV but not on the site, and no phone number appeared in any file
you gave me.

### The animations

The three GIFs in `GIF/` were 44 MB between them — too heavy to put on a web
page. They are on the site as **frame sequences**: each GIF's frames exported as
JPEGs into `assets/img/works/saint-george/anim/`, played by swapping a class.
Same motion, 2.1 MB instead of 44 MB, and unlike a GIF it can be paused and it
respects `prefers-reduced-motion`.

To change one, re-export the frames at the same names. The aspect ratio is set
inline on each `.anim__frames` div, so update that if the new frames have
different proportions.

---

## The design

White ground, black ink, and a **thin dotted square grid** behind every page —
drafting paper, fixed so it doesn't tile as you scroll. Change its scale with
one token:

```css
--grid-size: 58px;   /* assets/css/site.css */
```

The home page opens with a slow band of work in black and white, running under
that same grid so the images read as ground rather than as pictures pasted on
top. It pauses when you hover it. Swap the images by editing the twelve `<img>`
tags in `index.html` — six unique files, each listed twice so the loop has no
seam — and regenerate the crops in `assets/img/reel/`.

Type is **Instrument Sans** for everything spoken and **Space Mono** for
everything annotated — sheet numbers, labels, captions, metadata. Rules come in
three drafting weights, and the weight tells you the rank of what it separates.

The interface is monochrome; the drawings are not. Your plates keep their own
colour, so the work is the only colour on the page.

The site commits to one light theme. There is no dark mode — you asked for
white, and a dotted grid inverts badly.

---

## Where the content came from

Nothing here was invented. For the record:

- **About / CV** — `CV/BIO.odt` and `CV/khaled_Mohamed_cv.pdf`
- **The St. George Hotel and Bay** — the page follows your
  `Presentation for website.pptx` slide by slide. I pulled the images out of the
  deck itself and mapped each one to the slide it appeared on, so the sequence
  matches your presentation: early modernity → golden age → expansion → civil
  war → Harirism → today → analysis → intervention → section → views.
- **Polymnia Futura** — `Europan 18 text.docx`, with each area's drawings drawn
  from the matching `Site 1–4` folder.
- **The Fragile Narrative** — the Biennale deck. I used the three sections that
  extracted cleanly (Overview, On Governance, Theoretical Framework) and the
  figure captions embedded in the slides.
- **Publications** — the citation metadata inside the two saved Springer and
  MDPI pages, plus the *Kaynuna* chapter from your CV.

### The essay text — resolved 1 September 2026

All four sections of *The Fragile Narrative* are published, taken verbatim from
`Blog/Biennale di venezia 2025 presentation.pptx`.

An earlier version of that deck — and the printed
`Beinnale Pub Khaled full res..pdf` — carried a badly corrupted copy of the
*Phenomenology* section ("the artist M. G. Hosov", "CABG Railroad", "Municipal
elaborates"). Khaled supplied a corrected deck and the site now uses it. If you
ever need to re-extract, **use the .pptx, not the PDF**: the PDF still holds the
old broken text.

The section carries reference marks 24–29 from the published chapter, with a
line at the foot of the article saying so — the notes themselves are not
reproduced.

---

## Images

**531 MB of source images became 23 MB of web images.** The 71 MB masterplan is
now 607 KB. Originals are untouched in `Selected Works/`, `Blog/` and `CV/` —
those folders are your archive and are not used by the site.

Adding new work: resize to about 2000px on the long edge, save as JPEG into
`assets/img/works/<project>/`, and add a matching `-thumb.jpg` at 900px.

**Space is reserved for one more project** on `works.html` — the dashed
"Next project" card. Replace it with a copy of an existing `.work` block and
point it at a new page.

### Two images deliberately not used

- `Shelter - Abdali Farmhouse/Cover page/Rammed-earth-building…M'Hamid-El-Ghezlane…jpg`
  is a photograph of an existing building in Morocco, not the project. On a
  portfolio it would read as Khaled's work, so the dome interior render is the
  cover instead.
- Three of the four *Indexing the Missing* images are AI-generated (the source
  filenames say so). They are used as project visuals; swap them for drawings
  if you would rather not.

### Where each project page came from

- **Viale Marconi** — `Final Marconi.pptx`, 16 slides and 26 embedded figures.
  Nine are used: the deck's own argument (context → concept → strategy →
  boulevard → views → river park), with the repetitive analysis maps and the
  low-resolution paving details left out. Developed with Anna Giovando under
  the title *Il Polmone*.
- **Indexing the Missing** and **Shelter — Abdali Farmhouse** — the `.odt` text
  in each folder, verbatim, with the images from the folders beside it.
  Collaborator Instagram links came from the two saved `.htm` pages in
  `Shelter - Abdali Farmhouse/Text/`.

---

## Publishing to GitHub Pages

The repository is already prepared: `.gitignore` keeps the ~600 MB of source
archives out, and `.nojekyll` stops GitHub running Jekyll over the files.
Every asset path has been checked to match its filename **exactly, including
case** — Windows is case-insensitive and GitHub Pages is not, so a mismatch
that works locally would 404 once live.

From this folder:

```bash
git init -b main && git add . && git commit -m "Portfolio site"
```

Then create an empty repository on GitHub and push:

```bash
git remote add origin https://github.com/USERNAME/REPO.git && git push -u origin main
```

Finally, in the repository: **Settings → Pages → Source: Deploy from a branch →
`main` / `(root)`**. The site appears at `https://USERNAME.github.io/REPO/`
within a minute or two.

To use `https://USERNAME.github.io/` instead, name the repository
`USERNAME.github.io`.

For a custom domain, add a file called `CNAME` at the root containing only the
domain, point the domain's DNS at GitHub, then tick **Enforce HTTPS**.

### What gets published

Everything except the ignored folders: the 13 HTML pages, `assets/`,
`favicon.svg`, `README.md`. That is about **34 MB** — comfortably inside
GitHub's 1 GB Pages limit.

`Selected Works/`, `Blog/`, `CV/`, `Publications/`, `my photo.jpg` and
`skills/` are **ignored, not deleted**. They stay on your machine as the
archive. Back them up somewhere else — pushing to GitHub will not.

### Netlify or Cloudflare Pages instead

Drag the folder onto either dashboard. Both are free, both give HTTPS and a
custom domain, and neither needs a build command — leave that field empty and
set the publish directory to the folder root.

---

## Accessibility &amp; performance

- Contrast passes WCAG AA throughout — measured, lowest ratio 4.72:1
- Skip link, visible keyboard focus, `aria-current` on the current page
- Image viewer is keyboard-operable: Enter opens, arrows move, Escape closes,
  focus is trapped while open and restored on close
- Every interactive target is at least 44×44px
- `prefers-reduced-motion` is respected — all transitions stop
- Images are lazy-loaded; no horizontal scroll at any width down to 375px
- Every page is readable with JavaScript disabled
- Print stylesheet included, so the CV prints cleanly
