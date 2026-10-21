import { Link, useLocation } from 'react-router-dom';

export default function NoEncontrado() {
  const { pathname } = useLocation();
  return (
    <section className="tarjeta centrado" aria-labelledby="titulo-404">
      <p className="codigo-404" aria-hidden="true">404</p>
      <h1 id="titulo-404">Página no encontrada</h1>
      <p>La ruta <code>{pathname}</code> no existe en este sitio.</p>
      <Link className="btn btn-primario" to="/">Volver al inventario</Link>
    </section>
  );
}
