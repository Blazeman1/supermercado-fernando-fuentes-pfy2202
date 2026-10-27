import { Link, Navigate, useLocation } from 'react-router-dom';

export default function ContactoEnviado() {
  const { state } = useLocation();

  // Si alguien entra directo a /contacto/enviado (sin pasar por el
  // formulario), no hay estado: se le redirige al formulario.
  if (!state?.nombre) return <Navigate to="/contacto" replace />;

  return (
    <section aria-labelledby="titulo-enviado" className="tarjeta mx-auto mt-8 max-w-lg space-y-3 text-center">
      <p aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-marca-50 text-2xl font-bold text-marca-600">✓</p>
      <h1 id="titulo-enviado" className="text-2xl font-bold">¡Gracias, {state.nombre}!</h1>
      <p className="text-stone-600">
        Recibimos tu mensaje sobre <strong>{state.motivo.toLowerCase()}</strong>. Te responderemos dentro de 2 días hábiles.
      </p>
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <Link className="btn-primario" to="/">Ir al inicio</Link>
        <Link className="btn-secundario" to="/contacto">Enviar otro mensaje</Link>
      </div>
    </section>
  );
}
