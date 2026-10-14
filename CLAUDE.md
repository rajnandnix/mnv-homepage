# CLAUDE.md: MNV Associates Homepage Concept

This file is the single source of truth for this project. Read it fully before writing any code, and re-read the relevant phase before starting it.

## 1. Project context

- Client: MNV Associates, Dubai (Office 706, Sobha Ivory II, Business Bay)
- What they do: Tax, Advisory and Business Process Solutions for startups, SMEs and multinational corporations in the UAE
- Deliverable: a single homepage concept, fully interactive, deployed as a live link on Vercel
- This is a proof-of-work assignment with a 2 to 3 hour guide. Favour polish and clarity over quantity. If time runs short, cut the items marked OPTIONAL first.
- Reviewers will judge: mobile responsiveness, page speed and clean structure, visual hierarchy and brand fidelity, and how clearly the decisions are explained.
- Reference sites (borrow ideas, never copy): EY UAE, Deloitte Middle East, KPMG Lower Gulf.

## 2. Brand rules (non-negotiable)

- Primary colour `#533278`, secondary `#A191B2`, white `#FFFFFF`
- Font: Gilroy is a paid typeface. Use **Urbanist** from Google Fonts via `next/font` as the fallback (closest free geometric match). Note in the README that Gilroy can be swapped in once the client supplies the license.
- Tagline: `unlock your growth`, always lowercase, everywhere, including meta tags and alt text. Never capitalise it, never put a full stop after it.
- Company name is written "MNV Associates". Never "MNV associates" or "Mnv".
- No em dashes anywhere in copy. Use commas, colons or full stops.
- Spelling: British English to match the current site ("optimise", "organisation"), except "license" (always this spelling).

## 3. Design system

### Colour tokens
| Token | Hex | Use |
|---|---|---|
| `--brand` | `#533278` | Buttons, links, active states, the hero tagline, the contact band background |
| `--lilac` | `#A191B2` | Decorative accents (lines, dots, borders on dark). Text only on the purple contact band, and only at large sizes (3.44:1 there, so small text on the band is white). Never any text on white or `--mist` (2.9:1 and 2.6:1, fails AA even for large text) |
| `--ink` | `#241A33` | All body and heading text. Deep aubergine instead of black so the purple family stays coherent |
| `--mist` | `#F5F2F8` | Alternate section background (Why MNV) |
| `--line` | `#E4DEEB` | Hairlines and input borders |
| `--white` | `#FFFFFF` | Page background |

Check every text and background pair against WCAG AA (4.5:1 body, 3:1 large text). Every visible text must pass on its own. Do not use `aria-hidden` or similar tricks to excuse low contrast.

### Type
- Urbanist for everything except testimonial quotes, which use Cormorant Garamond Italic (self-hosted, one weight). Urbanist weights 300, 400, 600 and 700 are in use (500 is not shipped). They are static instances, not the variable font: the variable font made the first layout about twice as slow because every non-default weight forces per-glyph interpolation
- Scale (fluid with `clamp`): display 56 to 112px, h1 36 to 56px, h2 28 to 40px, h3 20 to 24px, body 17 to 18px, small 14px
- Body line-height 1.6, headings 1.1 to 1.2, line length under 72 characters
- Sentence case for all headings, buttons and labels

### Layout
- Max content width 1200px, 24px side padding on mobile, 40px on desktop
- Section vertical padding `clamp(72px, 10vw, 140px)`
- Text is left aligned throughout. Only the contact band heading may be centred.
- Logo: 56px high on desktop, 40px high on mobile in the header. The footer logo is about 96px high at all widths, so the MNV ASSOCIATES wordmark is readable at least once on the page (`logo-footer.webp`, exported 192px high)
- Radius hierarchy (do not use one radius everywhere): buttons and chips fully rounded, panels and form 20px, images 8px

