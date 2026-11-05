import { useLocation } from 'react-router-dom';
import EstadoVacio from '../components/ui/EstadoVacio';
import Boton from '../components/ui/Boton';

export default function NoEncontrado() {
  const { pathname } = useLocation();
  return (
    <EstadoVacio icono="404" titulo="Página no encontrada" descripcion={`La ruta ${pathname} no existe en este sitio.`}>
      <Boton to="/">Volver al inicio</Boton>
    </EstadoVacio>
  );
}
