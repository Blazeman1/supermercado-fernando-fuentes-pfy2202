import { Link } from 'react-router-dom';
import { useCarrito } from '../../context/hooks';
import { clp } from '../../utils/formato';
import SelectorCantidad from '../ui/SelectorCantidad';
import Boton from '../ui/Boton';
import Tarjeta from '../ui/Tarjeta';

// Una línea del carrito. Aumentar o disminuir la cantidad mueve unidades
// entre el carrito y el inventario (acción CAMBIAR_CANTIDAD del reducer).
export default function ItemCarrito({ item }) {
  const { articulo, cantidad, subtotal } = item;
  const { cambiarCantidad, quitarDelCarrito } = useCarrito();

  return (
    <Tarjeta as="li" className="grid gap-4 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <div className="min-w-0">
        <Link to={`/articulos/${articulo.sku}`} className="font-semibold text-marca-700 hover:underline">{articulo.nombre}</Link>
        <p className="text-sm text-stone-600">{articulo.marca} · {articulo.tipo}</p>
        <p className="text-sm text-stone-500">
          {clp(articulo.precio)} c/u ·{' '}
          <span className={articulo.stock === 0 ? 'font-medium text-acento-700' : ''}>
            {articulo.stock === 0 ? 'sin más stock disponible' : `quedan ${articulo.stock} en inventario`}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <SelectorCantidad
          valor={cantidad}
          etiqueta={`cantidad de ${articulo.nombre}`}
          onRestar={() => cambiarCantidad(articulo.sku, -1)}
          onSumar={() => cambiarCantidad(articulo.sku, 1)}
          puedeSumar={articulo.stock > 0}
        />
        <p className="w-28 text-right text-lg font-bold tabular-nums">{clp(subtotal)}</p>
      </div>

      <Boton variante="peligro" tamano="sm" onClick={() => quitarDelCarrito(articulo.sku)} className="justify-self-end">
        Quitar
      </Boton>
    </Tarjeta>
  );
}
