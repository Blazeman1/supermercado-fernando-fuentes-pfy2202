import { estadoStock } from './formato';

// Funciones PURAS de consulta sobre el inventario.
// Reciben el arreglo original y devuelven uno NUEVO (filter/sort sobre
// una copia): el estado global nunca se modifica al filtrar u ordenar.

export function filtrarArticulos(articulos, { texto = '', categoria = '', estado = '' } = {}) {
  const busqueda = texto.trim().toLowerCase();
  return articulos.filter(
    (a) =>
      (!busqueda || [a.nombre, a.marca, a.sku].some((v) => v.toLowerCase().includes(busqueda))) &&
      (!categoria || a.tipo === categoria) &&
      (!estado || estadoStock(a).clave === estado)
  );
}

export function ordenarArticulos(articulos, campo = 'nombre', direccion = 'asc') {
  const signo = direccion === 'desc' ? -1 : 1;
  return [...articulos].sort((x, y) =>
    typeof x[campo] === 'number'
      ? (x[campo] - y[campo]) * signo
      : String(x[campo]).localeCompare(String(y[campo]), 'es') * signo
  );
}

// Cantidad de artículos por categoría, calculada sobre el inventario COMPLETO.
export function contarPorCategoria(articulos) {
  return articulos.reduce((acc, a) => {
    acc[a.tipo] = (acc[a.tipo] ?? 0) + 1;
    return acc;
  }, {});
}
