import { PRODUCTOS_INICIALES } from '../data/productos';

// ESTADO DE LA TIENDA
// {
//   articulos: [{ sku, nombre, marca, tipo, precio, stock, stockMinimo }],
//   carrito:   [{ sku, cantidad }]
// }
// El carrito guarda solo el SKU y la cantidad: los datos del artículo se
// leen desde "articulos", así no hay información duplicada que pueda
// quedar desactualizada (estado normalizado).
//
// Invariante: para cada artículo, stock + cantidad en carrito se mantiene
// constante al mover unidades entre inventario y carrito. Por eso ambas
// listas se modifican en la MISMA acción: nunca puede quedar una
// actualizada y la otra no.

export const ACCIONES = {
  // Inventario
  AGREGAR: 'AGREGAR',
  AJUSTAR_STOCK: 'AJUSTAR_STOCK',
  ELIMINAR: 'ELIMINAR',
  RESTABLECER: 'RESTABLECER',
  // Carrito
  AGREGAR_AL_CARRITO: 'AGREGAR_AL_CARRITO',
  CAMBIAR_CANTIDAD: 'CAMBIAR_CANTIDAD',
  QUITAR_DEL_CARRITO: 'QUITAR_DEL_CARRITO',
  VACIAR_CARRITO: 'VACIAR_CARRITO',
  CONFIRMAR_COMPRA: 'CONFIRMAR_COMPRA',
};

export const ESTADO_INICIAL = { articulos: PRODUCTOS_INICIALES, carrito: [] };

const cantidadEnCarrito = (carrito, sku) => carrito.find((i) => i.sku === sku)?.cantidad ?? 0;

// Mueve unidades entre inventario y carrito.
//   delta > 0: del inventario al carrito (limitado por el stock disponible)
//   delta < 0: del carrito al inventario (limitado por lo que hay en el carrito)
// Devuelve un estado NUEVO; si no hay nada que mover, devuelve el mismo.
function moverUnidades(estado, sku, delta) {
  const articulo = estado.articulos.find((a) => a.sku === sku);
  if (!articulo || delta === 0) return estado;

  const enCarrito = cantidadEnCarrito(estado.carrito, sku);
  const movimiento = delta > 0 ? Math.min(delta, articulo.stock) : -Math.min(-delta, enCarrito);
  if (movimiento === 0) return estado;

  const articulos = estado.articulos.map((a) => (a.sku === sku ? { ...a, stock: a.stock - movimiento } : a));
  const nuevaCantidad = enCarrito + movimiento;
  const carrito =
    enCarrito === 0
      ? [...estado.carrito, { sku, cantidad: nuevaCantidad }]
      : nuevaCantidad === 0
        ? estado.carrito.filter((i) => i.sku !== sku)
        : estado.carrito.map((i) => (i.sku === sku ? { ...i, cantidad: nuevaCantidad } : i));

  return { articulos, carrito };
}

// Reducer: función pura (estado, acción) => nuevo estado. Nunca modifica
// los arreglos recibidos (inmutabilidad), así React detecta cada cambio.
export function tiendaReducer(estado, accion) {
  switch (accion.type) {
    case ACCIONES.AGREGAR:
      return { ...estado, articulos: [...estado.articulos, accion.payload] };

    case ACCIONES.AJUSTAR_STOCK: {
      const { sku, delta } = accion.payload;
      return {
        ...estado,
        articulos: estado.articulos.map((a) => (a.sku === sku ? { ...a, stock: Math.max(0, a.stock + delta) } : a)),
      };
    }

    case ACCIONES.ELIMINAR: {
      const { sku } = accion.payload;
      return {
        articulos: estado.articulos.filter((a) => a.sku !== sku),
        carrito: estado.carrito.filter((i) => i.sku !== sku),
      };
    }

    case ACCIONES.RESTABLECER:
      return ESTADO_INICIAL;

    case ACCIONES.AGREGAR_AL_CARRITO:
      return moverUnidades(estado, accion.payload.sku, Math.max(0, accion.payload.cantidad));

    case ACCIONES.CAMBIAR_CANTIDAD:
      return moverUnidades(estado, accion.payload.sku, accion.payload.delta);

    case ACCIONES.QUITAR_DEL_CARRITO: {
      const { sku } = accion.payload;
      return moverUnidades(estado, sku, -cantidadEnCarrito(estado.carrito, sku));
    }

    case ACCIONES.VACIAR_CARRITO:
      // Devuelve al inventario todas las unidades reservadas.
      return estado.carrito.reduce((acc, item) => moverUnidades(acc, item.sku, -item.cantidad), estado);

    case ACCIONES.CONFIRMAR_COMPRA:
      // Las unidades ya se descontaron al agregarlas: solo se vacía el carrito.
      return { ...estado, carrito: [] };

    default:
      throw new Error(`Acción desconocida: ${accion.type}`);
  }
}

// ---------- Persistencia ----------
export const CLAVE_STORAGE = 'tienda-mercado-austral-v3';
const CLAVE_STORAGE_V2 = 'inventario-mercado-austral-v2';

// Inicializador perezoso de useReducer: se ejecuta solo en el primer render.
// Si existe el inventario de la semana 2 (solo un arreglo), lo migra.
export function cargarEstadoInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (guardado) {
      const { articulos, carrito } = JSON.parse(guardado);
      if (Array.isArray(articulos) && Array.isArray(carrito)) return { articulos, carrito };
    }
    const anterior = JSON.parse(localStorage.getItem(CLAVE_STORAGE_V2));
    if (Array.isArray(anterior)) return { articulos: anterior, carrito: [] };
  } catch {
    /* almacenamiento no disponible o datos corruptos */
  }
  return ESTADO_INICIAL;
}
