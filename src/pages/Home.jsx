import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito, useInventario } from '../context/hooks';
import { contarPorCategoria } from '../utils/inventario';
import { clp } from '../utils/formato';
import EstadoStock from '../components/inventario/EstadoStock';
import EncabezadoPagina from '../components/ui/EncabezadoPagina';
import Boton from '../components/ui/Boton';
import Tarjeta from '../components/ui/Tarjeta';

// Panel de inicio: resume el estado global. Todo se DERIVA de los datos
// del contexto; no se guarda ningún total en un estado aparte.
export default function Home() {
  const { articulos, ajustarStock } = useInventario();
  const { totalUnidades, total } = useCarrito();

  const resumen = useMemo(
    () => ({
      unidades: articulos.reduce((s, a) => s + a.stock, 0),
      valor: articulos.reduce((s, a) => s + a.stock * a.precio, 0),
      criticos: articulos.filter((a) => a.stock < a.stockMinimo).sort((x, y) => x.stock / x.stockMinimo - y.stock / y.stockMinimo),
      porCategoria: Object.entries(contarPorCategoria(articulos)).sort((x, y) => y[1] - x[1]),
    }),
    [articulos]
  );
  const maxCategoria = resumen.porCategoria[0]?.[1] ?? 1;

  const indicadores = [
    { etiqueta: 'Artículos', valor: articulos.length },
    { etiqueta: 'Unidades disponibles', valor: resumen.unidades.toLocaleString('es-CL') },
    { etiqueta: 'Valor del inventario', valor: clp(resumen.valor) },
    { etiqueta: 'En carrito', valor: `${totalUnidades} un. · ${clp(total)}`, to: '/carrito' },
  ];

  return (
    <section aria-labelledby="titulo-panel" className="space-y-6">
      <EncabezadoPagina id="titulo-panel" titulo="Panel de inventario" descripcion="Resumen de la cadena y artículos que necesitan reposición.">
        <Boton variante="secundario" to="/articulos">Ver artículos</Boton>
        <Boton to="/articulos/nuevo">+ Ingresar artículo</Boton>
      </EncabezadoPagina>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {indicadores.map(({ etiqueta, valor, to }) => (
          <Tarjeta as="li" key={etiqueta} className="p-4">
            <p className="text-sm text-stone-500">{to ? <Link to={to} className="hover:text-marca-700 hover:underline">{etiqueta}</Link> : etiqueta}</p>
            <p className="text-lg font-bold tabular-nums sm:text-2xl">{valor}</p>
          </Tarjeta>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-3">
        <Tarjeta as="section" aria-labelledby="titulo-criticos" className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="titulo-criticos" className="text-lg font-bold">
              Bajo stock mínimo
              <span className="ml-2 rounded-full bg-acento-100 px-2 py-0.5 text-sm text-acento-700">{resumen.criticos.length}</span>
            </h2>
            <Link to="/articulos?estado=critico" className="enlace text-sm">Ver en el listado</Link>
          </div>

          {resumen.criticos.length === 0 ? (
            <p className="rounded-lg bg-marca-50 p-4 text-marca-700">Todo el inventario está sobre su stock mínimo.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {resumen.criticos.map((a) => {
                const faltante = a.stockMinimo - a.stock;
                return (
                  <li key={a.sku} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                    <div className="min-w-0 flex-1">
                      <Link to={`/articulos/${a.sku}`} className="font-semibold hover:text-marca-600 hover:underline">{a.nombre}</Link>
                      <p className="text-sm text-stone-500">{a.marca} · {a.tipo}</p>
                    </div>
                    <div className="text-right text-sm tabular-nums">
                      <span className="font-semibold">{a.stock}</span>
                      <span className="text-stone-500"> / {a.stockMinimo} mín.</span>
                    </div>
                    <EstadoStock articulo={a} />
                    <Boton variante="secundario" tamano="sm" onClick={() => ajustarStock(a.sku, faltante)}>Reponer +{faltante}</Boton>
                  </li>
                );
              })}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta as="section" aria-labelledby="titulo-categorias">
          <h2 id="titulo-categorias" className="mb-4 text-lg font-bold">Artículos por categoría</h2>
          <ul className="space-y-3">
            {resumen.porCategoria.map(([categoria, cantidad]) => (
              <li key={categoria}>
                <Link to={`/articulos?categoria=${encodeURIComponent(categoria)}`} className="group block">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium group-hover:text-marca-600 group-hover:underline">{categoria}</span>
                    <span className="tabular-nums text-stone-500">{cantidad}</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100">
                    <div className="h-2 rounded-full bg-marca-500" style={{ width: `${(cantidad / maxCategoria) * 100}%` }} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Tarjeta>
      </div>
    </section>
  );
}
