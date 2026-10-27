import { Link, useNavigate, useParams } from 'react-router-dom';
import { useInventario } from '../context/InventarioContext';
import { clp, estadoStock } from '../utils/formato';
import EstadoStock from '../components/EstadoStock';
import AjusteStock from '../components/AjusteStock';

const COLOR_BARRA = { ok: 'bg-marca-500', critico: 'bg-acento-400', agotado: 'bg-red-600' };

export default function DetalleArticulo() {
  // useParams entrega el segmento dinámico definido en la ruta "articulos/:sku".
  const { sku } = useParams();
  const navigate = useNavigate();
  const { articulos, ajustarStock, eliminarArticulo } = useInventario();
  const articulo = articulos.find((a) => a.sku === sku);

  if (!articulo) {
    return (
      <section className="tarjeta mx-auto mt-8 max-w-md text-center">
        <h1 className="mb-2 text-2xl font-bold">Artículo no encontrado</h1>
        <p className="mb-4 text-stone-600">No existe un artículo con el SKU <code className="font-mono">{sku}</code>.</p>
        <Link className="btn-primario" to="/articulos">Ir al listado</Link>
      </section>
    );
  }

  const { clave } = estadoStock(articulo);
  const faltante = Math.max(0, articulo.stockMinimo - articulo.stock);
  // La barra va de 0 a 2× el mínimo, así la marca del mínimo queda al centro.
  const porcentaje = Math.min(100, Math.round((articulo.stock / Math.max(articulo.stockMinimo * 2, 1)) * 100));

  const eliminar = () => {
    eliminarArticulo(articulo.sku);
    navigate('/articulos', { replace: true });
  };

  const ficha = [
    ['Marca', articulo.marca],
    ['Tipo de producto', <Link key="t" className="enlace" to={`/articulos?tipo=${encodeURIComponent(articulo.tipo)}`}>{articulo.tipo}</Link>],
    ['Precio unitario', clp(articulo.precio)],
    ['Valor en stock', clp(articulo.precio * articulo.stock)],
    ['Stock mínimo', `${articulo.stockMinimo} un.`],
    ['Unidades a reponer', faltante > 0 ? `${faltante} un.` : 'No requiere'],
  ];

  return (
    <section aria-labelledby="titulo-detalle" className="space-y-4">
      {/* navigate(-1): vuelve a la entrada anterior del historial, conservando filtros */}
      <button type="button" className="enlace" onClick={() => navigate(-1)}>← Volver</button>

      <article className="tarjeta space-y-6">
        <header className="space-y-1">
          <p className="font-mono text-sm text-stone-500">{articulo.sku}</p>
          <h1 id="titulo-detalle" className="text-2xl font-bold sm:text-3xl">{articulo.nombre}</h1>
          <EstadoStock articulo={articulo} />
        </header>

        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ficha.map(([dt, dd]) => (
            <div key={dt} className="rounded-lg bg-stone-50 p-3">
              <dt className="text-sm text-stone-500">{dt}</dt>
              <dd className="font-semibold">{dd}</dd>
            </div>
          ))}
        </dl>

        <div role="img" aria-label={`Stock actual ${articulo.stock} de un mínimo de ${articulo.stockMinimo}`} className="relative h-3 rounded-full bg-stone-100">
          <div className={`h-full rounded-full transition-all ${COLOR_BARRA[clave]}`} style={{ width: `${porcentaje}%` }} />
          <span className="absolute left-1/2 top-[-4px] h-5 w-0.5 bg-stone-700" title="Stock mínimo" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AjusteStock articulo={articulo} grande />
          {faltante > 0 && (
            <button type="button" className="btn-primario" onClick={() => ajustarStock(articulo.sku, faltante)}>
              Reponer hasta el mínimo (+{faltante})
            </button>
          )}
          <button type="button" className="btn-peligro sm:ml-auto" onClick={eliminar}>Eliminar artículo</button>
        </div>
      </article>
    </section>
  );
}
