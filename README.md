# Polk County Cycling Club

Public website for Polk County Cycling Club (PoCo) in Bolivar, MO — events, trails, about, and contact.

## Hosting

- **Domain:** `polkcountycycling.org` (Cloudflare Registrar + DNS)
- **Host:** Cloudflare Workers (static assets) with GitHub builds from `main`
- **Stack:** Static brochure site (placeholder HTML for now; Prototyper/Designer will replace this)

## Config

`wrangler.jsonc` names the Worker `polk-county-cycling-club` — that name must match the project in the Cloudflare dashboard when using Git builds.

## Local preview

Open `index.html` in a browser, or:

```bash
npx --yes serve .
```

## Cloudflare setup (Git)

1. [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) → **Create** → **Import a repository**
2. Connect GitHub → select `KyndleK/polk-county-cycling-club`
3. Confirm project name `polk-county-cycling-club`, production branch `main`
4. No build command for plain HTML; deploy root assets
5. After `*.workers.dev` (or Pages URL) looks good → **Custom domains** → `polkcountycycling.org` (+ optional `www`)

## Maintain

Push to `main` → production. Branches/PRs get preview URLs.
