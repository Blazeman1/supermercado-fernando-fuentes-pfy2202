import { Link, useLocation } from 'react-router-dom';

export default function NoEncontrado() {
  const { pathname } = useLocation();
  return (
    <section aria-labelledby="titulo-404" className="tarjeta mx-auto mt-8 max-w-lg space-y-3 text-center">
      <p aria-hidden="true" className="text-6xl font-extrabold text-acento-400">404</p>
      <h1 id="titulo-404" className="text-2xl font-bold">Página no encontrada</h1>
      <p className="text-stone-600">
        La ruta <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-sm">{pathname}</code> no existe en este sitio.
      </p>
      <Link className="btn-primario" to="/">Volver al inicio</Link>
    </section>
  );
}
