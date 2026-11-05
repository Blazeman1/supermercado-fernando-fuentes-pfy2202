import { NavLink } from 'react-router-dom';

// Menú inferior fijo (semana 1). NavLink cambia la URL sin recargar y
// entrega isActive para destacar la ruta actual (además de aria-current).
const ENLACES = [
  { to: '/', texto: 'Inicio', icono: 'M3 9l9-6 9 6v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z', end: true },
  { to: '/tiendas', texto: 'Nuestras tiendas', icono: 'M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zm0-9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
  { to: '/contacto', texto: 'Contáctanos', icono: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 1.5 8 6 8-6' },
];

export default function MenuInferior() {
  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-40 h-[72px] border-t border-stone-200 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <ul className="mx-auto grid h-full max-w-xl grid-cols-3">
        {ENLACES.map(({ to, texto, icono, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-full flex-col items-center justify-center gap-0.5 border-t-[3px] text-xs transition-colors ${
                  isActive ? 'border-marca-600 bg-marca-50 font-bold text-marca-700' : 'border-transparent font-medium text-stone-500 hover:text-marca-600'
                }`
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-[1.8]" strokeLinejoin="round" strokeLinecap="round">
                <path d={icono} />
              </svg>
              <span>{texto}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
