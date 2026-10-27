import { CLASES_ESTADO, estadoStock } from '../utils/formato';

// Chip reutilizable que muestra el estado de stock de un artículo.
export default function EstadoStock({ articulo }) {
  const { clave, texto } = estadoStock(articulo);
  return <span className={`chip ${CLASES_ESTADO[clave]}`}>{texto}</span>;
}
