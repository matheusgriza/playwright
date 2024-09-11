import { defineConfig } from '@playwright/test';
import 'dotenv/config';
export default defineConfig({
  use: {
    // All requests we send go to this API endpoint.
    baseURL: `${process.env.URL_API}`,
    extraHTTPHeaders: {
      // We set this header per GitHub guidelines.
      'Accept': 'application/json',
      // Add authorization token to all requests.
      // Assuming personal access token available in the environment.
      'X-API-KEY': `${process.env.API_KEY_API}`,
    },
  },
  reporter: [['list'], ['html']]
});
