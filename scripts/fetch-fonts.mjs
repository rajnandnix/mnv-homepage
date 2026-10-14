import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const FONTS = [
  { file: "urbanist-300.woff2", query: "Urbanist:wght@300" },
  { file: "urbanist-400.woff2", query: "Urbanist:wght@400" },
  { file: "urbanist-600.woff2", query: "Urbanist:wght@600" },
  { file: "urbanist-700.woff2", query: "Urbanist:wght@700" },
  { file: "cormorant-garamond-italic-400.woff2", query: "Cormorant+Garamond:ital,wght@1,400" },
];
const OUT = path.resolve(import.meta.dirname, "..", "app", "fonts");
const HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
};

await mkdir(OUT, { recursive: true });

for (const { file, query } of FONTS) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${query}&display=swap`, { headers: HEADERS })
  ).text();
  const latin = css.match(/\/\* latin \*\/[^}]*\}/)?.[0];
  const url = latin?.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  if (!url) throw new Error(`No latin woff2 found for ${file}`);
  const data = Buffer.from(await (await fetch(url, { headers: HEADERS })).arrayBuffer());
  await writeFile(path.join(OUT, file), data);
  console.log(`${file}  ${(data.length / 1024).toFixed(1)} KB`);
}
