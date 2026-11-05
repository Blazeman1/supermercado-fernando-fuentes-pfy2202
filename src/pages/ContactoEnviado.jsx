import { Navigate, useLocation } from 'react-router-dom';
import EstadoVacio from '../components/ui/EstadoVacio';
import Boton from '../components/ui/Boton';

export default function ContactoEnviado() {
  const { state } = useLocation();

  // Si alguien entra directo a /contacto/enviado (sin pasar por el
  // formulario), no hay estado: se le redirige al formulario.
  if (!state?.nombre) return <Navigate to="/contacto" replace />;

  return (
    <EstadoVacio
      icono="✓"
      titulo={`¡Gracias, ${state.nombre}!`}
      descripcion={`Recibimos tu mensaje sobre ${state.motivo.toLowerCase()}. Te responderemos dentro de 2 días hábiles.`}
    >
      <Boton to="/">Ir al inicio</Boton>
      <Boton variante="secundario" to="/contacto">Enviar otro mensaje</Boton>
    </EstadoVacio>
  );
}
