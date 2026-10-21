// Datos iniciales del inventario (simulan la respuesta de una API).
// stockMinimo: umbral bajo el cual el producto se considera "stock crítico".
export const CATEGORIAS = ['Abarrotes', 'Lácteos', 'Bebidas', 'Frutas y verduras', 'Limpieza', 'Panadería'];

export const PRODUCTOS_INICIALES = [
  { sku: 'ABA-001', nombre: 'Arroz grado 1 (1 kg)', categoria: 'Abarrotes', precio: 1590, stock: 120, stockMinimo: 40, proveedor: 'Distribuidora Central' },
  { sku: 'ABA-002', nombre: 'Fideos spaghetti (400 g)', categoria: 'Abarrotes', precio: 990, stock: 25, stockMinimo: 30, proveedor: 'Pastas del Sur' },
  { sku: 'ABA-003', nombre: 'Aceite maravilla (1 L)', categoria: 'Abarrotes', precio: 2890, stock: 64, stockMinimo: 20, proveedor: 'Distribuidora Central' },
  { sku: 'LAC-001', nombre: 'Leche entera (1 L)', categoria: 'Lácteos', precio: 1150, stock: 18, stockMinimo: 50, proveedor: 'Lácteos del Valle' },
  { sku: 'LAC-002', nombre: 'Yogur natural (1 kg)', categoria: 'Lácteos', precio: 2290, stock: 42, stockMinimo: 15, proveedor: 'Lácteos del Valle' },
  { sku: 'LAC-003', nombre: 'Queso gauda laminado (250 g)', categoria: 'Lácteos', precio: 3490, stock: 9, stockMinimo: 12, proveedor: 'Quesería Osorno' },
  { sku: 'BEB-001', nombre: 'Agua mineral sin gas (1,6 L)', categoria: 'Bebidas', precio: 890, stock: 200, stockMinimo: 60, proveedor: 'Aguas Andinas Norte' },
  { sku: 'BEB-002', nombre: 'Jugo de naranja (1 L)', categoria: 'Bebidas', precio: 1790, stock: 33, stockMinimo: 25, proveedor: 'Frutícola Maipo' },
  { sku: 'FYV-001', nombre: 'Manzana roja (kg)', categoria: 'Frutas y verduras', precio: 1490, stock: 75, stockMinimo: 30, proveedor: 'Frutícola Maipo' },
  { sku: 'FYV-002', nombre: 'Palta hass (kg)', categoria: 'Frutas y verduras', precio: 4990, stock: 0, stockMinimo: 20, proveedor: 'Agrícola Quillota' },
  { sku: 'LIM-001', nombre: 'Detergente líquido (3 L)', categoria: 'Limpieza', precio: 7990, stock: 28, stockMinimo: 10, proveedor: 'Química Hogar' },
  { sku: 'LIM-002', nombre: 'Cloro gel (900 ml)', categoria: 'Limpieza', precio: 1690, stock: 51, stockMinimo: 20, proveedor: 'Química Hogar' },
  { sku: 'PAN-001', nombre: 'Pan de molde integral', categoria: 'Panadería', precio: 2390, stock: 14, stockMinimo: 15, proveedor: 'Panificadora Austral' },
];
