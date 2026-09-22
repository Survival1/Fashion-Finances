import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-api-mock',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/hero-video-status') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ exists: true, url: '/hero_video.mp4' }));
              return;
            }
            if (req.url && req.url.startsWith('/api/scheduled-orders')) {
              res.setHeader('Content-Type', 'application/json');
              if (req.method === 'GET') {
                res.end(JSON.stringify([]));
                return;
              }
              if (req.method === 'POST') {
                res.end(JSON.stringify({ success: true, message: 'Operación simulada en modo local' }));
                return;
              }
              if (req.method === 'DELETE') {
                res.end(JSON.stringify({ success: true, message: 'Orden eliminada' }));
                return;
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: false,
      watch: null,
    },
    build: {
      chunkSizeWarningLimit: 5000,
    },
  };
});
