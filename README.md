# Polk County Cycling Club

Public website for [Polk County Cycling Club (PoCo)](https://github.com/KyndleK/polk-county-cycling-club) in Bolivar, MO — events, trails, about, and contact.

## Hosting

- **Domain:** Cloudflare Registrar + DNS
- **Host:** [Cloudflare Pages](https://developers.cloudflare.com/pages/) (GitHub deploys from `main`)
- **Stack:** Static brochure site (placeholder HTML for now; Prototyper/Designer will replace this)

## Local preview

Open `index.html` in a browser, or serve the repo root:

```bash
npx --yes serve .
```

## Cloudflare Pages setup

1. Workers & Pages → Create → Connect GitHub → this repo
2. Production branch: `main`
3. Build command: *(leave empty for plain HTML)*
4. Build output directory: `/` (or leave as root)
5. After first deploy works on `*.pages.dev`, attach the custom domain under **Custom domains**

## Maintain

Push to `main` → production. Branches/PRs get preview URLs automatically.