### Motion (premium pass)
1. Hero: full-bleed and always inside one screen (100svh, header overlays it). Text sizes use both width and height clamps so it fits 1366x625, 1280x720, 1440x780, 1536x730, 1920x960, 390x750 and 375x600. Background is New-Home-1 under a deep purple gradient overlay with subtle film grain, scaling from 1.06 to 1 over 1.6s. The tagline reveals line by line from behind a clip mask, then the H1, text and CTAs. A scroll cue (thin line with a travelling dot) sits at the bottom. Desktop only: background parallax of at most 12px following the cursor.
2. Fluid type everywhere with clamp(). Section H2 max about 52px and never above 7vh. Section headings use weight contrast: first line light (300), second line bold (700).
3. Adaptive glass header, 80px desktop and 64px mobile. Transparent with white logo and links over the hero, frosted glass (blur 20px, saturate 160%) after 80px of scroll. Each section declares `data-header-theme` light or dark and the glass tint crossfades over 300ms to match the section under the header.
4. Scroll motion is reversible and scroll-linked: CSS scroll-driven animations (`animation-timeline: view()`) are the main engine, with an IntersectionObserver fallback that toggles a class on enter and removes it when leaving downwards. Elements reach full opacity and position by about 35% into the viewport. Headings rise from a mask, left and right columns slide in from their side, images wipe with a clip-path and scale, cards stagger, stats count up once, and the services intro and Why MNV statement fill word by word. A thin purple progress bar sits at the top of the page. Entering animations use `animation-fill-mode: backwards` so hover effects still work afterwards.
5. The line-and-dot motif is MNV's: tabs sit on a purple line with a dot that slides to the active pillar, rows grow a line with a travelling dot on hover, and Why MNV has a vertical line with a dot that tracks scroll.
6. Every button has a hover state, all inside `@media (hover: hover)`, with press state scale 0.98 and focus-visible mirroring hover. Animate only transform, opacity and clip-path.
7. Every image zooms inside an overflow-hidden 8px frame on hover and the frame never resizes.
8. Contact band has an interactive dot grid and drifting lilac glows behind a glass form card. One shared, rAF-throttled pointermove listener serves the hero parallax and the dot grid and is disabled on touch.
9. Floating WhatsApp and chat buttons appear after the hero and hide while the contact section is in view.
10. Under `prefers-reduced-motion` everything is static and fully visible with no scroll-linked motion.
- `backdrop-filter` is limited to the header, buttons, floating actions and at most 3 panels. No animation libraries.

### The one bold thing
The lowercase tagline `unlock your growth` set very large in the hero, in `--brand`, is the signature element. Around it the design is elegant and confident: deep purple gradients and glass are allowed in the hero, header, buttons and contact band, with soft purple shadows only on hover.

### Do not use (they read as templated)
- ALL CAPS eyebrow labels above headings
- Numbered markers (01 / 02 / 03) unless the content is a real sequence
- Identical rounded cards with the same soft shadow for every section
- Highlighting one word of a headline in a different colour (weight contrast between two lines is the house style instead)
- Lilac text on white or `--mist` (lilac is allowed on `--ink` and on the purple contact band at large sizes), or `aria-hidden` used to dodge a contrast failure
- Carousels, sliders, autoplay video
- Hiding text from users while they read it: every element must be fully visible by about 35% into the viewport

## 4. Keeping the hint of the current site

These carry over so the page reads as an evolution of MNV, not a stranger:
1. The lowercase `unlock your growth` tagline as the hero signature
2. The current site hero photograph (`New-Home-1.jpg`, the same tower as the old `home.jpg` but supplied at 1600px wide) used in a 4:5 portrait image panel
3. The heading "How can we assist you?" for the services section
4. The three pillars: Taxation, Advisory, Business Process Solutions, with their existing one-line descriptions
5. The CIRCLE values (Collaboration, Integrity, Responsibility, Credibility, Leadership, Excellence) from the About page, used in Why MNV
6. Their real client testimonials, cleaned of stray line breaks
7. "Start a conversation" kept as the primary CTA wording

## 5. Functional rules: interactive, but not linked to any other page

