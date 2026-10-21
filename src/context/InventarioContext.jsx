import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTOS_INICIALES } from '../data/productos';

// El inventario vive en un contexto para que lo compartan el Home y la
// ruta dinámica /producto/:sku sin perder el estado al navegar entre rutas.
const InventarioContext = createContext(null);
const CLAVE_STORAGE = 'inventario-mercado-austral';

function cargarInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (guardado) return JSON.parse(guardado);
  } catch {
    /* almacenamiento no disponible: se usan los datos iniciales */
  }
  return PRODUCTOS_INICIALES;
}

export function InventarioProvider({ children }) {
  const [productos, setProductos] = useState(cargarInicial);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
    } catch {
      /* se ignora: el inventario sigue funcionando en memoria */
    }
  }, [productos]);

  const valor = useMemo(() => {
    const ajustarStock = (sku, delta) =>
      setProductos((prev) =>
        prev.map((p) => (p.sku === sku ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
      );

    const agregarProducto = (nuevo) => setProductos((prev) => [...prev, nuevo]);

    const eliminarProducto = (sku) => setProductos((prev) => prev.filter((p) => p.sku !== sku));

    const restablecer = () => setProductos(PRODUCTOS_INICIALES);

    return { productos, ajustarStock, agregarProducto, eliminarProducto, restablecer };
  }, [productos]);

  return <InventarioContext.Provider value={valor}>{children}</InventarioContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInventario() {
  const ctx = useContext(InventarioContext);
  if (!ctx) throw new Error('useInventario debe usarse dentro de <InventarioProvider>');
  return ctx;
}
