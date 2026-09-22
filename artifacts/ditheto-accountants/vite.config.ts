import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT ?? '5173';
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? '/';
const productionAuthExpected =
  process.env.CLERK_PRODUCTION_AUTH_EXPECTED === '1' ||
  process.env.VERCEL_ENV === 'production';
const configuredClerkKeys = [
  process.env.CLERK_PUBLISHABLE_KEY,
  process.env.EXTERNAL_CLERK_PUBLISHABLE_KEY,
  process.env.VITE_CLERK_PUBLISHABLE_KEY,
].filter((key): key is string => Boolean(key));
const clerkKeyForFrontend = configuredClerkKeys.find(
  (key) =>
    /^pk_(live|test)_/.test(key) &&
    (!productionAuthExpected || key.startsWith('pk_live_')),
);

if (productionAuthExpected && !clerkKeyForFrontend) {
  throw new Error(
    'Production Clerk builds require a pk_live publishable key. Set CLERK_PUBLISHABLE_KEY or EXTERNAL_CLERK_PUBLISHABLE_KEY in the production environment.',
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss({ optimize: false }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  // Vercel stores the production Clerk publishable key as CLERK_PUBLISHABLE_KEY
  // so the API and frontend cannot silently use different Clerk environments.
  // Keep the VITE variable as the development fallback for local builds.
  define: clerkKeyForFrontend
    ? {
        'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(clerkKeyForFrontend),
      }
    : undefined,
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
