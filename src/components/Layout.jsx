import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import MenuInferior from './MenuInferior';

const TITULOS = {
  '/': 'Inventario',
  '/tiendas': 'Nuestras tiendas',
  '/contacto': 'Contáctanos',
  '/contacto/enviado': 'Mensaje enviado',
};

export default function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // En una SPA el navegador no recarga la página, así que hay que
  // actualizar a mano el título, el scroll y el foco en cada cambio de ruta
  // (buena práctica de accesibilidad para lectores de pantalla).
  useEffect(() => {
    const titulo = TITULOS[pathname] ?? (pathname.startsWith('/producto/') ? 'Detalle de producto' : 'Página no encontrada');
    document.title = `${titulo} | Mercado Austral`;
    window.scrollTo(0, 0);
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <div className="app">
      <a className="saltar" href="#contenido">Saltar al contenido</a>
      <header className="encabezado">
        <Link to="/" className="marca" aria-label="Mercado Austral, ir al inicio">
          <span className="marca-logo" aria-hidden="true">MA</span>
          <span>
            <strong>Mercado Austral</strong>
            <small>Gestión de inventario</small>
          </span>
        </Link>
      </header>

      <main id="contenido" ref={mainRef} tabIndex={-1} className="contenido">
        <Outlet />
      </main>

      <footer className="pie">© {new Date().getFullYear()} Mercado Austral · Proyecto académico PFY2202</footer>

      <MenuInferior />
    </div>
  );
}
