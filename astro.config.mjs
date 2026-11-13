// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://icflorescu.github.io',
  // Hashed build assets go to /_astro/, a name none of my repos (and so none of the project sites) can clash with.
  build: { assets: '_astro', inlineStylesheets: 'always' },
  // The GitHub avatar is downloaded and optimized at build time, so visitors never hit a third-party host.
  image: { domains: ['avatars.githubusercontent.com'] },
  devToolbar: { enabled: false },
});
