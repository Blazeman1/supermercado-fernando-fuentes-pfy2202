// Utilidades puras de presentación del inventario.
export const estadoStock = (p) => {
  if (p.stock === 0) return { clave: 'agotado', texto: 'Agotado' };
  if (p.stock < p.stockMinimo) return { clave: 'critico', texto: 'Stock crítico' };
  return { clave: 'ok', texto: 'Disponible' };
};

export const clp = (n) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

// Clases de Tailwind para cada estado de stock (chip de color).
export const CLASES_ESTADO = {
  ok: 'bg-marca-50 text-marca-700',
  critico: 'bg-acento-100 text-acento-700',
  agotado: 'bg-red-50 text-red-700',
};
