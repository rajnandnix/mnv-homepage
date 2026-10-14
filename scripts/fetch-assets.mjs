import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SITE = "https://mnvassociates.com";
const UPLOADS = `${SITE}/wp-content/uploads`;
const HEADERS = { "user-agent": "Mozilla/5.0" };

const PAGES = ["/", "/about-us/", "/insights/"];
const ARTICLES = [
  {
    key: "financial-setup",
    path: "/why-dubai-start-ups-need-professional-financial-setup-from-day-one/",
    focus: 0.5,
  },
  {
    key: "cfo-services",
    path: "/why-cfo-services-in-dubai-are-in-high-demand-amongstartups-smes/",
    focus: 0.5,
  },
  {
    key: "compliance-roadmap",
    path: "/financial-compliance-roadmap-your-first-90-daysafter-dubai-business-setup/",
    focus: 0.9,
  },
];
const PARTNERS = [
  { key: "vinay-venkat", name: "Vinay Venkat" },
  { key: "mohammed-noaman-khan", name: "Mohammed Noaman Khan" },
];
const KNOWN = {
  logo: `${UPLOADS}/2026/05/MNV.png`,
  hero: `${UPLOADS}/2024/07/New-Home-1.jpg`,
  favicon: `${UPLOADS}/2026/05/cropped-MNV-1-270x270.png`,
};

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "images");
const RAW = path.join(ROOT, "assets-raw");

const CARD_ASPECT = 4 / 3;
const HERO_ASPECT = 4 / 5;
const HERO_FOCUS = 0;
const WEBP_QUALITY = 74;
const AVIF_QUALITY = 50;
const OG_SIZE = { width: 1200, height: 630 };
const LOGO_DISPLAY_HEIGHT = 56;
const FOOTER_LOGO_DISPLAY_HEIGHT = 96;

