import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [react(), VitePWA({ registerType: 'autoUpdate', includeAssets: ['icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png'], manifest: { name: 'Rally — Multi-Sport Americano', short_name: 'Rally', description: 'Turnamen Tennis, Padel, dan Pickleball', theme_color: '#14291f', background_color: '#f5f5ef', display: 'standalone', orientation: 'portrait', start_url: '/', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }] }, workbox: { navigateFallback: '/index.html', globPatterns: ['**/*.{js,css,html,svg,woff2}'] } })]
});
