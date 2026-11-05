import { useInventario } from '../../context/hooks';
import SelectorCantidad from '../ui/SelectorCantidad';

// Ajuste administrativo del stock (recepción de mercadería, mermas).
// Reutiliza SelectorCantidad y despacha AJUSTAR_STOCK al estado global.
export default function AjusteStock({ articulo, grande = false }) {
  const { ajustarStock } = useInventario();
  return (
    <SelectorCantidad
      valor={articulo.stock}
      etiqueta={`stock de ${articulo.nombre}`}
      onRestar={() => ajustarStock(articulo.sku, -1)}
      onSumar={() => ajustarStock(articulo.sku, 1)}
      puedeRestar={articulo.stock > 0}
      grande={grande}
    />
  );
}
