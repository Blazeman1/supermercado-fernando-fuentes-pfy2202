import { describe, expect, it } from 'vitest';
import { PRODUCTOS_INICIALES } from '../data/productos';
import { contarPorCategoria, filtrarArticulos, ordenarArticulos } from './inventario';

describe('filtrarArticulos', () => {
  it('filtra por categoría sin modificar el inventario original', () => {
    const copiaAntes = structuredClone(PRODUCTOS_INICIALES);
    const lacteos = filtrarArticulos(PRODUCTOS_INICIALES, { categoria: 'Lácteos' });

    expect(lacteos).toHaveLength(3);
    expect(lacteos.every((a) => a.tipo === 'Lácteos')).toBe(true);
    expect(lacteos).not.toBe(PRODUCTOS_INICIALES);
    expect(PRODUCTOS_INICIALES).toEqual(copiaAntes);
  });

  it('sin categoría devuelve todos los artículos', () => {
    expect(filtrarArticulos(PRODUCTOS_INICIALES, {})).toHaveLength(PRODUCTOS_INICIALES.length);
  });

  it('combina categoría, texto y estado de stock', () => {
    const r = filtrarArticulos(PRODUCTOS_INICIALES, { categoria: 'Lácteos', texto: 'queso', estado: 'critico' });
    expect(r.map((a) => a.sku)).toEqual(['LAC-003']);
  });
});

describe('ordenarArticulos', () => {
  it('ordena números y textos sin alterar el arreglo recibido', () => {
    const original = [...PRODUCTOS_INICIALES];
    const porPrecio = ordenarArticulos(PRODUCTOS_INICIALES, 'precio', 'desc');
    expect(porPrecio[0].sku).toBe('LIM-001');
    expect(PRODUCTOS_INICIALES).toEqual(original);
  });
});

describe('contarPorCategoria', () => {
  it('cuenta artículos por categoría', () => {
    expect(contarPorCategoria(PRODUCTOS_INICIALES)).toMatchObject({ Abarrotes: 3, Lácteos: 3, Panadería: 1 });
  });
});
