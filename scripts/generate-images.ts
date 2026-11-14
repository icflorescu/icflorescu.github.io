// Generates the favicon set and the social image in public/, from the mark in src/assets/mark/.
// Run it after changing the mark or the social image design, and commit the output:
//   bun run generate-images
// (needs Playwright's Chromium: `bunx playwright install chromium` once)

import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const root = new URL('../', import.meta.url);
const path = (relative: string) => new URL(relative, root);
const read = (relative: string) => readFileSync(path(relative), 'utf8');

const light = read('src/assets/mark/icf-light.svg');

// 1. icon.svg: the browser-tab icon. At 16px the full drawing doesn't read, so the small variant is rebuilt
//    from its parts: the sticky note without the dashed selection box, cropped to fill the square, and the
//    letters drawn solid with a thicker outline, centered on the note. It keeps the yellow note
//    and dark letters in both color schemes: that's what stands out on a light or a dark tab bar.
const note = light.match(/<path d="[^"]*" fill="#FFE52E"\/>/)?.[0];
const letters = light.match(/<path id="stroke1[^"]*" d="([^"]*)"/)?.[1];
if (!note || !letters) {
  throw new Error('The mark drawing changed: update the small icon variant in scripts/generate-images.ts');
}
const small = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="5 6 76 76">
${note}
<path d="${letters}" fill="#1A1A18" stroke="#1A1A18" stroke-width="3" stroke-linejoin="round" paint-order="stroke" transform="translate(5 7)"/>
</svg>
`;
writeFileSync(path('public/icon.svg'), small);

const dataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const mark = dataUri(light);
const smallMark = dataUri(small);

// Fonts are inlined as data URIs: a page created with setContent can't load file:// URLs.
const fontUrl = (pkg: string, file: string) =>
  `data:font/woff2;base64,${readFileSync(path(`node_modules/@fontsource-variable/${pkg}/files/${file}`)).toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage();

async function render(html: string, width: number, height: number, transparent = true) {
  await page.setViewportSize({ width, height });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: Display; src: url('${fontUrl('bricolage-grotesque', 'bricolage-grotesque-latin-ext-wght-normal.woff2')}'); font-weight: 200 800; unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
    @font-face { font-family: Display; src: url('${fontUrl('bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2')}'); font-weight: 200 800; }
    @font-face { font-family: Body; src: url('${fontUrl('inter', 'inter-latin-ext-wght-normal.woff2')}'); font-weight: 100 900; unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
    @font-face { font-family: Body; src: url('${fontUrl('inter', 'inter-latin-wght-normal.woff2')}'); font-weight: 100 900; }
    html, body { margin: 0; width: ${width}px; height: ${height}px; background: transparent; }
  </style></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);
  return page.screenshot({ omitBackground: transparent, type: 'png' });
}

const icon = (size: number, padding = 0, background = 'transparent', src = mark) =>
  render(
    `<div style="width:${size}px;height:${size}px;background:${background};display:grid;place-items:center">
      <img src="${src}" style="width:${size - 2 * padding}px;height:${size - 2 * padding}px">
    </div>`,
    size,
    size,
    background === 'transparent'
  );

// 2. PNG icons
writeFileSync(path('public/apple-touch-icon.png'), await icon(180, 14, '#faf8f3'));
writeFileSync(path('public/icon-192.png'), await icon(192, 4));
writeFileSync(path('public/icon-512.png'), await icon(512, 10));
// Maskable icons get cropped to a circle or squircle: keep the mark inside the central 80% safe zone.
writeFileSync(path('public/icon-maskable-512.png'), await icon(512, 72, '#faf8f3'));

// 3. favicon.ico, from the small variant, with 16, 32 and 48px PNG images inside (supported by every browser that still asks for it)
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => icon(size, 0, 'transparent', smallMark)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map((image, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(sizes[i]!, 0); // width
  entry.writeUInt8(sizes[i]!, 1); // height
  entry.writeUInt8(0, 2); // palette size
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(image.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += image.length;
  return entry;
});
writeFileSync(path('public/favicon.ico'), Buffer.concat([header, ...entries, ...images]));

// 4. Social image, 1200×630, in the site's dark theme (the light-dark() tokens' dark values in global.css)
const darkMark = dataUri(read('src/assets/mark/icf-dark.svg'));
const avatar = Buffer.from(
  await (await fetch('https://avatars.githubusercontent.com/u/581999?v=4&s=460')).arrayBuffer()
).toString('base64');

const og = await render(
  `<div style="box-sizing:border-box;width:1200px;height:630px;padding:72px 80px;background:#121211;color:#c9c7bf;
      display:grid;grid-template-columns:1fr auto;gap:56px;align-items:center;font-family:Body">
    <div style="display:flex;flex-direction:column;height:100%">
      <img src="${darkMark}" style="width:112px;height:112px;margin:-8px 0 0 -6px">
      <div style="font-family:Display;font-weight:700;font-size:68px;line-height:1.05;letter-spacing:-0.03em;margin-top:40px">
        Ionuț-Cristian Florescu
      </div>
      <div style="font-family:Display;font-weight:500;font-size:36px;line-height:1.25;letter-spacing:-0.015em;margin-top:20px;color:#c9c7bf">
        Hands-on <span style="background:linear-gradient(transparent 58%, #5d531b 58%, #5d531b 92%, transparent 92%)">fractional CTO</span>,
        product builder and open-source author
      </div>
      <div style="margin-top:auto;font-size:24px;color:#8d8b84;display:flex;gap:16px">
        <span style="font-weight:600;color:#c9c7bf">icflorescu.github.io</span><span>·</span><span>Creator of Mantine DataTable</span>
      </div>
    </div>
    <div style="position:relative;width:330px;height:330px;margin:14px 14px 0 0">
      <div style="position:absolute;inset:-18px 18px 18px -18px;border:4px dashed #8b8a83;border-radius:28px"></div>
      <!-- As on the site in dark mode: photo and backing lifted 0.25rem (5px at this size) above the frame, and a
           border drawn inside the photo's edge to set it off the page -->
      <div style="position:absolute;inset:0;background:#5d531b;border-radius:22px;transform:translateY(-5px) rotate(2.5deg)"></div>
      <img src="data:image/jpeg;base64,${avatar}" style="position:absolute;inset:0;width:330px;height:330px;border-radius:22px;transform:translateY(-5px) rotate(2.5deg) translate(-10px,-10px)">
      <div style="position:absolute;inset:0;border-radius:22px;box-sizing:border-box;border:3px solid #45443e;transform:translateY(-5px) rotate(2.5deg) translate(-10px,-10px)"></div>
    </div>
  </div>`,
  1200,
  630,
  false
);
writeFileSync(path('public/og.png'), og);

await browser.close();
process.stdout.write('Generated public/icon.svg, favicon.ico, apple-touch-icon.png, icon-*.png and og.png\n');
