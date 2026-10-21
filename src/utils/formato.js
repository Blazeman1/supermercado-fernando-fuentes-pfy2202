// Utilidades puras de presentación del inventario.
export const estadoStock = (p) => {
  if (p.stock === 0) return { clave: 'agotado', texto: 'Agotado' };
  if (p.stock < p.stockMinimo) return { clave: 'critico', texto: 'Stock crítico' };
  return { clave: 'ok', texto: 'Disponible' };
};

export const clp = (n) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
