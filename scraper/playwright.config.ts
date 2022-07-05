import { PlaywrightTestConfig } from '@playwright/test';

const config: any = {
  testDir: './src',
  projects: [
    {
      browserName: 'firefox',
    },
  ],
};
export default config;