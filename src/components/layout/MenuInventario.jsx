import { NavLink } from 'react-router-dom';

// NUEVO MENÚ (semana 2): navega a las dos páginas de gestión de artículos.
// Vive en el encabezado, separado del menú inferior de la semana 1.
// "end" en /articulos evita que quede activo al estar en /articulos/nuevo.
const ENLACES = [
  { to: '/articulos', texto: 'Listado de artículos', corto: 'Listado', end: true },
  { to: '/articulos/nuevo', texto: 'Ingresar artículo', corto: 'Ingresar' },
];

export default function MenuInventario() {
  return (
    <nav aria-label="Menú de inventario" className="flex-1 sm:flex-none">
      <ul className="flex gap-1 rounded-lg bg-marca-700/60 p-1">
        {ENLACES.map(({ to, texto, corto, end }) => (
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
              {/* Etiqueta corta en pantallas chicas, completa desde sm */}
              <span className="sm:hidden">{corto}</span>
              <span className="hidden sm:inline">{texto}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
