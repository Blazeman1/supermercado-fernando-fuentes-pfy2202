import { NavLink } from 'react-router-dom';

// NUEVO MENÚ (semana 2): navega a las dos páginas de gestión de artículos.
// Vive en el encabezado, separado del menú inferior de la semana 1.
// "end" en /articulos evita que quede activo al estar en /articulos/nuevo.
const ENLACES = [
  { to: '/articulos', texto: 'Listado de artículos', end: true },
  { to: '/articulos/nuevo', texto: 'Ingresar artículo' },
];

export default function MenuInventario() {
  return (
    <nav aria-label="Menú de inventario" className="w-full sm:w-auto">
      <ul className="flex gap-1 rounded-lg bg-marca-700/60 p-1">
        {ENLACES.map(({ to, texto, end }) => (
          <li key={to} className="flex-1 sm:flex-none">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `block rounded-md px-4 py-2 text-center text-sm font-semibold transition-colors ${
                  isActive ? 'bg-white text-marca-700 shadow-sm' : 'text-marca-50 hover:bg-marca-600'
                }`
              }
            >
              {texto}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
