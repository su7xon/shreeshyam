/// <reference lib="webworker" />

import { createHandler, CreateRouteFunction } from '@serwist/core';

declare const self: ServiceWorkerGlobalScope;

const createRoutes: CreateRouteFunction = () => {
  const routes = [];

  // Static assets - cache first
  routes.push({
    urlPattern: ({ request }) => request.destination === 'image' || 
                                 request.destination === 'font' ||
                                 request.destination === 'style' ||
                                 request.destination === 'script',
    handler: 'cacheFirst',
    options: {
      cacheName: 'static-assets',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      },
    },
  });

  // API calls - network first
  routes.push({
    urlPattern: ({ url }) => url.pathname.startsWith('/api'),
    handler: 'networkFirst',
    options: {
      cacheName: 'api-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 1 day
      },
    },
  });

  return routes;
};

const serwist = createHandler({
  precacheEntries: [
    // Precache manifest entries will be added here during build
  ],
  routes: createRoutes(),
  skipWaiting: true,
  clientsClaim: true,
});

serwist;