The page must have no dead clicks. Every clickable element does something on this page.

| Element | Behaviour |
|---|---|
| Nav items | Smooth scroll to their section (`#services`, `#why-mnv`, `#insights`, `#contact`) |
| Services mega menu | The Services nav item opens the menu on click and hover (it does not scroll; a "View all services" link in the panel scrolls to `#services`). Closes on Esc, outside click and when focus leaves. Clicking a service scrolls to `#services`, switches to that pillar's tab and highlights the service. On mobile the same markup is an inline accordion |
| Header CTA "Start a conversation" | Scrolls to `#contact` and focuses the first form field |
| Service tabs | Accessible tablist (arrow keys work). Each service row expands to show its description |
| Who we help chips | Selecting a chip shows the services most relevant to that audience |
| CIRCLE values | Six selectable letters. Selecting one shows that value's text. Arrow keys work. |
| Insight cards | Open an accessible modal with the article summary (focus trap, Esc closes, focus returns to the card) |
| Contact form | Client-side validation with inline errors, then a success state. No backend. Optionally post to Formspree if an endpoint is set in `.env` |
| Phone, email, WhatsApp | Real `tel:`, `mailto:` and `https://wa.me/` links |
| Social icons | External links to MNV's real profiles, opening in a new tab |
| Logo | Scrolls to top |

Never link to any page on mnvassociates.com. Never use `href="#"`.

## 6. Tech stack and constraints

- Next.js (latest stable, App Router, TypeScript) with Tailwind CSS
- `output: 'export'` for a static build, deployed to Vercel
- `next/font/local` for Urbanist, using the static latin files in `app/fonts/` (downloaded from Google Fonts by `scripts/fetch-fonts.mjs`, OFL licence). No external font requests
- `next/image` with `images: { unoptimized: true }` (required for static export), so images must be pre-optimised to WebP at the right sizes during Phase 0
- No UI component libraries, no animation libraries, no jQuery. Ask before adding any dependency other than `sharp` (dev only).
- This is Next.js 16.4, which differs from older versions. Before writing code against an API you are unsure of, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices. `next.config.ts` keeps `cacheComponents` and `partialPrefetching` off (they fail with `output: 'export'`) and sets `agentRules: false` so `next dev` does not regenerate `AGENTS.md`.
- Single DOM: one responsive layout. Never render separate mobile and desktop copies of a section (this is a key flaw of the current site).
- Exactly one `<h1>` on the page. Section titles are `<h2>`.
- All copy lives in `lib/content.ts`. Components never hard-code text.
- Proper metadata: title, description, Open Graph tags, favicon, canonical set to the deployed URL.

### Performance decisions (Phase 9)
- The hero image ships as AVIF (`hero-400.avif`, `hero-682.avif`) inside a `<picture>` with the WebP files as fallback, and is preloaded in `<head>` with `preload()` from `react-dom` because the preload scanner does not find images inside `<picture>`
- Every section below the hero uses `content-visibility: auto` (the `defer-render` utility) with a per-breakpoint `--defer-h` size estimate. `goTo` in `lib/navigation.ts` re-measures across frames and corrects the scroll position after jumping to a deferred section
- `experimental.inlineCss` is on in `next.config.ts` so the small Tailwind stylesheet arrives with the HTML
- Do not start the hero entrance animation above `opacity: 0`: it would keep text off the LCP and FCP candidates, but text at partial opacity fails the colour contrast audit

### Performance and quality targets
- Lighthouse mobile: Performance 95+, Accessibility 100, Best Practices 100, SEO 100
- LCP image marked `priority`, everything else lazy
- No layout shift: every image has width and height
- Visible keyboard focus everywhere (2px `--brand` outline with 2px offset)
- Works at 360, 375, 768, 1024, 1280 and 1440px with no horizontal scroll

## 7. File structure

