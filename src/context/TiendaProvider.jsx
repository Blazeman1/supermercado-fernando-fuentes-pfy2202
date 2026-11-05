import { useEffect, useMemo, useReducer } from 'react';
import { TiendaContext } from './TiendaContext';
import { CLAVE_STORAGE, cargarEstadoInicial, tiendaReducer } from './tiendaReducer';

// Proveedor del estado global: un solo useReducer para inventario y
// carrito (sus cambios son interdependientes), expuesto por Context.
export default function TiendaProvider({ children }) {
  const [estado, dispatch] = useReducer(tiendaReducer, undefined, cargarEstadoInicial);

  // Efecto secundario: persiste el estado en el navegador en cada cambio.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(estado));
    } catch {
      /* se ignora: la tienda sigue funcionando en memoria */
    }
  }, [estado]);

  const valor = useMemo(() => ({ estado, dispatch }), [estado]);
  return <TiendaContext.Provider value={valor}>{children}</TiendaContext.Provider>;
}
