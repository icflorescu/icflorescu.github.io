// Open-source figures, fetched at build time from the GitHub and npm APIs.
// If a request fails (rate limit, network), the page falls back to the snapshot below, and says so.

const USER = 'icflorescu';

// Unscoped packages I maintain on npm (scoped @appgeist/* ones are legacy and negligible).
const NPM_PACKAGES = [
  'mantine-datatable',
  'mantine-contextmenu',
  'trpc-sveltekit',
  'trpc-transformer',
  'iisexpress-proxy',
  'next-server-actions-parallel',
  'textdiff-create',
  'textdiff-patch',
  'pocketbase-uml',
  'expose-wsl',
  'aspax',
] as const;

// Repos that aren't under my user account, but are mine.
const EXTRA_REPOS = ['pocketbase-uml/pocketbase-uml.github.io'] as const;

export type Stats = {
  /** ISO date (YYYY-MM-DD) the figures were taken */
  date: string;
  live: boolean;
  totalStars: number;
  monthlyDownloads: number;
  yearlyDownloads: number;
  stars: Record<string, number>;
  monthly: Record<string, number>;
};

// Taken on 2026-11-18 from the GitHub and npm APIs.
const SNAPSHOT: Stats = {
  date: '2026-11-18',
  live: false,
  totalStars: 4066,
  monthlyDownloads: 1_047_616,
  yearlyDownloads: 6_385_951,
  stars: {
    'mantine-datatable': 1262,
    'trpc-sveltekit': 834,
    'iisexpress-proxy': 746,
    'mantine-contextmenu': 176,
    'pocketbase-uml.github.io': 161,
    'expose-wsl': 143,
    'next-server-actions-parallel': 57,
  },
  monthly: {
    'mantine-datatable': 813_074,
    'mantine-contextmenu': 102_871,
    'trpc-sveltekit': 97_825,
    'pocketbase-uml': 764,
    'next-server-actions-parallel': 3817,
    'iisexpress-proxy': 6112,
  },
};

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, {
    headers: { 'user-agent': `${USER}.github.io build`, ...headers },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

type Repo = { name: string; fork: boolean; stargazers_count: number };

async function fetchStars() {
  const headers: Record<string, string> = { accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const stars: Record<string, number> = {};
  for (let page = 1; page < 10; page++) {
    const repos = await getJson<Repo[]>(
      `https://api.github.com/users/${USER}/repos?type=owner&per_page=100&page=${page}`,
      headers
    );
    for (const repo of repos) if (!repo.fork) stars[repo.name] = repo.stargazers_count;
    if (repos.length < 100) break;
  }
  for (const fullName of EXTRA_REPOS) {
    const repo = await getJson<Repo>(`https://api.github.com/repos/${fullName}`, headers);
    stars[repo.name] = repo.stargazers_count;
  }
  return stars;
}

type Point = { downloads: number } | null;

async function fetchDownloads(period: 'last-month' | 'last-year') {
  const data = await getJson<Record<string, Point>>(
    `https://api.npmjs.org/downloads/point/${period}/${NPM_PACKAGES.join(',')}`
  );
  return Object.fromEntries(NPM_PACKAGES.map((name) => [name, data[name]?.downloads ?? 0]));
}

const sum = (record: Record<string, number>) => Object.values(record).reduce((a, b) => a + b, 0);

let cached: Promise<Stats> | undefined;

export function getStats(): Promise<Stats> {
  cached ??= (async () => {
    if (process.env.STATS_OFFLINE) return SNAPSHOT;
    try {
      const [stars, monthly, yearly] = await Promise.all([
        fetchStars(),
        fetchDownloads('last-month'),
        fetchDownloads('last-year'),
      ]);
      const stats: Stats = {
        date: new Date().toISOString().slice(0, 10),
        live: true,
        totalStars: sum(stars),
        monthlyDownloads: sum(monthly),
        yearlyDownloads: sum(yearly),
        stars,
        monthly,
      };
      // Sanity check: a partial API failure shouldn't make the numbers look worse than the snapshot.
      if (stats.totalStars < SNAPSHOT.totalStars * 0.9 || stats.monthlyDownloads < SNAPSHOT.monthlyDownloads * 0.5) {
        throw new Error('Fetched figures look implausibly low');
      }
      return stats;
    } catch (error) {
      process.emitWarning(`Using snapshot stats from ${SNAPSHOT.date}: ${(error as Error).message}`);
      return SNAPSHOT;
    }
  })();
  return cached;
}

export { compact, thousands } from '../lib/format';