```
MNVassignment/            (project root, scaffolded in place)
  CLAUDE.md
  README.md
  next.config.ts
  app/
    layout.tsx         font, metadata, skip link
    fonts/             static Urbanist woff2 files (400, 600, 700)
    page.tsx           assembles sections in order
    globals.css        tokens, base styles
  components/
    Header.tsx
    MegaMenu.tsx
    MobileNav.tsx
    Hero.tsx
    Services.tsx       tablist + expandable rows
    WhoWeHelp.tsx      OPTIONAL
    WhyMnv.tsx         stats + CIRCLE selector
    Insights.tsx
    InsightModal.tsx   OPTIONAL (cards can be static)
    Testimonials.tsx
    Contact.tsx        form + office details
    Footer.tsx
  lib/
    content.ts         all copy
    navigation.ts      goTo (scroll and focus), scrollToTop, CONTACT_FIRST_FIELD_ID
    service-selection.ts  shared store: mega menu and footer pick a pillar or service, Services reads it
    tabs.ts            arrow, Home and End key handling shared by the tab-like widgets
  assets-raw/            raw downloads from the live site, git-ignored, never deployed
  public/
    images/            optimised WebP assets, manifest.json, og-image.jpg, favicon.png
  scripts/
    fetch-assets.mjs   downloads and optimises images from mnvassociates.com
    fetch-fonts.mjs    downloads Urbanist 300/400/600/700 and Cormorant Garamond Italic into app/fonts/
```

## 8. Content (pulled from mnvassociates.com, lightly cleaned)

Use this verbatim in `lib/content.ts`. Fix only whitespace, line breaks and obvious typos.

### Meta
- Title: `MNV Associates | Tax, Advisory and Business Process Solutions in Dubai`
- Description: `Tax, advisory and business process solutions for startups, SMEs and multinational corporations across the UAE. unlock your growth with MNV Associates.`

### Hero
- Signature line: `unlock your growth`
- H1: `Tax, advisory and business process solutions for growing UAE businesses`
- Supporting text (from the site): `We are a prominent firm in the UAE, offering extensive expertise in Advisory and Tax services. Our team of professionals deeply understands your financial goals, ensuring that every decision made leads to your desired success.`
- Primary CTA: `Start a conversation` (scrolls to contact)
- Secondary CTA: `Explore services` (scrolls to services)
- Image: `New-Home-1.jpg`, cropped to a 4:5 portrait at full height (682x853) with the tower centred. The panel is capped at about 460px display width on desktop (420px between 1024px and 1279px so the tagline keeps two lines) so the image stays sharp on retina. It is a plain `<img>` with `srcSet` and `sizes`, because `next/image` drops `srcSet` when images are unoptimized `home.jpg` is not used (it is only 393x601)

### Services (`#services`)
- H2: `How can we assist you?`
- Intro (from the site): `Our main expertise lies in optimising processes and streamlining financial operations within organisations. We offer comprehensive assistance to SMEs, startups and multinational corporations.`

The assignment's nine services, grouped into MNV's three pillars:

| Pillar | Pillar line (from the site) | Services |
|---|---|---|
| Taxation | The finest solutions for transacting with tax authorities; reduce, save and conform like never before. | Corporate Tax, VAT, Transfer Pricing |
| Advisory | Informed decision making through strategic insights, expert guidance and thorough due diligence. | Business Setup, Compliance, Business Advisory |
| Business Process Solutions | Optimise efficiency and streamline operations to drive growth and attain the desired organisational structure. | Accounting, CFO Advisory, HR Advisory |

Under each pillar, show a quieter "Also" line with the rest of MNV's services:
- Taxation, also: Excise Tax, International Tax
- Advisory, also: Bank Advisory, Mergers & Acquisitions, IFRS Advisory
- Business Process Solutions, also: Payroll Management, Secondment, ERP Implementation

Service descriptions: in Phase 0, fetch each source page below and take its meta description, trimmed to one or two sentences.

Business Setup and Compliance share one source page, so write two distinct one to two sentence descriptions from it, using only facts stated on that page. Business Setup covers company incorporation, licensing and free zone or mainland setup. Compliance covers ongoing regulatory and statutory obligations after setup.

