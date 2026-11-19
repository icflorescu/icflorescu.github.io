// Everything the page says about me that isn't prose lives here, so it's easy to review and update.
// Sources for every fact: research/profile.md.

export const SITE_URL = 'https://icflorescu.github.io/';

export const NAME = 'Ionuț-Cristian Florescu';
export const NAME_ASCII = 'Ionut-Cristian Florescu';
/** For the header on the narrowest phones, where the full name doesn't fit */
export const NAME_SHORT = 'Ionuț C. Florescu';
export const HANDLE = 'icflorescu';

// Kept within what search results show: ~60 characters for the title, ~160 for the description
export const TITLE = `${NAME} · Fractional CTO & open-source author`;
export const DESCRIPTION =
  'Hands-on fractional CTO, product builder and open-source author in Bucharest. I take software products from a blank repo to production, and stay to run them.';

export const AVATAR_URL = 'https://avatars.githubusercontent.com/u/581999?v=4';
export const BOOKING_URL = 'https://cal.com/icflorescu';
export const SPONSORS_URL = 'https://github.com/sponsors/icflorescu';
export const RESUME_URL = 'https://github.com/icflorescu/icflorescu/blob/main/ionut-cristian-florescu--resume.pdf';
// The same PDF, served as application/octet-stream, so it downloads instead of opening GitHub's viewer. It's on
// another origin, where browsers ignore the download attribute; links to it need target="_self" (see middleware.ts).
export const RESUME_DOWNLOAD_URL =
  'https://raw.githubusercontent.com/icflorescu/icflorescu/main/ionut-cristian-florescu--resume.pdf';
export const SOURCE_URL = 'https://github.com/icflorescu/icflorescu.github.io';

// The address is published on my GitHub profile, but kept out of the HTML to spare it from naive scrapers.
// The page stores it reversed and base64-encoded, and only decodes it when a visitor asks for it.
const EMAIL = 'ionut.florescu@gmail.com';
export const EMAIL_ENCODED = Buffer.from([...EMAIL].reverse().join('')).toString('base64');

export const PROFILES = [
  { name: 'GitHub', url: 'https://github.com/icflorescu' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/icflorescu/' },
  { name: 'Twitter', url: 'https://twitter.com/icflorescu' },
  { name: 'Bluesky', url: 'https://bsky.app/profile/icflorescu.bsky.social' },
  { name: 'Codeberg', url: 'https://codeberg.org/icflorescu' },
  { name: 'DEV', url: 'https://dev.to/icflorescu' },
  { name: 'Medium', url: 'https://medium.com/@icflorescu' },
  { name: 'npm', url: 'https://www.npmjs.com/~icflorescu' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com/users/2654840/ionut-cristian-florescu' },
] as const;

// Project docs sites hosted under this domain; their sitemaps are announced in the root robots.txt,
// which is the only robots.txt crawlers read for this host.
export const PROJECT_SITEMAPS = [
  'mantine-datatable',
  'mantine-contextmenu',
  'trpc-sveltekit',
  'mantine-datatable-v6',
  'mantine-contextmenu-v6',
].map((path) => `${SITE_URL}${path}/sitemap.xml`);
