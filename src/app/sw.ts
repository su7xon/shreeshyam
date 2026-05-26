import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Filter out apk files from precaching so users don't download the large APK in background
const precacheEntries = self.__SW_MANIFEST?.filter((entry) => {
  if (typeof entry === 'string') {
    return !entry.endsWith('.apk');
  }
  return !entry.url.endsWith('.apk');
});

const serwist = new Serwist({
  precacheEntries,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

// Custom handler to bypass caching for .apk downloads entirely so they download at full network speed
serwist.registerRoute(
  ({ url }) => url.pathname.endsWith('.apk'),
  async ({ request }) => {
    return fetch(request);
  }
);

// Avoid intercepting Firebase Auth paths
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/__/auth')) {
    return;
  }
});

serwist.addEventListeners();

export {};