| Service | Source page |
|---|---|
| Corporate Tax | https://mnvassociates.com/services/taxation/corporate-tax-service/ |
| VAT | https://mnvassociates.com/services/taxation/value-added-tax/ |
| Transfer Pricing | https://mnvassociates.com/services/taxation/transfer-pricing-service/ |
| Business Setup | https://mnvassociates.com/services/advisory/company-incorporation-compliance/ |
| Compliance | https://mnvassociates.com/services/advisory/company-incorporation-compliance/ |
| Business Advisory | https://mnvassociates.com/services/advisory/ |
| Accounting | https://mnvassociates.com/services/business-process-solutions/accounting-services/ |
| CFO Advisory | https://mnvassociates.com/services/business-process-solutions/fractional-cfo-bps/ |
| HR Advisory | https://mnvassociates.com/services/business-process-solutions/hr-advisory/ |

### Who we help (OPTIONAL, `#who-we-help`)
- H2: `Who we work with`
- Line (from the site): `From startups and SMEs to multinational corporations, with an industry network and venture capital connections that add value beyond the numbers.`
- Chips and their highlighted services (editable):
  - Startups: Business Setup, Accounting, CFO Advisory
  - SMEs: VAT, Corporate Tax, HR Advisory
  - Multinational corporations: Transfer Pricing, Compliance, Business Advisory

### Why MNV (`#why-mnv`)
- H2: `We grow as you grow`
- Stats: `100+` clients served, `10+` years of experience
- Credentials line (from About): `Chartered Accountants, tax professionals and financial advisors working as one partner-led team.`
- Three differentiators (from the site):
  - Unmatched expertise: `You can focus more on the core activities as we help you save valuable time handling the financial front of your business.`
  - Client first approach: `We design customised strategies that drive tangible results through transparent communication, proactive collaboration and unwavering dedication.`
  - Transformative solutions: `We leverage advanced accounting software, analytics tools and automation solutions to deliver timely, accurate and insightful guidance for enhanced decision-making.`
- CIRCLE values (from About). Intro: `The CIRCLE is how we work.`
  - Collaboration: `Collaborative teamwork is at the heart of our approach. By working closely with our clients and within our team, we harness diverse perspectives to deliver tailored solutions that address unique challenges.`
  - Integrity: `We uphold honesty, transparency and ethical conduct in all our interactions, maintaining confidentiality and adhering to the highest professional standards.`
  - Responsibility: `We are dedicated to fulfilling our commitments, meeting deadlines and delivering on our promises.`
  - Credibility: `Our track record shows our expertise, reliability and consistent delivery of quality services. We strive to be a partner clients can rely on for accurate advice and effective solutions.`
  - Leadership: `Through continuous learning, innovative thinking and visionary guidance, we aim to set new benchmarks and inspire confidence in our clients and partners.`
  - Excellence: `From the quality of our work to the calibre of our team, we are committed to surpassing expectations and achieving outstanding results.`
- Partners (from About), shown small under the CIRCLE:
  - Vinay Venkat, Managing Partner
  - Mohammed Noaman Khan, Senior Partner

### Insights (`#insights`)
- H2: `Latest insights`
- Intro: `Stay informed about the news, updates and events that matter to your business.`
- Cards (category, date, title). In Phase 0, fetch each article, take its first paragraph as the modal summary, and compute read time as words divided by 200, rounded up.

Insight source URLs are probably the real WordPress slugs even where they look malformed. Use them only as fetch sources and keep the titles in this table in the UI. If a URL returns 404, report it and show that card's title only, with no summary.

