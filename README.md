# Sahih al-Bukhari — Interactive Hadith Explorer

An interactive, high-performance website for browsing the complete **Sahih al-Bukhari** collection (7,277 hadiths). Features a bilingual UI (Arabic/English), instant chapter navigation, diacritics-insensitive search with live highlighting, and a data-loading pipeline built to handle a large dataset without making the person wait.

> Note: this README previously mentioned Sahih Muslim as well — the current codebase and dataset only cover Sahih al-Bukhari, so that's been removed below. If Sahih Muslim data gets added later, this doc (and the data pipeline) will need updating too.

🔗 **Live Demo:** [View Live Demo](https://dania-it.github.io/Sahih-al-Bukhari/)

---

## Tech Stack & Architecture

**Core Engine:** JavaScript (ES6+), HTML5, CSS3
**Styling & Design:** Tailwind CSS (CDN/JIT) with a custom Islamic geometric motif and Amiri/Cairo/Reem Kufi typography
**Icons:** FontAwesome
**Data Handling:** Chunked JSON loading with background streaming (see below), IndexedDB for full-dataset caching, LocalStorage for bookmarks

---

## Key Features

- **Fast First Paint:** The ~12MB dataset is split into small chunks at build time, so the page shows real content within seconds instead of waiting for the entire file — see [Data Loading Strategy](#data-loading-strategy).
- **Internationalization (i18n):** Full support for Arabic (RTL) and English (LTR) with dynamic UI restructuring.
- **Chapter Browsing:** Sidebar (desktop) and drawer (mobile) navigation to filter Hadiths by book/chapter.
- **Smart Pagination:** Client-side pagination that stays put while more data streams in — it never resets the person to page 1 mid-browse.
- **Smart Search & Filtering:** Diacritics-insensitive, phrase-anchored search (matches the words in the order typed, not scattered anywhere in the text) with live term highlighting and length-based filtering (Short/Long).
- **Dynamic Theme Switcher:** Fully integrated Dark & Light modes.
- **Responsive & Accessible:** Layout optimized down to small phone widths, with font-scale controls and a dedicated mobile filters modal / chapters drawer.
- **Persistence & Bookmarks:** Bookmarking via `localStorage`; the full hadith dataset itself is cached in `IndexedDB` after first load, so repeat visits render instantly with zero network wait.

---

## Data Loading Strategy

The raw dataset (`data/bukhari.json`, ~12MB) is too large to fetch in one request without a noticeable wait. `build-tools/split-data.mjs` splits it into:

- **`data/meta.json`** — chapters + a lightweight `{id, chapterId}` index for every hadith. Small, loads almost instantly, and is enough to render the full chapter list and correct total count right away.
- **`data/chunk-0.json`, `data/chunk-1.json`, ...** — the full Arabic/English text, ~150 hadiths per file (~250KB each).

At runtime (`JS/script.js`):

1. If a previous visit already cached the full dataset in `IndexedDB`, it renders from cache immediately and quietly re-validates in the background.
2. Otherwise, it fetches `meta.json` + `chunk-0.json` first — real hadiths appear on screen within a couple of seconds.
3. The remaining chunks stream in silently in the background (no visible "loading" flicker, no page jumps) and get merged in; once complete, the full dataset is cached in `IndexedDB` for the next visit.
4. If `data/meta.json` isn't present (chunks haven't been generated yet), the site automatically falls back to fetching the single `data/bukhari.json` — so it keeps working either way.

### Regenerating the chunks

Whenever `data/bukhari.json` changes, regenerate the chunk files:

```bash
node build-tools/split-data.mjs data/bukhari.json data
```

This writes `meta.json` and `chunk-*.json` into the `data/` folder alongside the original file. Upload the whole `data/` folder (the original `bukhari.json` can stay too, as an automatic fallback, or be removed once you've confirmed the chunked version works).

---

## How to Run Locally

The site fetches JSON files with `fetch()`, which browsers block on the `file://` protocol — so opening `index.html` directly by double-clicking it won't load any data. Serve it over a local HTTP server instead:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/bukhari-app.git
   cd bukhari-app
   ```

2. **(Optional) Generate the data chunks**, if `data/meta.json` isn't already present:
   ```bash
   node build-tools/split-data.mjs data/bukhari.json data
   ```

3. **Serve the folder locally** — any of these work:
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```
   Or use the VS Code "Live Server" extension and click "Go Live".

4. **Open the site** at the address the server prints (e.g. `http://localhost:8080`).

---

## Project Structure

```
├── build-tools/
│   └── split-data.mjs      # splits bukhari.json into meta.json + chunks
├── CSS/
│   └── style.css
├── data/
│   ├── bukhari.json        # original full dataset (fallback)
│   ├── meta.json           # chapters + lightweight index
│   └── chunk-*.json        # hadith text, ~150 per file
├── img/
├── JS/
│   ├── script.js           # app init, data loading/caching, i18n, theme
│   ├── filters.js          # search/chapter/length/bookmark filtering
│   ├── search.js           # diacritics-insensitive search + highlighting
│   └── render.js           # hadith card + pagination rendering
├── index.html
└── README.md
```