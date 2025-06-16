import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/voteverse/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    esbuild: {
        logLevel: 'info',
        target: 'es2020',
    },
    build: {
        target: 'es2020',
        minify: 'esbuild',
        sourcemap: true,
    },
}); 