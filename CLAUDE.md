# icflorescu.github.io

The personal website of Ionuț-Cristian Florescu (GitHub: `icflorescu`): a single static page at https://icflorescu.github.io/ that advertises his services and also fixes how search engines show the whole `icflorescu.github.io` host (favicon, site name, `robots.txt`). See `README.md` for what the site says and how it's built and deployed.

Private context (content decisions, research notes, open items) lives in `CLAUDE.local.md`, which isn't committed. Read it if it's there.

## Working agreements

- Never commit unless Ionuț asks. Then make granular commits, with **no `Co-Authored-By` trailer or any other AI attribution**.
- Never create the GitHub repo, push or publish anything without asking.
- Ask about positioning, clients, pricing and anything personal (his mark, his photo). Decide the rest sensibly and say what you decided.
- Never invent facts, clients, numbers, testimonials or quotes.
- He iterates in small nudges ("a bit more", "too much"): change one value per round, rebuild, and show him the result.
- He sometimes edits files while you work: re-read a file before editing it, and never revert his changes.
- Report honestly what you verified and what you didn't.

## Hard constraints

- GitHub Pages serves each of his Pages-enabled repos at `/<repo-name>/`. **Never create a route, file or folder named after one of his repos.** The site only uses `/`, the root icon and meta files, and `/_astro/`. Check with `gh api` before adding anything at the root.
- The root `robots.txt` also announces the project docs sitemaps (`PROJECT_SITEMAPS` in `src/data/site.ts`).
- Keep the SEO set intact: `WebSite` JSON-LD with a deliberate `name`/`alternateName`, `ProfilePage` and `Person` (with `sameAs`), canonical, Open Graph and Twitter tags, a 1200×630 `og.png`, favicons at the root. The title stays within ~60 characters, the description within ~160.
- Figures that change (stars, downloads) are fetched at build time with a dated fallback, never hard-coded.

## Stack

- Astro 7, static output, one page. **Bun only** (no npm, pnpm or Node scripts); exact versions pinned (`bunfig.toml`).
- TypeScript 6: `astro check` doesn't accept 7.0. Move to 7 only once 7.1 ships (it also needs `@astrojs/ts-content-mapper`).
- Biome for lint and format; `bun run check` also fails on formatting, so run `bun run format` first.
- Commands: `bun run dev | build | preview | check | format | generate-images`.
- `scripts/generate-images.ts` derives the favicon set, app icons and `og.png` from the mark drawings in `src/assets/mark/`. Rerun it after changing the mark or the social image. The tab icon keeps dark `#1A1A18` letters on purpose.

## Mechanisms worth knowing before you touch them

- **Theme:** follows the system by default; an inline head script in `Base.astro` adds the `js` class, applies a saved choice and syncs `theme-color`. Colors use `light-dark()` tokens in `src/styles/global.css`. JS-only controls use `.js-only` / `.no-js`, so there's no flash of unstyled content.
- **Fading hairlines** between header, sections and footer: the `--rule` gradient token, applied with `border-image`. It's declared on `:root` and on `.section + .section`, so each picks up its own `--rule-fade`.
- **Image fade-in:** `img[data-fade]` (CSS in `global.css`, script in `Base.astro`). `.img-link` adds a hover zoom; its transition repeats the fade's, which it would otherwise replace.
- **Counters:** `Count.astro`. The real value stays in the HTML (for search engines and screen readers); an `aria-hidden` ticker shows the animation, zero-padded by `tick()` in `src/lib/format.ts` so the width never changes.
- **Mark size:** `Mark.astro` reads an optional `--mark-size` from a parent (the header uses it on large screens).
- **External links:** `src/middleware.ts` adds `target="_blank" rel="noopener"` at build time; don't add them by hand.
- **Header name:** the full name, or `NAME_SHORT` below 368px; the link's `aria-label` always has the full name.
- **Minified CSS:** Lightning CSS drops an unprefixed declaration followed by its `-webkit-` twin. Write only the unprefixed property; the build adds prefixes its browser targets need.

## Design rules to keep

- Palette and type are tokens in `global.css`; reuse them rather than adding colors.
- Nothing that isn't interactive reacts to hover.
- Buttons: a 2px dashed border appears on hover; no background change, no lift; `:active` sinks 1px.
- Respect `prefers-reduced-motion` in every animation.

## Verifying a change

1. `bun run check` and `bun run build`.
2. For visuals, `bun run preview --port 4330` (Ionuț's own `astro dev` usually holds 4321; dev mode flashes unstyled content by design, so judge that on the preview).
3. Playwright screenshots in light and dark, at desktop (1360px) and phone (390px) widths; check for console errors and horizontal overflow. Scroll images into view before judging them (they're lazy-loaded).
4. Stop the preview by PID: `ps -eo pid,args | awk '/astro.mjs preview --port 4330/ && !/awk/ {print $1}' | xargs -r kill`. A `pkill -f` pattern that also matches your own command line kills your shell.

The shell is zsh: quote globs like `'--include=*.astro'`, and write `${var}:path` rather than `$var:path` (`:a` and friends are modifiers).
