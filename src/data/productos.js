// Datos iniciales del inventario (simulan la respuesta de una API).
// Cada artículo incluye nombre, marca y tipo de producto, más los datos
// de stock que usa el panel de inventario.
// stockMinimo: umbral bajo el cual el artículo se considera "stock crítico".
export const TIPOS = ['Abarrotes', 'Lácteos', 'Bebidas', 'Frutas y verduras', 'Limpieza', 'Panadería', 'Congelados', 'Cuidado personal'];

export const PRODUCTOS_INICIALES = [
  { sku: 'ABA-001', nombre: 'Arroz grado 1 (1 kg)', marca: 'Campo Sur', tipo: 'Abarrotes', precio: 1590, stock: 120, stockMinimo: 40 },
  { sku: 'ABA-002', nombre: 'Fideos spaghetti (400 g)', marca: 'Pastas del Sur', tipo: 'Abarrotes', precio: 990, stock: 25, stockMinimo: 30 },
  { sku: 'ABA-003', nombre: 'Aceite maravilla (1 L)', marca: 'Oro Andino', tipo: 'Abarrotes', precio: 2890, stock: 64, stockMinimo: 20 },
  { sku: 'LAC-001', nombre: 'Leche entera (1 L)', marca: 'Lácteos del Valle', tipo: 'Lácteos', precio: 1150, stock: 18, stockMinimo: 50 },
  { sku: 'LAC-002', nombre: 'Yogur natural (1 kg)', marca: 'Lácteos del Valle', tipo: 'Lácteos', precio: 2290, stock: 42, stockMinimo: 15 },
  { sku: 'LAC-003', nombre: 'Queso gauda laminado (250 g)', marca: 'Quesería Osorno', tipo: 'Lácteos', precio: 3490, stock: 9, stockMinimo: 12 },
  { sku: 'BEB-001', nombre: 'Agua mineral sin gas (1,6 L)', marca: 'Vertiente Clara', tipo: 'Bebidas', precio: 890, stock: 200, stockMinimo: 60 },
  { sku: 'BEB-002', nombre: 'Jugo de naranja (1 L)', marca: 'Frutícola Maipo', tipo: 'Bebidas', precio: 1790, stock: 33, stockMinimo: 25 },
  { sku: 'FYV-001', nombre: 'Manzana roja (kg)', marca: 'Frutícola Maipo', tipo: 'Frutas y verduras', precio: 1490, stock: 75, stockMinimo: 30 },
  { sku: 'FYV-002', nombre: 'Palta hass (kg)', marca: 'Agrícola Quillota', tipo: 'Frutas y verduras', precio: 4990, stock: 0, stockMinimo: 20 },
  { sku: 'LIM-001', nombre: 'Detergente líquido (3 L)', marca: 'Brillo Hogar', tipo: 'Limpieza', precio: 7990, stock: 28, stockMinimo: 10 },
  { sku: 'LIM-002', nombre: 'Cloro gel (900 ml)', marca: 'Brillo Hogar', tipo: 'Limpieza', precio: 1690, stock: 51, stockMinimo: 20 },
  { sku: 'PAN-001', nombre: 'Pan de molde integral', marca: 'Panificadora Austral', tipo: 'Panadería', precio: 2390, stock: 14, stockMinimo: 15 },
];
