import { Link, useNavigate } from 'react-router-dom';
import { clp } from '../../utils/formato';
import EstadoStock from './EstadoStock';
import Tarjeta from '../ui/Tarjeta';

const COLUMNAS = { nombre: 'Nombre', marca: 'Marca', tipo: 'Categoría', precio: 'Precio', stock: 'Disponible' };

// Encabezado de columna ordenable (definido fuera para no re-montarse en cada render).
function Encabezado({ col, orden, dir, onOrdenar, alinear = 'text-left' }) {
  const activo = orden === col;
  return (
    <th scope="col" className={`px-4 py-3 ${alinear}`} aria-sort={activo ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => onOrdenar(col)} className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-marca-700">
        {COLUMNAS[col]}
        <span aria-hidden="true" className={activo ? 'text-marca-600' : 'text-stone-300'}>{activo && dir === 'desc' ? '▼' : '▲'}</span>
      </button>
    </th>
  );
}

// Lista de artículos: tarjetas en móvil (< md) y tabla desde md.
// Al hacer clic en un artículo se navega a su detalle (/articulos/:sku).
export default function TablaArticulos({ articulos, cantidadEnCarrito, destacado, orden, dir, onOrdenar }) {
  const navigate = useNavigate();
  const ordenProps = { orden, dir, onOrdenar };

  return (
    <>
      <ul className="space-y-3 md:hidden">
        {articulos.map((a) => (
          <li key={a.sku}>
            <Link to={`/articulos/${a.sku}`} className="block">
              <Tarjeta className={`p-4 transition-shadow hover:shadow-md ${a.sku === destacado ? 'border-acento-400 bg-acento-100/60' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-marca-700">{a.nombre}</p>
                    <p className="text-sm text-stone-600">{a.marca} · {a.tipo}</p>
                    <p className="font-mono text-xs text-stone-400">{a.sku}</p>
                  </div>
                  <EstadoStock articulo={a} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-base font-semibold tabular-nums">{clp(a.precio)}</span>
                  <span className="tabular-nums text-stone-600">
                    {a.stock} disp.{cantidadEnCarrito(a.sku) > 0 && <span className="ml-2 text-marca-700">· {cantidadEnCarrito(a.sku)} en carrito</span>}
                  </span>
                </div>
              </Tarjeta>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[760px] text-sm">
          <caption className="sr-only">Artículos del inventario con nombre, marca, categoría, precio, stock disponible y estado</caption>
          <thead className="bg-stone-50 text-xs text-stone-500">
            <tr className="border-b border-stone-200">
              <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-wide">SKU</th>
              <Encabezado {...ordenProps} col="nombre" />
              <Encabezado {...ordenProps} col="marca" />
              <Encabezado {...ordenProps} col="tipo" />
              <Encabezado {...ordenProps} col="precio" alinear="text-right" />
              <Encabezado {...ordenProps} col="stock" alinear="text-right" />
              <th scope="col" className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {articulos.map((a) => (
              <tr
                key={a.sku}
                onClick={() => navigate(`/articulos/${a.sku}`)}
                className={`cursor-pointer ${a.sku === destacado ? 'bg-acento-100/60' : 'hover:bg-marca-50/60'}`}
              >
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-stone-500">{a.sku}</td>
                <td className="px-4 py-3">
                  {/* El Link mantiene la navegación por teclado; la fila completa también es clicable */}
                  <Link to={`/articulos/${a.sku}`} onClick={(e) => e.stopPropagation()} className="font-medium text-marca-700 hover:underline">
                    {a.nombre}
                  </Link>
                </td>
                <td className="px-4 py-3">{a.marca}</td>
                <td className="px-4 py-3 text-stone-600">{a.tipo}</td>
                <td className="px-4 py-3 text-right tabular-nums">{clp(a.precio)}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <span className="font-semibold">{a.stock}</span>
                  {cantidadEnCarrito(a.sku) > 0 && <span className="block text-xs text-marca-700">{cantidadEnCarrito(a.sku)} en carrito</span>}
                </td>
                <td className="px-4 py-3"><EstadoStock articulo={a} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
