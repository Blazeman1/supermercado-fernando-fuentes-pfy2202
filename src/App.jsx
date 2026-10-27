import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ListadoArticulos from './pages/ListadoArticulos';
import NuevoArticulo from './pages/NuevoArticulo';
import DetalleArticulo from './pages/DetalleArticulo';
import NuestrasTiendas from './pages/NuestrasTiendas';
import Contactanos from './pages/Contactanos';
import ContactoEnviado from './pages/ContactoEnviado';
import NoEncontrado from './pages/NoEncontrado';

// Mantiene vigentes los enlaces de la semana 1 (/producto/:sku)
// redirigiéndolos a la nueva ruta /articulos/:sku.
function RedirigirProducto() {
  const { sku } = useParams();
  return <Navigate to={`/articulos/${sku}`} replace />;
}

// Tabla de rutas de la SPA.
// - Layout es una "ruta de diseño": encabezado + menús y, vía <Outlet />,
//   la página que corresponda a la URL.
// - /articulos agrupa las páginas del nuevo menú (semana 2):
//     /articulos        → tabla con todo el inventario
//     /articulos/nuevo  → formulario de ingreso
//     /articulos/:sku   → detalle (ruta dinámica)
//   "nuevo" es un segmento estático y gana sobre :sku por especificidad.
// - "*" captura cualquier URL no definida (página 404).
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="articulos">
          <Route index element={<ListadoArticulos />} />
          <Route path="nuevo" element={<NuevoArticulo />} />
          <Route path=":sku" element={<DetalleArticulo />} />
        </Route>
        <Route path="producto/:sku" element={<RedirigirProducto />} />
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
