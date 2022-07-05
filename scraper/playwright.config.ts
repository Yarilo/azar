import { type PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './src',
  projects: [
    {
      browserName: 'firefox',
    },
  ],
};
export default config;