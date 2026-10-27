import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import MenuInferior from './MenuInferior';
import MenuInventario from './MenuInventario';

const TITULOS = {
  '/': 'Panel de inventario',
  '/articulos': 'Listado de artículos',
  '/articulos/nuevo': 'Ingresar artículo',
  '/tiendas': 'Nuestras tiendas',
  '/contacto': 'Contáctanos',
  '/contacto/enviado': 'Mensaje enviado',
};

export default function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // En una SPA el navegador no recarga la página: se actualizan a mano el
  // título, el scroll y el foco en cada cambio de ruta (accesibilidad).
  useEffect(() => {
    const titulo = TITULOS[pathname] ?? (pathname.startsWith('/articulos/') ? 'Detalle de artículo' : 'Página no encontrada');
    document.title = `${titulo} | Mercado Austral`;
    window.scrollTo(0, 0);
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col pb-[72px]">
      <a href="#contenido" className="absolute -left-[999px] top-0 z-50 bg-marca-600 px-4 py-2 text-white focus:left-4">
        Saltar al contenido
      </a>

      <header className="bg-marca-600 text-white shadow">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-3" aria-label="Mercado Austral, ir al panel">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-acento-400 font-extrabold text-marca-900" aria-hidden="true">
              MA
            </span>
            <span className="leading-tight">
              <strong className="block text-lg">Mercado Austral</strong>
              <small className="text-marca-100">Gestión de inventario</small>
            </span>
          </Link>
          <MenuInventario />
        </div>
      </header>

      <main id="contenido" ref={mainRef} tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 focus:outline-none">
        <Outlet />
      </main>

      <footer className="px-4 py-4 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} Mercado Austral · Proyecto académico PFY2202
      </footer>

      <MenuInferior />
    </div>
  );
}
