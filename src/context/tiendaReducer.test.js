import { describe, expect, it } from 'vitest';
import { ACCIONES, ESTADO_INICIAL, tiendaReducer } from './tiendaReducer';

const stock = (estado, sku) => estado.articulos.find((a) => a.sku === sku).stock;
const enCarrito = (estado, sku) => estado.carrito.find((i) => i.sku === sku)?.cantidad ?? 0;
const aplicar = (estado, ...acciones) => acciones.reduce(tiendaReducer, estado);

describe('tiendaReducer · carrito e inventario', () => {
  it('agregar al carrito descuenta el stock en la misma acción', () => {
    const s = aplicar(ESTADO_INICIAL, { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { sku: 'LAC-001', cantidad: 5 } });
    expect(stock(s, 'LAC-001')).toBe(13);
    expect(enCarrito(s, 'LAC-001')).toBe(5);
  });

  it('no modifica el estado original (inmutabilidad)', () => {
    aplicar(ESTADO_INICIAL, { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { sku: 'LAC-001', cantidad: 5 } });
    expect(stock(ESTADO_INICIAL, 'LAC-001')).toBe(18);
    expect(ESTADO_INICIAL.carrito).toHaveLength(0);
  });

  it('no permite reservar más unidades que el stock disponible', () => {
    const s = aplicar(ESTADO_INICIAL, { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { sku: 'LAC-001', cantidad: 100 } });
    expect(stock(s, 'LAC-001')).toBe(0);
    expect(enCarrito(s, 'LAC-001')).toBe(18);
    const sinCambio = tiendaReducer(s, { type: ACCIONES.CAMBIAR_CANTIDAD, payload: { sku: 'LAC-001', delta: 1 } });
    expect(sinCambio).toBe(s);
  });

  it('un artículo agotado no entra al carrito', () => {
    const s = tiendaReducer(ESTADO_INICIAL, { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { sku: 'FYV-002', cantidad: 1 } });
    expect(s).toBe(ESTADO_INICIAL);
  });

  it('disminuir la cantidad devuelve unidades y elimina el ítem al llegar a 0', () => {
    const s = aplicar(
      ESTADO_INICIAL,
      { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { sku: 'ABA-001', cantidad: 2 } },
      { type: ACCIONES.CAMBIAR_CANTIDAD, payload: { sku: 'ABA-001', delta: -1 } }
    );
    expect(stock(s, 'ABA-001')).toBe(119);
    const vacio = tiendaReducer(s, { type: ACCIONES.CAMBIAR_CANTIDAD, payload: { sku: 'ABA-001', delta: -1 } });
    expect(stock(vacio, 'ABA-001')).toBe(120);
    expect(vacio.carrito).toHaveLength(0);
  });

  it('quitar un ítem devuelve todas sus unidades', () => {
    const s = aplicar(
      ESTADO_INICIAL,
      { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { sku: 'BEB-001', cantidad: 10 } },
      { type: ACCIONES.QUITAR_DEL_CARRITO, payload: { sku: 'BEB-001' } }
    );
    expect(stock(s, 'BEB-001')).toBe(200);
    expect(s.carrito).toHaveLength(0);
  });

  it('vaciar el carrito devuelve todo; confirmar la compra mantiene el descuento', () => {
    const conItems = aplicar(
      ESTADO_INICIAL,
      { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { sku: 'ABA-001', cantidad: 4 } },
      { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { sku: 'BEB-001', cantidad: 10 } }
    );
    const vaciado = tiendaReducer(conItems, { type: ACCIONES.VACIAR_CARRITO });
    expect(stock(vaciado, 'ABA-001')).toBe(120);
    expect(stock(vaciado, 'BEB-001')).toBe(200);
    expect(vaciado.carrito).toHaveLength(0);

    const comprado = tiendaReducer(conItems, { type: ACCIONES.CONFIRMAR_COMPRA });
    expect(stock(comprado, 'ABA-001')).toBe(116);
    expect(comprado.carrito).toHaveLength(0);
  });

  it('eliminar un artículo del inventario también lo saca del carrito', () => {
    const s = aplicar(
      ESTADO_INICIAL,
      { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { sku: 'BEB-001', cantidad: 1 } },
      { type: ACCIONES.ELIMINAR, payload: { sku: 'BEB-001' } }
    );
    expect(s.carrito).toHaveLength(0);
    expect(s.articulos.some((a) => a.sku === 'BEB-001')).toBe(false);
  });
});
