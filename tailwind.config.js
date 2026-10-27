/** @type {import('tailwindcss').Config} */
export default {
  // Archivos donde Tailwind busca clases: solo las que aparezcan aquí
  // se incluyen en el CSS final (purga de estilos no utilizados).
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Paleta de la marca "Mercado Austral". Se extiende el tema por
      // defecto, así siguen disponibles todos los colores de Tailwind.
      colors: {
        marca: {
          50: '#eef7f1',
          100: '#d6ecdf',
          500: '#2b8a5a',
          600: '#1f6b45',
          700: '#17533a',
          900: '#0d2e20',
        },
        acento: {
          100: '#fdf0da',
          400: '#e9a23b',
          700: '#9a5b06',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
