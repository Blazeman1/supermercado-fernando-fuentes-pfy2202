import { lazy } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// LAZY LOADING: cada página se descarga recién cuando se visita su ruta.
// Vite genera un archivo .js por página y el bundle inicial queda más liviano.
// <Suspense> (en Layout) muestra un indicador mientras llega el archivo.
const Home = lazy(() => import('../pages/Home'));
const ListadoArticulos = lazy(() => import('../pages/ListadoArticulos'));
const NuevoArticulo = lazy(() => import('../pages/NuevoArticulo'));
const DetalleArticulo = lazy(() => import('../pages/DetalleArticulo'));
const Carrito = lazy(() => import('../pages/Carrito'));
const CompraExitosa = lazy(() => import('../pages/CompraExitosa'));
const NuestrasTiendas = lazy(() => import('../pages/NuestrasTiendas'));
const Contactanos = lazy(() => import('../pages/Contactanos'));
const ContactoEnviado = lazy(() => import('../pages/ContactoEnviado'));
const NoEncontrado = lazy(() => import('../pages/NoEncontrado'));

// Mantiene vigentes los enlaces de la semana 1 (/producto/:sku).
function RedirigirProducto() {
  const { sku } = useParams();
  return <Navigate to={`/articulos/${sku}`} replace />;
}

// ARCHIVO CENTRAL DE RUTAS: toda la navegación del sitio se define aquí.
//
//   /                          Panel de inventario
//   /articulos                 Listado con filtro por categoría
//   /articulos/nuevo           Formulario de ingreso
//   /articulos/:sku            Detalle + agregar al carrito (ruta dinámica)
//   /carrito                   Carrito de compras
//   /carrito/compra-exitosa    Confirmación de compra
//   /tiendas, /contacto, /contacto/enviado   Páginas de la semana 1
//   *                          404
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="articulos">
          <Route index element={<ListadoArticulos />} />
          <Route path="nuevo" element={<NuevoArticulo />} />
          <Route path=":sku" element={<DetalleArticulo />} />
        </Route>

        <Route path="carrito">
          <Route index element={<Carrito />} />
          <Route path="compra-exitosa" element={<CompraExitosa />} />
        </Route>

        <Route path="tiendas" element={<NuestrasTiendas />} />
        <Route path="contacto">
          <Route index element={<Contactanos />} />
          <Route path="enviado" element={<ContactoEnviado />} />
        </Route>

        <Route path="producto/:sku" element={<RedirigirProducto />} />
        <Route path="inicio" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
