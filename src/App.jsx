import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductoDetalle from './pages/ProductoDetalle';
import NuestrasTiendas from './pages/NuestrasTiendas';
import Contactanos from './pages/Contactanos';
import ContactoEnviado from './pages/ContactoEnviado';
import NoEncontrado from './pages/NoEncontrado';

// Tabla de rutas de la SPA.
// - Layout es una "ruta de diseño": renderiza encabezado + menú inferior
//   y, mediante <Outlet />, la página que corresponda a la URL.
// - /producto/:sku es una ruta dinámica (parámetro leído con useParams).
// - /inicio redirige a "/" con <Navigate />.
// - "*" captura cualquier URL no definida (página 404).
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="producto/:sku" element={<ProductoDetalle />} />
        <Route path="tiendas" element={<NuestrasTiendas />} />
        <Route path="contacto">
          <Route index element={<Contactanos />} />
          <Route path="enviado" element={<ContactoEnviado />} />
        </Route>
        <Route path="inicio" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
