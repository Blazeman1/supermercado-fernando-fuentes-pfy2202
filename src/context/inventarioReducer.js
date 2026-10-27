import { PRODUCTOS_INICIALES } from '../data/productos';

// Tipos de acción del reducer. Centralizarlos en una constante evita
// errores de tipeo ("AGREGAR" vs "AGREGRAR") al despachar acciones.
export const ACCIONES = {
  AGREGAR: 'AGREGAR',
  AJUSTAR_STOCK: 'AJUSTAR_STOCK',
  ELIMINAR: 'ELIMINAR',
  RESTABLECER: 'RESTABLECER',
};

// Reducer: función pura (estado, acción) => nuevo estado.
// Nunca modifica el arreglo recibido; siempre devuelve uno nuevo, lo que
// permite a React detectar el cambio y volver a renderizar.
export function inventarioReducer(articulos, accion) {
  switch (accion.type) {
    case ACCIONES.AGREGAR:
      return [...articulos, accion.payload];

    case ACCIONES.AJUSTAR_STOCK: {
      const { sku, delta } = accion.payload;
      return articulos.map((a) => (a.sku === sku ? { ...a, stock: Math.max(0, a.stock + delta) } : a));
    }

    case ACCIONES.ELIMINAR:
      return articulos.filter((a) => a.sku !== accion.payload.sku);

    case ACCIONES.RESTABLECER:
      return PRODUCTOS_INICIALES;

    default:
      throw new Error(`Acción desconocida: ${accion.type}`);
  }
}

// Clave versionada: la v2 agrega "marca" y renombra "categoria" a "tipo",
// así no se mezclan datos guardados con la estructura de la semana 1.
export const CLAVE_STORAGE = 'inventario-mercado-austral-v2';

// Inicializador perezoso de useReducer: se ejecuta solo en el primer render.
export function cargarEstadoInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (guardado) return JSON.parse(guardado);
  } catch {
    /* almacenamiento no disponible o datos corruptos: se usan los iniciales */
  }
  return PRODUCTOS_INICIALES;
}
