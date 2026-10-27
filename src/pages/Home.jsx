import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInventario } from '../context/InventarioContext';
import { clp } from '../utils/formato';
import EstadoStock from '../components/EstadoStock';

// Panel de inicio: resume el estado global del inventario.
// Todo lo que muestra se DERIVA de "articulos" (no se duplica en otro estado).
export default function Home() {
  const { articulos, ajustarStock } = useInventario();

  const resumen = useMemo(() => {
    const porTipo = articulos.reduce((acc, a) => {
      acc[a.tipo] = (acc[a.tipo] ?? 0) + 1;
      return acc;
    }, {});
    return {
      total: articulos.length,
      unidades: articulos.reduce((s, a) => s + a.stock, 0),
      valor: articulos.reduce((s, a) => s + a.stock * a.precio, 0),
      marcas: new Set(articulos.map((a) => a.marca)).size,
      criticos: articulos.filter((a) => a.stock < a.stockMinimo).sort((x, y) => x.stock / x.stockMinimo - y.stock / y.stockMinimo),
      porTipo: Object.entries(porTipo).sort((x, y) => y[1] - x[1]),
    };
  }, [articulos]);

  const maxTipo = resumen.porTipo[0]?.[1] ?? 1;

  const indicadores = [
    { etiqueta: 'Artículos', valor: resumen.total },
    { etiqueta: 'Marcas', valor: resumen.marcas },
    { etiqueta: 'Unidades en stock', valor: resumen.unidades.toLocaleString('es-CL') },
    { etiqueta: 'Valor del inventario', valor: clp(resumen.valor) },
  ];

  return (
    <section aria-labelledby="titulo-panel" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="titulo-panel" className="text-2xl font-bold sm:text-3xl">Panel de inventario</h1>
          <p className="text-stone-600">Resumen de la cadena y artículos que necesitan reposición.</p>
        </div>
        <Link to="/articulos/nuevo" className="btn-primario">+ Ingresar artículo</Link>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {indicadores.map(({ etiqueta, valor }) => (
          <li key={etiqueta} className="tarjeta p-4">
            <p className="text-sm text-stone-500">{etiqueta}</p>
            <p className="text-xl font-bold tabular-nums sm:text-2xl">{valor}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="titulo-criticos" className="tarjeta lg:col-span-2">
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
                    <button type="button" className="btn-secundario px-3 py-1.5" onClick={() => ajustarStock(a.sku, faltante)}>
                      Reponer +{faltante}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="titulo-tipos" className="tarjeta">
          <h2 id="titulo-tipos" className="mb-4 text-lg font-bold">Artículos por tipo</h2>
          <ul className="space-y-3">
            {resumen.porTipo.map(([tipo, cantidad]) => (
              <li key={tipo}>
                <Link to={`/articulos?tipo=${encodeURIComponent(tipo)}`} className="group block">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium group-hover:text-marca-600 group-hover:underline">{tipo}</span>
                    <span className="tabular-nums text-stone-500">{cantidad}</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100">
                    <div className="h-2 rounded-full bg-marca-500" style={{ width: `${(cantidad / maxTipo) * 100}%` }} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
