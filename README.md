# MNV Associates homepage concept

A single-page, fully interactive homepage concept for MNV Associates, Dubai. Built with Next.js (App Router, TypeScript), Tailwind CSS and a static export for Vercel. The brief, design rules and build plan live in [CLAUDE.md](CLAUDE.md).

## Getting started

```bash
npm install
npm run dev      # development server
npm run build    # static export to out/
npm run lint
```

Optional asset scripts (the generated files are already committed):

```bash
node scripts/fetch-assets.mjs   # images from mnvassociates.com, optimised into public/images/
node scripts/fetch-fonts.mjs    # Urbanist 300/400/600/700 and Cormorant Garamond Italic into app/fonts/
```

`fetch-assets.mjs` downloads originals into `assets-raw/` (git-ignored, never deployed) and writes the optimised WebP and AVIF files plus `manifest.json` into `public/images/`.

## Environment variables

Copy `.env.example` to `.env.local` to set these locally, or add them in the Vercel project settings.

| Variable | Use |
|---|---|
| `SITE_URL` | Optional. Canonical and Open Graph base URL. On Vercel it falls back to the production domain automatically, so it is only needed for a custom domain. |
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | Optional. When set, the contact form also posts its fields as JSON to this Formspree endpoint. When unset, the form validates and shows the success state without sending anything. |

## Deploying to Vercel

```bash
npx vercel login
npx vercel          # first deploy, creates a preview and links the project
npx vercel --prod   # production deploy
```

Vercel detects Next.js and serves the static export, so no settings are needed. After the first production deploy, open the live URL and check that the canonical link in the page source points to it.

## Lighthouse

Measured locally with Lighthouse 12 against the production build, served with Brotli compression and Vercel-style cache headers. Mobile uses Lighthouse's default simulated slow 4G and 4x CPU slowdown.

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop (median of 3) | 100 | 100 | 100 | 100 |
| Mobile (median of 5, range 82 to 89) | 89 | 100 | 100 | 100 |

Mobile Performance is below the 95 target on this machine. Observed first paint in a Lighthouse run is dominated by headless Chrome's software GPU start-up (about 2.2 s, versus about 0.25 s in the runs where it does not occur), and Lighthouse folds that delay into every simulated metric. In the best run, where the start-up delay did not occur, the score was 94 with a Speed Index of 1.2 s. Please re-run PageSpeed Insights on the live URL for a measurement without that artefact.

## Decisions and notes

- **Premium pass.** Full-bleed hero with a purple overlay and film grain, an adaptive glass header, scroll-linked reversible reveals (CSS scroll-driven animations with an IntersectionObserver fallback), a line-and-dot motif, a client marquee, a dot-grid contact band and floating actions. Everything animates only transform, opacity and clip-path and is static under `prefers-reduced-motion`. The testimonial quotes use Cormorant Garamond Italic, everything else Urbanist.
- **Typeface.** Gilroy is a paid typeface, so the page uses Urbanist, the closest free geometric match. Gilroy can be swapped in once the client supplies the license. Urbanist is self-hosted as static instances (400, 600, 700) through `next/font/local`. The Google Fonts variable file made the first layout about twice as slow, because every non-default weight forces per-glyph interpolation.
- **Package name.** The package is called `mnv-homepage` because npm rejects project names with capital letters, and the folder is `MNVassignment`.
- **Next.js config.** `cacheComponents` and `partialPrefetching`, which the Next.js 16.4 starter enables, are removed because Next.js fails the build with "PPR cannot be enabled in export mode" when they are combined with `output: 'export'`. `agentRules` is set to `false` so `next dev` does not regenerate an `AGENTS.md` file. `experimental.inlineCss` is on so the small Tailwind stylesheet arrives with the HTML.
- **Hero image.** The live site's `home.jpg` is only 393x601, which would look soft on retina screens. The hero uses `New-Home-1.jpg` (the same tower, 1600x853) cropped to a 4:5 portrait, shipped as AVIF with a WebP fallback, and the panel is capped at about 460px wide on desktop. A plain `<img>` with `srcSet` is used because `next/image` drops `srcSet` when images are unoptimised.
- **WhatsApp.** The live site points WhatsApp to the landline. This concept uses the mobile number (+971 56 375 0931) as an assumption.
- **Colour.** The hero tagline is set in `--brand` rather than lilac, because lilac on white is 2.9:1 and fails WCAG AA even for large text. Lilac is kept for decorative accents and large text on the purple contact band.
- **Insight summaries.** Summaries are the first full paragraph of each article. The first article opens with a one-line pull quote, so its summary starts at the next paragraph. Em dashes in source text were replaced with commas.
- **Service descriptions.** Corporate Tax and VAT use the live site's meta descriptions. The other seven pages have no meta description, so the descriptions were written from facts stated on each page.
- **Partner photos.** Photos were matched to names from the page markup (each photo sits directly before its name on the About page).
- **Rendering.** Sections below the hero use `content-visibility: auto`, and `goTo` in `lib/navigation.ts` corrects the scroll position after jumping to one of them.
