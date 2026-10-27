import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { ACCIONES, CLAVE_STORAGE, cargarEstadoInicial, inventarioReducer } from './inventarioReducer';

// ESTADO GLOBAL DEL INVENTARIO
// useReducer guarda la lista de artículos y la lógica para modificarla;
// el Context la pone a disposición de cualquier componente del árbol
// (panel, tabla, formulario, detalle) sin pasar props nivel por nivel.
const InventarioContext = createContext(null);

export function InventarioProvider({ children }) {
  const [articulos, dispatch] = useReducer(inventarioReducer, undefined, cargarEstadoInicial);

  // Efecto secundario: cada vez que cambia el estado, se persiste en el
  // navegador para que el inventario sobreviva a una recarga.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(articulos));
    } catch {
      /* se ignora: el inventario sigue funcionando en memoria */
    }
  }, [articulos]);

  // Funciones "con nombre" que encapsulan cada dispatch: los componentes
  // llaman agregarArticulo(...) sin conocer la forma interna de la acción.
  const valor = useMemo(
    () => ({
      articulos,
      agregarArticulo: (articulo) => dispatch({ type: ACCIONES.AGREGAR, payload: articulo }),
      ajustarStock: (sku, delta) => dispatch({ type: ACCIONES.AJUSTAR_STOCK, payload: { sku, delta } }),
      eliminarArticulo: (sku) => dispatch({ type: ACCIONES.ELIMINAR, payload: { sku } }),
      restablecer: () => dispatch({ type: ACCIONES.RESTABLECER }),
    }),
    [articulos]
  );

  return <InventarioContext.Provider value={valor}>{children}</InventarioContext.Provider>;
}

// Hook personalizado para consumir el contexto con una validación útil.
// eslint-disable-next-line react-refresh/only-export-components
export function useInventario() {
  const ctx = useContext(InventarioContext);
  if (!ctx) throw new Error('useInventario debe usarse dentro de <InventarioProvider>');
  return ctx;
}
