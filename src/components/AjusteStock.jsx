import { useInventario } from '../context/InventarioContext';

// Botones − / + que despachan la acción AJUSTAR_STOCK al estado global.
export default function AjusteStock({ articulo, grande = false }) {
  const { ajustarStock } = useInventario();
  const tamano = grande ? 'h-10 w-10 text-lg' : '';

  return (
    <div className="inline-flex items-center gap-2">
      <button type="button" className={`paso-stock ${tamano}`} onClick={() => ajustarStock(articulo.sku, -1)} disabled={articulo.stock === 0} aria-label={`Restar una unidad de ${articulo.nombre}`}>
        −
      </button>
      <span className={`min-w-[3ch] text-center font-semibold tabular-nums ${grande ? 'text-lg' : ''}`}>{articulo.stock}</span>
      <button type="button" className={`paso-stock ${tamano}`} onClick={() => ajustarStock(articulo.sku, 1)} aria-label={`Sumar una unidad de ${articulo.nombre}`}>
        +
      </button>
    </div>
  );
}
