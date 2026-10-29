import { defineConfig } from 'vite';
export default defineConfig({ build: { rollupOptions: { input: { lab: 'index.html', preview: 'preview.html', marks: 'marks.html' } } } });
