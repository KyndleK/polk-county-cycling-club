# PoCo Cycling — static website prototype

First clickable prototype for **Polk County Cycling Club** (branded **PoCo Cycling**), Bolivar, MO.

## Quick start

From this folder:

```bash
cd /workspace/poco-cycling
python3 -m http.server 8790
```

Then open **http://localhost:8790/** in a browser.

> News loads from `data/news.json` via `fetch`, so use a local server (not `file://`) for the News teaser and News page.

Optional: open any `.html` file directly for layout review; news sections will show a fallback message without a server.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — mission, CTAs, Highline callout, news teaser, Country Miler band |
| `about.html` | Who we are, vision, city partnership, growth |
| `news.html` | Full news list from JSON |
| `routes.html` | Frisco Highline context, two real Strava routes with Leaflet+OSM+GPX embeds, community routes + submit form |
| `country-miler.html` | Gran fondo event page (earthy accents) |
| `contact.html` | Join / signup form (client-side + localStorage) |
| `admin.html` | Prototype route moderation (not in main nav; footer “Club admin”) |

## Brand & assets

Color tokens live at the top of `css/styles.css` (CSS variables). Summary:

| Token | Hex | Role |
|-------|-----|------|
| `--ink` | `#161816` | Near-black charcoal text |
| `--ink-soft` | `#2c322e` | Secondary text |
| `--muted` | `#5e665f` | Captions / meta |
| `--paper` / `--paper-deep` | `#f6f3ec` / `#efeae0` | Warm paper backgrounds |
| `--white` | `#fffcf7` | Warm off-white surfaces (logo-safe) |
| `--line` | `#ddd6c8` | Warm hairline borders |
| `--trail` / `--trail-deep` | `#2f6b4a` / `#245538` | Highline green — primary buttons, links, badges |
| `--trail-wash` | `#e4efe8` | Soft green section wash |
| `--slate` | `#3a434a` | Asphalt slate — footer / callouts |
| `--sun` / `--sun-deep` | `#d4922a` / `#b8781c` | Warm gold / sunset accents (sparingly) |
| `--barn` / `--olive` / `--gold` / `--tan` / `--cm-bg` | `#8b2e2e` / `#5a6b3a` / `#c4a35a` / `#e8d9b5` / `#f4ebe0` | Country Miler earthy variant |

- **Club UI:** trail green primary on warm paper; PoCo logo stays on white/light fields
- **Country Miler:** barn red, olive, gold/tan on that page; flyer image at `assets/country-miler-flyer.png`
- **Logo:** official mark `assets/poco-logo.png` (black on white) — used in header, hero, footer, and favicon. Do not replace or invent a sprocket logo (`assets/poco-mark.svg` is leftover only).

## Featured routes (GPX + maps)

On **Routes**, each featured ride has a free embedded map (Leaflet + OpenStreetMap tiles; OSM attribution shown; **no paid API keys**) and a Strava link:

| Name | GPX | Strava |
|------|-----|--------|
| Frisco to Springfield | `assets/routes/frisco-to-springfield.gpx` | [route](https://www.strava.com/routes/3335811973838770020) |
| Bolivar, MO - 100k Country Days Ride (Official) | `assets/routes/country-days-100k.gpx` | [route](https://www.strava.com/routes/3203046025833049414) |

Maps load local GPX via `js/maps.js` (parse track points → Leaflet polyline, fit bounds). A “coming soon / submit yours” card remains.

## Join / signup (Contact)

Fields: name, email, city/town, experience level (optional), how did you hear, checkbox for ride updates.

- Submit uses `preventDefault`, hides the form, and shows a thank-you / “we’ll be in touch” message.
- A copy is also saved to `localStorage` (`pocoJoinSignupsV1`) for this browser only.

**Production:** wire email delivery or a form backend (Formspree, Netlify Forms, Google Forms, etc.). The prototype does not send mail.

## Route submission + admin (prototype)

1. Public form on `routes.html#submit-route` — title, description, optional distance, Strava/GPX URL, submitter name + email.
2. On submit, entry is stored in `localStorage` (`pocoRoutesV1`) with status `pending`.
3. `admin.html` — password gate; prototype password is **`poco`** (sessionStorage auth; not real security).
4. Admin can **Approve** (status → `published`, shown under Community routes on Routes) or **Reject** (removed from the queue).

Data is **per browser / device** only. Production needs a shared database and real authentication.

## What to swap later (placeholders vs real)

**Real / intentional content**

- Club name, Bolivar MO, president Kyndle Katzer
- Mission & Highline emphasis
- Country Miler flyer facts: First Baptist Church Bolivar start, 60 & 23 mi, 3 SAGs, tacos, Alpha House beneficiary
- Country Miler is a **country-road** gran fondo (not on the Frisco Highline / rail trail)
- Club photos in `assets/photos/` (event + community)
- Facebook URL
- Two featured GPX routes with OSM maps + Strava links (above)
- Official PoCo logo PNG, Country Miler flyer, and club photos under `assets/photos/`

**Placeholders / samples — edit these**

| Item | Where |
|------|--------|
| Sample news posts | `data/news.json` (marked `"sample": true`) |
| Contact email | `hello@pococycling.example` on Contact |
| Join form backend | localStorage + thank-you UI only — add Formspree/etc. |
| Country Miler signup | Live: https://www.bikereg.com/the-country-miler (opens new tab) |
| Meeting schedule | TBD on About & Contact |
| Exact event date / fees | Not on flyer facts used here — add when set |
| Admin password / auth | Hardcoded `poco` — replace before any public deploy |

## Editing tips (non-dev friendly)

1. **News:** edit `data/news.json` — keep the same field names (`id`, `date`, `title`, `excerpt`, `tag`, `sample`; optional `image`, `imageAlt`).
2. **Copy:** most body text is plain HTML in each page’s `<main>`.
3. **Styles:** one shared file — `css/styles.css`. Country Miler extras use `.cm-*` classes.
4. **Logo:** official file is `assets/poco-logo.png` — keep header/hero/footer `src` pointing there.
5. **Routes JS:** `js/maps.js` draws GPX on Leaflet; `js/routes-store.js` handles submit/admin localStorage; `js/main.js` handles nav, join form, and news.

## Tech

- Static HTML / CSS / JS only — **no build step**
- Shared: `css/styles.css`, `js/main.js`, `js/routes-store.js`, `js/maps.js`
- Maps: **Leaflet** (CDN) + **OpenStreetMap** raster tiles + local **GPX** under `assets/routes/`
- Mobile nav toggle + client-side forms (join + route submit + admin)

## Not included

- GitHub repo / hosting setup
- Real backend, payments, or email delivery
- Shared admin across devices
- Paid map API keys (intentionally avoided)