| Title | Date | Categories | Source |
|---|---|---|---|
| Why Dubai start-ups need professional financial setup from day one | 02 Jan 2026 | Advisory, Business Process Solutions | https://mnvassociates.com/why-dubai-start-ups-need-professional-financial-setup-from-day-one/ |
| Why CFO services in Dubai are in high demand among startups and SMEs | 31 Dec 2025 | Advisory, Business Process Solutions | https://mnvassociates.com/why-cfo-services-in-dubai-are-in-high-demand-amongstartups-smes/ |
| Financial compliance roadmap: your first 90 days after Dubai business setup | 25 Dec 2025 | Advisory, Business Process Solutions, Taxation | https://mnvassociates.com/financial-compliance-roadmap-your-first-90-daysafter-dubai-business-setup/ |

### Testimonials (`#testimonials`)
- H2: `Partnering to deliver exceptional outcomes`
- Show three by default in a static grid at every width, with a "Show more" button revealing the other three. Once expanded, the button reads "Show less". No slider.

1. "Partnering with MNV has been a game-changer for my business. Their expertise in accounting and tax planning not only saved us money but also provided us with invaluable guidance for growth. The team's approach and commitment are truly commendable." Abdalla Al Mulla, CEO, Behind The Cup (BTC) Group
2. "From tax preparation to financial planning, the team at MNV Associates provided tailored solutions that aligned with our goals and priorities. Their professionalism and genuine care for clients' successes makes them my go-to resource for all financial assistance." Rushin Patel, Group Finance Director, Fundamental Hospitality DIFC
3. "I have been working with MNV Associates for several years now, and I couldn't be happier with their tax services. The team is highly professional and knowledgeable, and they have consistently provided me with accurate tax advice and support." Janet Fernandes, Finance & Administration Manager, IHC Holland LLC
4. "I highly recommend MNV Associates to anyone in need of accounting and tax services. Their expertise, attention to detail and dedication to client satisfaction make them a leading business in the UAE." Tumar Boranbayeva, Owner, BTT Rent A Car
5. "I recommend MNV Associates to anyone seeking taxation and financial services. Their commitment to client satisfaction makes them a trusted and reliable partner." Sheikh Ali bin Taleb Al Qasimi, CEO, Rak Petroleum
6. "MNV Associates have extensively helped us simplify our payroll management and HR processes. Their expertise and guidance have not only simplified our operations but have also allowed us to optimise our productivity." Aravindaksha K. Menon, CEO, Trion Surfactants & Trent International

### Contact (`#contact`)
- H2: `Let's find a solution that fits your needs`
- Line: `Get in touch today and find a solution that's right for you.`
- Form fields: Full name (required), Work email (required, valid format), Phone (required, digits, spaces and + only), Service you need (select: the nine services plus "Not sure yet"), Message (optional, max 1000 characters)
- Submit button: `Send message`. Success state: `Thanks, your message has been sent. Our team will reply within one working day.`
- Error copy explains the fix, for example `Enter an email address like name@company.com`
- Office details beside the form:
  - Office 706, Sobha Ivory II, Business Bay, Dubai, United Arab Emirates
  - +971 56 375 0931 (`tel:+971563750931`)
  - +971 4 576 7094 (`tel:+97145767094`)
  - WhatsApp: `https://wa.me/971563750931`. The README must note that the live site points WhatsApp to the landline and this concept uses the mobile number as an assumption
  - info@mnvassociates.com
  - Monday to Friday, 9:00 to 18:00

### Footer
- Logo, tagline `unlock your growth`
- Columns: Services (three pillars, scroll to `#services` with that tab), Company (Why MNV, Insights, Contact), Contact details, Social
- Social links:
  - LinkedIn: https://www.linkedin.com/company/mnv-associates
  - Facebook: https://www.facebook.com/mnvassociates/
  - X: https://twitter.com/mnvassociates
  - YouTube: https://www.youtube.com/channel/UC1aCGWdyUzk0WnB8oAMmcqA/featured
  - Instagram: https://www.instagram.com/mnvassociates/
- Bottom line: `© 2026 MNV Associates. All rights reserved.`

## 9. Assets (from mnvassociates.com)

