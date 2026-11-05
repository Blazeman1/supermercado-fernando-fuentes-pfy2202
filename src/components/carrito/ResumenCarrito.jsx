import { clp } from '../../utils/formato';
import Boton from '../ui/Boton';
import Tarjeta from '../ui/Tarjeta';

// Resumen del carrito: recibe los totales ya calculados y las acciones por props.
export default function ResumenCarrito({ totalUnidades, total, onConfirmar, onVaciar }) {
  return (
    <Tarjeta as="aside" aria-label="Resumen de la compra" className="h-fit space-y-4 lg:sticky lg:top-4">
      <h2 className="text-lg font-bold">Resumen</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-stone-600">Unidades</dt><dd className="font-semibold tabular-nums">{totalUnidades}</dd></div>
        <div className="flex justify-between border-t border-stone-100 pt-2 text-base"><dt className="font-semibold">Total</dt><dd className="text-xl font-bold tabular-nums">{clp(total)}</dd></div>
      </dl>
      <div className="grid gap-2">
        <Boton tamano="lg" onClick={onConfirmar}>Confirmar compra</Boton>
        <Boton variante="secundario" onClick={onVaciar}>Vaciar carrito</Boton>
        <Boton variante="fantasma" to="/articulos">Seguir comprando</Boton>
      </div>
      <p className="text-xs text-stone-500">Vaciar el carrito devuelve todas las unidades al inventario.</p>
    </Tarjeta>
  );
}
