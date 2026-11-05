import { Link } from 'react-router-dom';

// Botón reutilizable con variantes de estilo (definidas con @apply en index.css).
// Si recibe "to" se renderiza como <Link> de React Router; si no, como <button>.
const VARIANTES = {
  primario: 'btn-primario',
  secundario: 'btn-secundario',
  peligro: 'btn-peligro',
  fantasma: 'btn text-stone-600 hover:bg-stone-100',
};

const TAMANOS = { sm: 'px-3 py-1.5 text-xs', md: '', lg: 'px-5 py-3 text-base' };

export default function Boton({ variante = 'primario', tamano = 'md', to, className = '', type = 'button', ...props }) {
  const clases = `${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`.trim();
  if (to) return <Link to={to} className={clases} {...props} />;
  return <button type={type} className={clases} {...props} />;
}