Known URLs:
- Logo: https://mnvassociates.com/wp-content/uploads/2026/05/MNV.png (the file is 1600x1042; trim transparent space with a trim threshold of 40, which also removes faint specks, and export 112px high for the header and 192px high for the footer). The header shows it 56px high on desktop and 40px high on mobile, so the export is 2x at desktop size
- Hero image: https://mnvassociates.com/wp-content/uploads/2024/07/New-Home-1.jpg (1600x853)
- Favicon source: https://mnvassociates.com/wp-content/uploads/2026/05/cropped-MNV-1-270x270.png

Other images (partner photos, insight thumbnails) load lazily on the live site. `scripts/fetch-assets.mjs` must collect them:
1. Fetch the HTML of the homepage, `/about-us/`, `/insights/` and each insight article URL
2. Extract every `wp-content/uploads` URL from `src`, `data-src`, `data-lazy-src`, `srcset` and `og:image`
3. Download the ones needed (logo, hero, two partner photos, three insight featured images) into `assets-raw/` at the project root. `assets-raw/` is git-ignored and never inside `public/`, so nothing unoptimised is deployed
4. Use `sharp` to output WebP into `public/images/` at these widths: hero 682 and 400 (4:5 crop, full height), insight cards 800 and 400 (4:3 crops), partners 320, logo 112px high and footer logo 192px high, plus `og-image.jpg` at 1200x630 for Open Graph. The script clears `public/images/` before each run
5. Write a `public/images/manifest.json` with filename, width and height for each output

If an image cannot be found, fall back to a solid `--mist` panel. Never use stock placeholder services or lorem ipsum.

## 10. Page layout

Desktop wireframe:
```
+------------------------------------------------------------------+
| [MNV logo]   Services v  Why MNV  Insights  Contact  [Start a conversation] |
+------------------------------------------------------------------+
|                                                                  |
|  unlock your growth                         +------------------+ |
|  (display, brand purple, very large)        |                  | |
|                                             |  New-Home-1.jpg  | |
|  H1 Tax, advisory and business process      |    cropped       | |
|     solutions for growing UAE businesses    |                  | |
|  Supporting text                            +------------------+ |
|  [Start a conversation]  Explore services                        |
+------------------------------------------------------------------+
|  How can we assist you?                                          |
|  [Taxation] [Advisory] [Business Process Solutions]   <- tabs    |
|  Pillar line                                                     |
|  Corporate Tax ........................................ +        |
|  VAT .................................................. +        |
|  Transfer Pricing ..................................... +        |
|  Also: Excise Tax, International Tax                             |
+------------------------------------------------------------------+
|  Who we work with   (Startups) (SMEs) (Multinationals)  OPTIONAL |
+------------------------------------------------------------------+
|  mist background                                                 |
|  We grow as you grow          100+ clients   10+ years           |
|  3 differentiators in a row                                      |
|  C  I  R  C  L  E   <- selectable letters, text below            |
|  Partners: Vinay Venkat, Mohammed Noaman Khan                    |
+------------------------------------------------------------------+
|  Latest insights                                                 |
|  [card]  [card]  [card]                                          |
+------------------------------------------------------------------+
|  Partnering to deliver exceptional outcomes                      |
|  quote   quote   quote          Show more                        |
+------------------------------------------------------------------+
|  brand purple background                                         |
|  Let's find a solution that fits your needs                      |
|  [ form                      ]   Office details                  |
+------------------------------------------------------------------+
|  Footer: 4 columns, social, copyright                            |
+------------------------------------------------------------------+
```

On mobile, everything stacks in the same order; the hero image sits below the CTAs, the service tabs become a horizontally scrollable tablist, cards stack to one column.

## 11. Execution plan

Work one phase at a time. At the end of each phase: run `npm run build`, fix every error and warning, check the result at 375px and 1280px, then stop and summarise what was done before starting the next phase.

