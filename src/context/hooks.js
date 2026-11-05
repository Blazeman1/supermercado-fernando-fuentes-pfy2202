import { useContext, useMemo } from 'react';
import { TiendaContext } from './TiendaContext';
import { ACCIONES } from './tiendaReducer';

function useTienda() {
  const ctx = useContext(TiendaContext);
  if (!ctx) throw new Error('Este hook debe usarse dentro de <TiendaProvider>');
  return ctx;
}

// Hook del INVENTARIO: artículos y acciones de administración.
// Cada función encapsula un dispatch: los componentes no necesitan
// conocer la forma interna de las acciones.
export function useInventario() {
  const { estado, dispatch } = useTienda();
  return useMemo(
    () => ({
      articulos: estado.articulos,
      agregarArticulo: (articulo) => dispatch({ type: ACCIONES.AGREGAR, payload: articulo }),
      ajustarStock: (sku, delta) => dispatch({ type: ACCIONES.AJUSTAR_STOCK, payload: { sku, delta } }),
      eliminarArticulo: (sku) => dispatch({ type: ACCIONES.ELIMINAR, payload: { sku } }),
      restablecer: () => dispatch({ type: ACCIONES.RESTABLECER }),
    }),
    [estado.articulos, dispatch]
  );
}

// Hook del CARRITO: ítems enriquecidos con los datos del artículo,
// totales DERIVADOS (no se guardan en el estado) y acciones del carrito.
export function useCarrito() {
  const { estado, dispatch } = useTienda();
  return useMemo(() => {
    const items = estado.carrito
      .map(({ sku, cantidad }) => {
        const articulo = estado.articulos.find((a) => a.sku === sku);
        return articulo && { articulo, cantidad, subtotal: articulo.precio * cantidad };
      })
      .filter(Boolean);

    return {
      items,
      totalUnidades: items.reduce((s, i) => s + i.cantidad, 0),
      total: items.reduce((s, i) => s + i.subtotal, 0),
      cantidadDe: (sku) => estado.carrito.find((i) => i.sku === sku)?.cantidad ?? 0,
      agregarAlCarrito: (sku, cantidad = 1) => dispatch({ type: ACCIONES.AGREGAR_AL_CARRITO, payload: { sku, cantidad } }),
      cambiarCantidad: (sku, delta) => dispatch({ type: ACCIONES.CAMBIAR_CANTIDAD, payload: { sku, delta } }),
      quitarDelCarrito: (sku) => dispatch({ type: ACCIONES.QUITAR_DEL_CARRITO, payload: { sku } }),
      vaciarCarrito: () => dispatch({ type: ACCIONES.VACIAR_CARRITO }),
      confirmarCompra: () => dispatch({ type: ACCIONES.CONFIRMAR_COMPRA }),
    };
  }, [estado.articulos, estado.carrito, dispatch]);
}