const ATTRIBUTE = /\b(?:src|data-src|data-lazy-src|srcset|data-srcset)=["']([^"']+)["']/gi;
const OG_IMAGE = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi;
const UPLOAD_URL = /https?:\/\/[^\s"',]+\/wp-content\/uploads\/[^\s"',]+\.(?:jpe?g|png|webp)/gi;

const originalOf = (url) => url.replace(/-\d+x\d+(?=\.\w+$)/, "");

async function fetchText(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function uploadUrls(html) {
  const found = new Set();
  for (const regex of [ATTRIBUTE, OG_IMAGE]) {
    for (const [, value] of html.matchAll(regex)) {
      for (const [url] of value.matchAll(UPLOAD_URL)) found.add(url);
    }
  }
  return found;
}

function imageBefore(html, text) {
  const at = html.indexOf(`<p>${text}</p>`);
  if (at < 0) throw new Error(`"${text}" not found on the about page`);
  const urls = [...html.slice(0, at).matchAll(UPLOAD_URL)];
  return originalOf(urls.at(-1)[0]);
}

async function download(url, name) {
  const file = path.join(RAW, name);
  await writeFile(file, await fetchBuffer(url));
  return file;
}

const manifest = [];

async function emit(file, pipeline) {
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  await writeFile(path.join(OUT, file), data);
  manifest.push({ file, width: info.width, height: info.height });
  console.log(`${file}  ${info.width}x${info.height}  ${(data.length / 1024).toFixed(1)} KB`);
}

const ENCODERS = {
  webp: (image) => image.webp({ quality: WEBP_QUALITY, effort: 6 }),
  avif: (image) => image.avif({ quality: AVIF_QUALITY, effort: 6 }),
};

async function emitWidths(name, source, widths, format = "webp") {
  const { width } = await sharp(source).metadata();
  const usable = widths.filter((w) => w <= width);
  for (const w of usable.length ? usable : [width]) {
    const image = sharp(source).resize({ width: w, withoutEnlargement: true });
    await emit(`${name}-${w}.${format}`, ENCODERS[format](image));
  }
}

async function cropToAspect(file, aspect, focus) {
  const { width, height } = await sharp(file).metadata();
  const cropWidth = Math.min(width, Math.round(height * aspect));
  const cropHeight = Math.min(height, Math.round(width / aspect));
  const left = Math.round((width - cropWidth) * focus);
  const top = Math.round((height - cropHeight) * focus);
  return sharp(file).extract({ left, top, width: cropWidth, height: cropHeight }).toBuffer();
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await mkdir(RAW, { recursive: true });

const pages = await Promise.all([...PAGES, ...ARTICLES.map((a) => a.path)].map((p) => fetchText(SITE + p)));
const collected = new Set(pages.flatMap((html) => [...uploadUrls(html)]));
console.log(`Collected ${collected.size} unique upload URLs from ${pages.length} pages`);

const aboutHtml = pages[PAGES.indexOf("/about-us/")];
const articleHtml = pages.slice(PAGES.length);

const wanted = {
  logo: KNOWN.logo,
  hero: KNOWN.hero,
  favicon: KNOWN.favicon,
};
for (const partner of PARTNERS) {
  wanted[`partner-${partner.key}`] = imageBefore(aboutHtml, partner.name);
}
ARTICLES.forEach((article, i) => {
  const [, ogImage] = [...articleHtml[i].matchAll(OG_IMAGE)][0];
  wanted[`insight-${article.key}`] = originalOf(ogImage);
});

const raw = {};
for (const [key, url] of Object.entries(wanted)) {
  if (!collected.has(url) && !Object.values(KNOWN).includes(url)) {
    throw new Error(`${key}: ${url} was not found on any fetched page`);
  }
  raw[key] = await download(url, path.basename(url));
}

const heroCrop = await cropToAspect(raw.hero, HERO_ASPECT, HERO_FOCUS);
await emitWidths("hero", heroCrop, [682, 400]);
await emitWidths("hero", heroCrop, [682, 400], "avif");
// Full-bleed landscape background for wide screens
await emitWidths("herobg", await sharp(raw.hero).toBuffer(), [1600, 1000], "avif");
await emitWidths("herobg", await sharp(raw.hero).toBuffer(), [1600, 1000], "webp");

const og = await cropToAspect(raw.hero, OG_SIZE.width / OG_SIZE.height, 0);
await emit("og-image.jpg", sharp(og).resize(OG_SIZE).jpeg({ quality: 80, mozjpeg: true }));

const logo = await sharp(raw.logo).trim({ threshold: 40 }).toBuffer();
for (const [file, displayHeight, white] of [
  ["logo.webp", LOGO_DISPLAY_HEIGHT, false],
  ["logo-white.webp", LOGO_DISPLAY_HEIGHT, true],
  ["logo-footer-white.webp", FOOTER_LOGO_DISPLAY_HEIGHT, true],
]) {
  const sized = await sharp(logo).resize({ height: displayHeight * 2 }).png().toBuffer();
  let pipeline = sharp(sized);
  if (white) {
    const { width, height } = await sharp(sized).metadata();
    pipeline = sharp({ create: { width, height, channels: 4, background: "#ffffff" } }).composite([
      { input: sized, blend: "dest-in" },
    ]);
  }
  await emit(file, pipeline.webp({ lossless: true, effort: 6 }));
}

await emit("favicon.png", sharp(raw.favicon).png({ compressionLevel: 9 }));

for (const partner of PARTNERS) {
  await emitWidths(`partner-${partner.key}`, raw[`partner-${partner.key}`], [320]);
}

for (const article of ARTICLES) {
  const cropped = await cropToAspect(raw[`insight-${article.key}`], CARD_ASPECT, article.focus);
  await emitWidths(`insight-${article.key}`, cropped, [800, 400]);
}

manifest.sort((a, b) => a.file.localeCompare(b.file));
await writeFile(path.join(OUT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote manifest.json with ${manifest.length} images`);
