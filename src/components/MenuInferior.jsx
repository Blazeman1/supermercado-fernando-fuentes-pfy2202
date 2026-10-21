import { NavLink } from 'react-router-dom';

// Menú inferior fijo. NavLink (a diferencia de <a>) cambia la URL sin
// recargar la página y agrega automáticamente la clase "active" y
// aria-current="page" al enlace de la ruta actual.
const ENLACES = [
  { to: '/', texto: 'Inventario', icono: 'M3 9l9-6 9 6v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z', end: true },
  { to: '/tiendas', texto: 'Nuestras tiendas', icono: 'M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zm0-9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
  { to: '/contacto', texto: 'Contáctanos', icono: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 1.5 8 6 8-6' },
];

export default function MenuInferior() {
  return (
    <nav className="menu-inferior" aria-label="Navegación principal">
      <ul>
        {ENLACES.map(({ to, texto, icono, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'activo' : undefined)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
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
