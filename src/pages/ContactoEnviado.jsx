import { Link, Navigate, useLocation } from 'react-router-dom';

export default function ContactoEnviado() {
  const { state } = useLocation();

  // Si alguien entra directo a /contacto/enviado (sin pasar por el
  // formulario), no hay estado: se le redirige al formulario.
  if (!state?.nombre) return <Navigate to="/contacto" replace />;

  return (
    <section className="tarjeta centrado" aria-labelledby="titulo-enviado">
      <p className="icono-exito" aria-hidden="true">✓</p>
      <h1 id="titulo-enviado">¡Gracias, {state.nombre}!</h1>
      <p>Recibimos tu mensaje sobre <strong>{state.motivo.toLowerCase()}</strong>. Te responderemos dentro de 2 días hábiles.</p>
      <div className="acciones-centro">
        <Link className="btn btn-primario" to="/">Ir al inventario</Link>
        <Link className="btn btn-secundario" to="/contacto">Enviar otro mensaje</Link>
      </div>
    </section>
  );
}
