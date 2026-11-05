import { Navigate, useLocation } from 'react-router-dom';
import { clp } from '../utils/formato';
import EstadoVacio from '../components/ui/EstadoVacio';
import Boton from '../components/ui/Boton';

// Confirmación de compra. Igual que /contacto/enviado: sin datos en
// location.state (entrada directa por URL) redirige al carrito.
export default function CompraExitosa() {
  const { state } = useLocation();
  if (!state?.unidades) return <Navigate to="/carrito" replace />;

  return (
    <EstadoVacio
      icono="✓"
      titulo="¡Compra confirmada!"
      descripcion={`Registramos ${state.unidades} ${state.unidades === 1 ? 'unidad' : 'unidades'} (${state.lineas} ${state.lineas === 1 ? 'artículo' : 'artículos'}) por un total de ${clp(state.total)}.`}
    >
      <Boton to="/articulos">Seguir comprando</Boton>
      <Boton variante="secundario" to="/">Ir al panel</Boton>
    </EstadoVacio>
  );
}
