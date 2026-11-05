import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/hooks';
import EncabezadoPagina from '../components/ui/EncabezadoPagina';
import EstadoVacio from '../components/ui/EstadoVacio';
import Boton from '../components/ui/Boton';
import ItemCarrito from '../components/carrito/ItemCarrito';
import ResumenCarrito from '../components/carrito/ResumenCarrito';

// PÁGINA DEL CARRITO: lista los artículos agregados. Cambiar la cantidad
// de un ítem actualiza el inventario general en la misma acción.
export default function Carrito() {
  const { items, totalUnidades, total, vaciarCarrito, confirmarCompra } = useCarrito();
  const navigate = useNavigate();

  const confirmar = () => {
    const resumen = { unidades: totalUnidades, total, lineas: items.length };
    // Primero se navega y luego se vacía el carrito: React agrupa ambas
    // actualizaciones en un solo render, así no se alcanza a ver el
    // estado "carrito vacío" antes de la confirmación.
    navigate('compra-exitosa', { state: resumen });
    confirmarCompra();
  };

  if (items.length === 0) {
    return (
      <section aria-labelledby="titulo-carrito" className="space-y-5">
        <EncabezadoPagina id="titulo-carrito" titulo="Carrito de compras" />
        <EstadoVacio icono="🛒" titulo="Tu carrito está vacío" descripcion="Elige artículos desde el listado y agrégalos desde su detalle.">
          <Boton to="/articulos">Ver artículos</Boton>
        </EstadoVacio>
      </section>
    );
  }

  return (
    <section aria-labelledby="titulo-carrito" className="space-y-5">
      <EncabezadoPagina
        id="titulo-carrito"
        titulo="Carrito de compras"
        descripcion={`${items.length} ${items.length === 1 ? 'artículo' : 'artículos'} · ${totalUnidades} ${totalUnidades === 1 ? 'unidad' : 'unidades'}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ul className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <ItemCarrito key={item.articulo.sku} item={item} />
          ))}
        </ul>
        <ResumenCarrito totalUnidades={totalUnidades} total={total} onConfirmar={confirmar} onVaciar={vaciarCarrito} />
      </div>
    </section>
  );
}
