import { useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { TIPOS } from '../data/productos';
import { useInventario } from '../context/InventarioContext';
import { clp, estadoStock } from '../utils/formato';
import EstadoStock from '../components/EstadoStock';
import AjusteStock from '../components/AjusteStock';

const COLUMNAS_ORDEN = { nombre: 'Nombre', marca: 'Marca', tipo: 'Tipo', precio: 'Precio', stock: 'Stock' };

// Encabezado de columna ordenable. Se define FUERA del componente de página
// para que React no lo trate como un componente nuevo en cada render.
function Encabezado({ col, orden, dir, onOrdenar, alinear = 'text-left' }) {
  const activo = orden === col;
  return (
    <th scope="col" className={`px-4 py-3 ${alinear}`} aria-sort={activo ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => onOrdenar(col)} className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-marca-700">
        {COLUMNAS_ORDEN[col]}
        <span aria-hidden="true" className={activo ? 'text-marca-600' : 'text-stone-300'}>{activo && dir === 'desc' ? '▼' : '▲'}</span>
      </button>
    </th>
  );
}

// PÁGINA DE LISTADO (semana 2): tabla con todos los artículos del estado global.
export default function ListadoArticulos() {
  const { articulos, restablecer } = useInventario();
  const { state } = useLocation(); // { nuevoSku } cuando se llega desde el formulario

  // Filtros y orden en la URL (?q=&tipo=&estado=&orden=&dir=): compartibles y
  // conservados al volver desde el detalle de un artículo.
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const tipo = params.get('tipo') ?? '';
  const estado = params.get('estado') ?? '';
  const orden = params.get('orden') ?? 'nombre';
  const dir = params.get('dir') === 'desc' ? 'desc' : 'asc';

  const actualizar = (cambios) => {
    const siguiente = new URLSearchParams(params);
    Object.entries(cambios).forEach(([k, v]) => (v ? siguiente.set(k, v) : siguiente.delete(k)));
    setParams(siguiente, { replace: true, state }); // replace: no llena el historial
  };

  const ordenarPor = (col) => actualizar({ orden: col, dir: orden === col && dir === 'asc' ? 'desc' : 'asc' });

  const visibles = useMemo(() => {
    const texto = q.trim().toLowerCase();
    const filtrados = articulos.filter(
      (a) =>
        (!texto || [a.nombre, a.marca, a.sku].some((v) => v.toLowerCase().includes(texto))) &&
        (!tipo || a.tipo === tipo) &&
        (!estado || estadoStock(a).clave === estado)
    );
    const signo = dir === 'asc' ? 1 : -1;
    return [...filtrados].sort((x, y) =>
      typeof x[orden] === 'number' ? (x[orden] - y[orden]) * signo : String(x[orden]).localeCompare(String(y[orden]), 'es') * signo
    );
  }, [articulos, q, tipo, estado, orden, dir]);

  const hayFiltros = q || tipo || estado;
  const ordenProps = { orden, dir, onOrdenar: ordenarPor };

  return (
    <section aria-labelledby="titulo-listado" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="titulo-listado" className="text-2xl font-bold sm:text-3xl">Listado de artículos</h1>
          <p className="text-stone-600">Todos los artículos que actualmente están en el inventario.</p>
        </div>
        <Link to="/articulos/nuevo" className="btn-primario">+ Ingresar artículo</Link>
      </div>

      {state?.nuevoSku && (
        <p role="status" className="rounded-lg border border-marca-100 bg-marca-50 px-4 py-3 font-semibold text-marca-700">
          Artículo {state.nuevoSku} agregado al inventario. Aparece destacado en la tabla.
        </p>
      )}

      <div role="search" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end">
        <label>
          <span className="etiqueta">Buscar</span>
          <input type="search" className="campo" placeholder="Nombre, marca o SKU" value={q} onChange={(e) => actualizar({ q: e.target.value })} />
        </label>
        <label>
          <span className="etiqueta">Tipo de producto</span>
          <select className="campo" value={tipo} onChange={(e) => actualizar({ tipo: e.target.value })}>
            <option value="">Todos</option>
            {TIPOS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>
          <span className="etiqueta">Estado</span>
          <select className="campo" value={estado} onChange={(e) => actualizar({ estado: e.target.value })}>
            <option value="">Todos</option>
            <option value="ok">Disponible</option>
            <option value="critico">Stock crítico</option>
            <option value="agotado">Agotado</option>
          </select>
        </label>
        {hayFiltros && (
          <button type="button" className="btn-secundario" onClick={() => actualizar({ q: '', tipo: '', estado: '' })}>
            Limpiar filtros
          </button>
        )}
      </div>

      <p className="text-sm text-stone-500" aria-live="polite">
        Mostrando {visibles.length} de {articulos.length} artículos
      </p>

      {/* Móvil (< md): cada artículo como tarjeta. La tabla se muestra desde md. */}
      <ul className="space-y-3 md:hidden">
        {visibles.map((a) => (
          <li key={a.sku} className={`tarjeta p-4 ${a.sku === state?.nuevoSku ? 'border-acento-400 bg-acento-100/60' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link to={`/articulos/${a.sku}`} className="font-semibold text-marca-700 hover:underline">{a.nombre}</Link>
                <p className="text-sm text-stone-600">{a.marca} · {a.tipo}</p>
                <p className="font-mono text-xs text-stone-400">{a.sku}</p>
              </div>
              <EstadoStock articulo={a} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold tabular-nums">{clp(a.precio)}</span>
              <AjusteStock articulo={a} />
            </div>
          </li>
        ))}
        {visibles.length === 0 && <li className="tarjeta text-center text-stone-500">No hay artículos que coincidan con los filtros.</li>}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[760px] text-sm">
          <caption className="sr-only">Inventario de artículos con nombre, marca, tipo, precio, stock y estado</caption>
          <thead className="bg-stone-50 text-xs text-stone-500">
            <tr className="border-b border-stone-200">
              <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-wide">SKU</th>
              <Encabezado {...ordenProps} col="nombre" />
              <Encabezado {...ordenProps} col="marca" />
              <Encabezado {...ordenProps} col="tipo" />
              <Encabezado {...ordenProps} col="precio" alinear="text-right" />
              <Encabezado {...ordenProps} col="stock" alinear="text-center" />
              <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {visibles.map((a) => (
              <tr key={a.sku} className={a.sku === state?.nuevoSku ? 'bg-acento-100/60' : 'hover:bg-stone-50'}>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-stone-500">{a.sku}</td>
                <td className="px-4 py-3">
                  <Link to={`/articulos/${a.sku}`} className="font-medium text-marca-700 hover:underline">{a.nombre}</Link>
                </td>
                <td className="px-4 py-3">{a.marca}</td>
                <td className="px-4 py-3 text-stone-600">{a.tipo}</td>
                <td className="px-4 py-3 text-right tabular-nums">{clp(a.precio)}</td>
                <td className="px-4 py-3 text-center"><AjusteStock articulo={a} /></td>
                <td className="px-4 py-3"><EstadoStock articulo={a} /></td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-stone-500">No hay artículos que coincidan con los filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-right">
        <button type="button" className="text-sm text-stone-500 underline hover:text-stone-700" onClick={restablecer}>
          Restablecer datos de ejemplo
        </button>
      </div>
    </section>
  );
}
