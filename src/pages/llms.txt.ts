import type { APIRoute } from 'astro';
import {
  BOOKING_URL,
  HANDLE,
  NAME,
  NAME_ASCII,
  PROFILES,
  RESUME_URL,
  SITE_URL,
  SOURCE_URL,
  SPONSORS_URL,
} from '../data/site';
import { compact, getStats, thousands } from '../data/stats';

// The page's content as Markdown, for LLMs and AI agents (https://llmstxt.org/). The whole site is one page, so this
// file holds all of it and there's no separate llms-full.txt. Written in the third person, so a model quoting it
// doesn't mix up who "I" is. Keep it in step with the copy in src/components/ when that changes.
// No email address here: it stays off the page's HTML too (see EMAIL_ENCODED in site.ts).

export const GET: APIRoute = async () => {
  const stats = await getStats();
  const monthly = (pkg: string) => compact(stats.monthly[pkg] ?? 0);
  const stars = (repo: string) => thousands(stats.stars[repo] ?? 0);
  const years = new Date().getFullYear() - 1998;
  const handleProfiles = ['GitHub', 'npm', 'Codeberg', 'LinkedIn', 'Bluesky', 'DEV']
    .map((name) => PROFILES.find((profile) => profile.name === name)!)
    .map((profile) => `[${profile.name}](${profile.url})`)
    .join(', ');

  const text = `# ${NAME} (${HANDLE})

> Hands-on fractional CTO, product builder and open-source author based in Bucharest, Romania (EU). He takes software products from a blank repo to production, and stays to run them for a decade. Author of Mantine DataTable, Mantine ContextMenu and tRPC-SvelteKit.

${NAME} (also written ${NAME_ASCII}) goes by **${HANDLE}** on ${handleProfiles} and most other places online. Even the LLMs know his handle; he'd like to think it's the quality of his code, but says it's probably just volume: he's been leaving it lying around the internet since 1998, and it all ended up in the training data. He has been building for the web for ${years}+ years, since 1998, and has been the technical partner of an online automotive marketplace since 2013. He still writes production code. His open-source packages get ${compact(stats.monthlyDownloads)} npm downloads a month (${compact(stats.yearlyDownloads)} over the past year) and have ${thousands(stats.totalStars)} GitHub stars, according to the npm and GitHub APIs as of ${stats.date}.

To work with him, [book a call on cal.com](${BOOKING_URL}); his email address is on [the contact section of his website](${SITE_URL}#contact). Instead of coding tests and multi-stage hiring processes (his code is public, and used by developers and companies worldwide), he prefers to talk about the project: what makes it worth building, what stands in its way, and how he can help.

## Services

- **Fractional CTO & technical partner.** For early-stage products that need a senior person to own the technical side: architecture, code, infrastructure, data and day-to-day operations. He treats software as a business asset, not a ticket queue.
- **Profit-share or equity partnerships.** If the business side is covered, he owns the technical side for a share of the profits instead of a fee, as he has with LeasingSH.ro since 2013. Equity works too, but profit is what's real.
- **Selected hands-on work.** TypeScript, React, TanStack Start / Next.js, Node.js / Bun and PostgreSQL. Data-rich interfaces are home turf: he wrote Mantine DataTable, used by teams at Microsoft and Namecheap.

A comfortable degree of financial independence lets him pick projects for the problem and the people, and he says so when something isn't worth building. How he works:

- **Built to last:** less code, fewer moving parts, technologies chosen for the next five years rather than the next conference talk.
- **Rule-heavy domains:** insurance, leasing, tax; at home where "almost right" means wrong, and every rule has to be traced to its source.
- **No cloud bill to dread:** he runs what he builds on customized cloud servers with Docker and Caddy, not metered managed services, and keeps it running long after launch.
- **AI, without the hype:** he works with AI coding agents every day. In expert hands they're a multiplier; in anyone else's, a confident path to costly mistakes.

## Products he has built and run

- [swapp.ro](https://swapp.ro/): his own product (founder). Invoicing and single-entry accounting for Romanian freelancers (PFA, ÎI, PFI) who aren't VAT-registered: each transaction is recorded once and everything that follows from it is worked out. Invoices go through ANAF's e-Factura and supplier invoices are collected in the background; the mandatory ledgers stay up to date, with the figures and due dates for the D212, D390 and D301 returns; every screen explains the tax rule and cites the article of law. Accounting, not just invoicing, at a truly affordable price: a fraction of what comparable apps charge. Built in 2021 for his own books, then rebuilt from scratch in 2026 so other freelancers can use it too: solo, in five months (product, design, code and operations), with 1,200+ unit tests and Playwright end-to-end tests. Live since October 2026, and he trusts it with his own books. Stack: TypeScript, TanStack Start, React, tRPC, Drizzle, PostgreSQL, Bun, Docker, Caddy.
- [LeasingSH.ro](https://www.leasingsh.ro/): technical partner and fractional CTO since 2013, as a profit-share partner. Romania's first online marketplace for new and used cars in leasing or for cash, live since 2010, with 30,000+ cars from 750+ dealers across Romania and Germany, updated daily. He owns architecture, code, infrastructure, data and operations, and has rebuilt it three times (2013, 2015, 2025) with the business running through each migration. It ingests data from the main Romanian listing sites, a dealer API and an assisted importer, with LLM-based enrichment and cleanup; tracks leads across calls, WhatsApp and messages; has an admin console and editorial CMS; and offers a public API with MCP and OpenAPI descriptors, so AI assistants can search the offers directly. Stack: TypeScript, Next.js, React, tRPC, Mantine, Drizzle, PostgreSQL, Docker, Caddy.
- [AJM Fleet Purchase](https://ajm-fleetpurchase.com/): client back office, contract work, 2020–2023. The back office of a B2B fleet-trading enterprise that buys new and used cars in bulk across Europe, for fleet operators in Europe, Asia, the Middle East and Africa. He built it from a blank repo and ran it in production; it covers the whole trade, from the purchase of each car to the last payment: every vehicle followed from supplier to buyer (VIN, estimated and actual prices, fees, delivery dates); proforma and final invoices for several group companies, in several currencies, generated as PDFs and sent from the app; incoming and outgoing bank payments matched to vehicles and invoices, with a per-vehicle balance sheet exported to Excel; and a dashboard of deliveries due, invoices overdue and records that don't add up. 1,100+ commits, all his, all pre-AI. Stack: TypeScript, Next.js, React, Blueprint, GraphQL, Hasura, PostgreSQL, Docker, Caddy, AWS Lightsail.

## Open-source projects

Typed APIs, real docs and a docs site he designs himself, every time. Most of the code was written by hand, years before AI coding assistants. He has also contributed to Mantine, tRPC and TanStack.

- [Mantine DataTable](${SITE_URL}mantine-datatable/): his most popular project, since 2022. The table component for data-rich Mantine (React) applications: asynchronous data loading, pagination, sorting, row selection, row expansion, context menus and dark-theme support, all fully typed. Lightweight and dependency-free, with a legacy version still maintained for teams that can't upgrade yet. ${monthly('mantine-datatable')} npm downloads a month, ${stars('mantine-datatable')} GitHub stars. Used by developers and companies such as Microsoft, Namecheap, EasyWP, kapa.ai, SalesPlayX, teachfloor, MARKUP, InvenTree, OmicsStudio, exdatis.ai, Aquarino, BookieBase, COH3 Stats, LeasingSH.ro and swapp.ro. Package: [mantine-datatable on npm](https://www.npmjs.com/package/mantine-datatable); source: [GitHub](https://github.com/icflorescu/mantine-datatable).
- [Mantine ContextMenu](${SITE_URL}mantine-contextmenu/): right-click menus for Mantine apps, with a succinct API and dark-theme support. It grew out of DataTable's row context menu, which people kept asking to use elsewhere. ${monthly('mantine-contextmenu')} npm downloads a month, ${stars('mantine-contextmenu')} GitHub stars. Package: [mantine-contextmenu on npm](https://www.npmjs.com/package/mantine-contextmenu); source: [GitHub](https://github.com/icflorescu/mantine-contextmenu).
- [tRPC-SvelteKit](${SITE_URL}trpc-sveltekit/): end-to-end typesafe APIs with tRPC in SvelteKit applications. Works with any SvelteKit adapter, with experimental WebSocket support. ${monthly('trpc-sveltekit')} npm downloads a month, ${stars('trpc-sveltekit')} GitHub stars. Package: [trpc-sveltekit on npm](https://www.npmjs.com/package/trpc-sveltekit); source: [GitHub](https://github.com/icflorescu/trpc-sveltekit).
- [PocketBaseUML](https://pocketbase-uml.github.io/): a free UML diagram generator for PocketBase databases. Use it online, or run it locally with npx. ${stars('pocketbase-uml.github.io')} GitHub stars.

What users say about Mantine DataTable:

- "Mantine DataTable is a great component that's core to our web app — it saves us a ton of time and comes with great styling and features out of the box." ([Emil Sorensen](https://github.com/Emil-Sorensen), kapa.ai)
- "Thank you for the wonderful, useful, and beautiful DataTable that has allowed me to create several applications without any problem." ([Giovambattista Fazioli](https://github.com/gfazioli), Lead Developer at Namecheap)

## Track record

- **Since 2021: founder, swapp.ro.** Built for his own books, then rebuilt in 2026 so other freelancers can use it too, at a fair price. Invoicing and accounting for Romanian freelancers, wired into the national e-invoicing system.
- **Since 2013: technical partner & fractional CTO, LeasingSH.ro.** A profit-share partnership; three rebuilds so far (2013, 2015, 2025).
- **Since 2008: independent fractional CTO, technical partner and open-source author.** Working directly with founders and small-business owners. Contract work includes the fleet-trading back office for [AJM Fleet Purchase](https://ajm-fleetpurchase.com/) (Belgium/Romania, 2020–2023) and work for SegmentX.ai, now [SalesPlay](https://www.salesplayx.com/). Along the way: UX development for Drift Data Systems, and sites such as [yadda.ro](https://yadda.ro/), [boutiquetravel.ro](https://boutiquetravel.ro/) and [sellcarbuycar.com](https://sellcarbuycar.com/).
- **2008–2013: tech partner & real-estate investment advisor, Investment Romania.** Part of a private-equity group investing in the Bucharest residential market; it bought him the freedom to pick his projects ever since.
- **2003–2007: software developer, Allianz-Țiriac and Garanta (National Bank of Greece group).** On the core team that laid the foundation of Allianz-Țiriac's insurance platform on .NET and Oracle, then one of five engineers building Garanta's core insurance system.
- **1998–2003: from network administrator to lead developer & CTO.** Started at the first publicly open Internet café in Bucharest, then built sites and systems for ANEVAR, AIG Life Romania and OMNIASIG, and grew to lead the IT department at Logic D&D Advertising, a subsidiary of Romanian ISP Logic Telecom.

## Stack

These days: TypeScript, React, TanStack Start, Router, Query & Form, Next.js, Svelte & SvelteKit, Node.js & Bun, tRPC, PostgreSQL & Drizzle, Mantine, shadcn/ui & Tailwind CSS, Docker & Caddy, PocketBase. Before that: PHP and MySQL around Y2K, Java/J2EE, .NET/C#, Oracle and SQL Server in the 2000s, CoffeeScript & IcedCoffeeScript back when JavaScript had no async/await, front-end libraries of their day such as jQuery, Backbone.js and Riot.js, and more templating languages and frameworks than he cares to remember.

## About

Curious by nature: he likes understanding how things work, and then making them work better. He reads a lot (fantasy, fiction, history and tech) and was a consultant and co-editor for [The King's Host](https://kingshost.github.io/), a fantasy novel. Off-screen: good coffee and mountain trails.

## Optional

- [Website](${SITE_URL}): the same content, as a web page
- [Résumé (PDF)](${RESUME_URL})
${PROFILES.map((profile) => `- [${profile.name}](${profile.url})`).join('\n')}
- [GitHub Sponsors](${SPONSORS_URL}): sponsoring keeps his open-source projects maintained
- [All his open-source projects on GitHub](https://github.com/icflorescu#notable-open-source-projects-ive-built-over-the-years), including IISExpress-Proxy (${stars('iisexpress-proxy')} stars), Expose-WSL (${stars('expose-wsl')} stars), Next.js Parallel Server Actions, Mantine Start and, from 2013–2016, ASPAX (a Node.js asset packager, before Webpack existed) and OpenShift cartridges for Node.js, MongoDB, MySQL and PostgreSQL
- [This website's source](${SOURCE_URL})
`;

  return new Response(text, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