### Phase 0: Setup and assets (20 min)
1. `npx create-next-app@latest . --ts --tailwind --app --eslint --no-src-dir` inside `MNVassignment`. If it refuses because the folder is not empty, move `CLAUDE.md` out temporarily, run it, then move `CLAUDE.md` back to the root
2. Set `output: 'export'` and `images: { unoptimized: true }` in `next.config.ts`
3. Install `sharp` as a dev dependency
4. Write and run `scripts/fetch-assets.mjs` (section 9)
5. Fetch service and article pages to fill in service descriptions, article summaries and read times (section 8)
- Done when: `public/images/` has optimised WebP files and `manifest.json`

### Phase 1: Foundations (15 min)
1. Add colour tokens and base styles to `globals.css`
2. Load Urbanist with `next/font`
3. Set metadata, favicon and a skip link in `layout.tsx`
4. Create `lib/content.ts` with all copy from section 8
5. Create empty section components with correct ids and render them in `page.tsx`
- Done when: the page builds with all section anchors in place and one `<h1>` placeholder

### Phase 2: Header, mega menu, mobile nav (25 min)
1. Sticky header, white with a hairline bottom border after scrolling
2. Mega menu with three pillar columns, keyboard accessible, closes on Esc and outside click
3. Mobile: hamburger opens a full-height panel with the same items, body scroll locked while open
4. All items scroll to anchors; service items set the active tab via shared state or URL hash
- Done when: everything works by mouse, keyboard and touch

### Phase 3: Hero (20 min)
1. Two columns on desktop: tagline, H1, text and CTAs on the left, cropped `New-Home-1.jpg` (`hero-682.webp`, `hero-400.webp`) on the right
2. Tagline set as the display element per section 3
3. Hero load sequence, disabled under reduced motion
4. Hero image `priority`, with a `srcSet` of `hero-400.webp` and `hero-682.webp` and a proper `sizes` attribute so 2x phones get the sharper file
- Done when: the hero looks finished on both widths and LCP is the hero image or H1

### Phase 4: Services (25 min)
1. Accessible tablist for the three pillars
2. Each service is an expandable row with its description
3. "Also" line under each pillar
4. Responds to mega menu and footer selections
- Done when: tabs and rows work with keyboard and touch

### Phase 5: Why MNV and Who we help (25 min)
1. Stats, credentials line and three differentiators on `--mist`
2. CIRCLE selector: six letters as buttons forming the word, selected value text below
3. Partner names, with photos if Phase 0 found them
4. OPTIONAL: Who we help chips with highlighted services
- Done when: the CIRCLE selector works by keyboard

### Phase 6: Insights (20 min)
1. Three cards: image, category, date, read time, title
2. OPTIONAL: modal with summary, focus trap, Esc to close
- Done when: cards lay out cleanly at every width

### Phase 7: Testimonials (10 min)
1. Three quotes in a static grid, "Show more" reveals the rest
- Done when: no stray line breaks, every quote has opening and closing marks

### Phase 8: Contact and footer (25 min)
1. Form with validation, inline errors, success state. The form sits on the purple band: inputs are white fills with a 2px white focus outline, and error text is white with an icon (never red on purple), checked at 4.5:1
2. Optional Formspree submission via `NEXT_PUBLIC_FORMSPREE_ENDPOINT`
3. Office details with working `tel:`, `mailto:` and WhatsApp links
4. Footer per section 8
- Done when: submitting with bad input shows clear errors and good input shows the success state

### Phase 9: QA and deploy (25 min)
1. Check 360, 375, 768, 1024, 1280 and 1440px for overflow and spacing
2. Keyboard-only pass through the whole page
3. Lighthouse mobile and desktop; fix anything under target
4. Confirm: one H1, no `href="#"`, no links to mnvassociates.com pages, no em dashes, tagline always lowercase
5. Deploy to Vercel and test the live URL on a real phone
- Done when: live URL works and Lighthouse scores are recorded in the README

## 12. Working rules for Claude Code

- Follow this file over your own defaults. If something here conflicts with a request in chat, ask.
- Do not add sections, pages or dependencies that are not listed here.
- Keep components small and readable. No dead code, no commented-out blocks.
- Before marking any phase done, re-check the "Do not use" list in section 3 and the functional rules in section 5.
