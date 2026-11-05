import { NavLink } from 'react-router-dom';
import { useCarrito } from '../../context/hooks';

// Acceso al carrito en el encabezado, con la cantidad de unidades reservadas.
export default function BotonCarrito() {
  const { totalUnidades } = useCarrito();
  return (
    <NavLink
      to="/carrito"
      aria-label={`Carrito de compras, ${totalUnidades} ${totalUnidades === 1 ? 'unidad' : 'unidades'}`}
      className={({ isActive }) =>
        `relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          isActive ? 'bg-white text-marca-700' : 'bg-marca-700/60 text-white hover:bg-marca-700'
        }`
      }
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2" />
        <circle cx="9.5" cy="19.5" r="1.2" />
        <circle cx="17" cy="19.5" r="1.2" />
      </svg>
      <span>Carrito</span>
      {totalUnidades > 0 && (
        <span className="grid min-w-[1.4rem] place-items-center rounded-full bg-acento-400 px-1.5 text-xs font-bold text-marca-900 tabular-nums">
          {totalUnidades}
        </span>
      )}
    </NavLink>
  );
}
