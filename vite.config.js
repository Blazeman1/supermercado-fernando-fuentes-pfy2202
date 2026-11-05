import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Nombre del repositorio: en GitHub Pages el sitio se publica en
// https://<usuario>.github.io/supermercado-fernando-fuentes-pfy2202/
const REPO = 'supermercado-fernando-fuentes-pfy2202';

// GitHub Pages no conoce las rutas de React Router: si alguien recarga
// /carrito, el servidor busca ese archivo, no lo encuentra y responde con
// 404.html. Copiamos index.html como 404.html para que esa respuesta
// cargue la aplicación y React Router muestre la ruta correcta.
const fallbackSpa = () => ({
  name: 'fallback-spa-github-pages',
  closeBundle() {
    const dist = resolve(import.meta.dirname, 'dist');
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
  },
});

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // En desarrollo el sitio vive en "/"; al compilar, bajo /REPO/.
  base: command === 'build' ? `/${REPO}/` : '/',
  plugins: [react(), fallbackSpa()],
}));
