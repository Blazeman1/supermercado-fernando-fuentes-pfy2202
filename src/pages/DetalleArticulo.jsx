import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCarrito, useInventario } from '../context/hooks';
import { clp, estadoStock } from '../utils/formato';
import EstadoStock from '../components/inventario/EstadoStock';
import AjusteStock from '../components/inventario/AjusteStock';
import SelectorCantidad from '../components/ui/SelectorCantidad';
import Boton from '../components/ui/Boton';
import Tarjeta from '../components/ui/Tarjeta';
import Aviso from '../components/ui/Aviso';
import EstadoVacio from '../components/ui/EstadoVacio';

const COLOR_BARRA = { ok: 'bg-marca-500', critico: 'bg-acento-400', agotado: 'bg-red-600' };

// PÁGINA DE DETALLE: muestra un artículo (ruta dinámica /articulos/:sku)
// y permite agregarlo al carrito, descontando del inventario.
export default function DetalleArticulo() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { articulos, ajustarStock, eliminarArticulo } = useInventario();
  const { agregarAlCarrito, cantidadDe } = useCarrito();
  const articulo = articulos.find((a) => a.sku === sku);

  // Estado LOCAL: la cantidad elegida y el último aviso solo importan a esta
  // pantalla, así que no se elevan al estado global.
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(null);

  if (!articulo) {
    return (
      <EstadoVacio icono="?" titulo="Artículo no encontrado" descripcion={`No existe un artículo con el SKU ${sku}.`}>
        <Boton to="/articulos">Ir al listado</Boton>
      </EstadoVacio>
    );
  }

  const { clave } = estadoStock(articulo);
  const enCarrito = cantidadDe(articulo.sku);
  const cantidadValida = Math.min(cantidad, articulo.stock); // por si el stock bajó
  const faltante = Math.max(0, articulo.stockMinimo - articulo.stock);
  const porcentaje = Math.min(100, Math.round((articulo.stock / Math.max(articulo.stockMinimo * 2, 1)) * 100));

  const agregar = () => {
    agregarAlCarrito(articulo.sku, cantidadValida);
    setAgregado(cantidadValida);
    setCantidad(1);
  };

  const eliminar = () => {
    eliminarArticulo(articulo.sku);
    navigate('/articulos', { replace: true });
  };

  const ficha = [
    ['Marca', articulo.marca],
    ['Categoría', <Link key="c" className="enlace" to={`/articulos?categoria=${encodeURIComponent(articulo.tipo)}`}>{articulo.tipo}</Link>],
    ['Precio unitario', clp(articulo.precio)],
    ['Stock disponible', `${articulo.stock} un.`],
    ['En tu carrito', `${enCarrito} un.`],
    ['Stock mínimo', `${articulo.stockMinimo} un.`],
  ];

  return (
    <section aria-labelledby="titulo-detalle" className="space-y-4">
      {/* navigate(-1): vuelve a la entrada anterior del historial, conservando los filtros */}
      <button type="button" className="enlace" onClick={() => navigate(-1)}>← Volver</button>

      <div className="grid gap-6 lg:grid-cols-3">
        <Tarjeta as="article" className="space-y-6 lg:col-span-2">
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

          <div role="img" aria-label={`Stock disponible ${articulo.stock} de un mínimo de ${articulo.stockMinimo}`} className="relative h-3 rounded-full bg-stone-100">
            <div className={`h-full rounded-full transition-all ${COLOR_BARRA[clave]}`} style={{ width: `${porcentaje}%` }} />
            <span className="absolute left-1/2 top-[-4px] h-5 w-0.5 bg-stone-700" title="Stock mínimo" />
          </div>
        </Tarjeta>

        {/* Compra: agrega al carrito y descuenta del inventario */}
        <Tarjeta as="aside" aria-label="Agregar al carrito" className="h-fit space-y-4">
          <p className="text-3xl font-bold tabular-nums">{clp(articulo.precio)}</p>

          {articulo.stock > 0 ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="etiqueta mb-0">Cantidad</span>
                <SelectorCantidad
                  valor={cantidadValida}
                  etiqueta="cantidad a agregar"
                  onRestar={() => setCantidad((c) => Math.max(1, c - 1))}
                  onSumar={() => setCantidad((c) => Math.min(articulo.stock, c + 1))}
                  puedeRestar={cantidadValida > 1}
                  puedeSumar={cantidadValida < articulo.stock}
                  grande
                />
              </div>
              <p className="text-sm text-stone-500">Máximo {articulo.stock} (stock disponible).</p>
              <Boton tamano="lg" className="w-full" onClick={agregar}>
                Agregar al carrito · {clp(articulo.precio * cantidadValida)}
              </Boton>
            </>
          ) : (
            <Aviso tipo="alerta">Sin stock disponible. {enCarrito > 0 && 'Todas las unidades están en tu carrito.'}</Aviso>
          )}

          {agregado && (
            <Aviso>
              Agregaste {agregado} {agregado === 1 ? 'unidad' : 'unidades'} al carrito.{' '}
              <Link to="/carrito" className="enlace">Ver carrito</Link>
            </Aviso>
          )}
        </Tarjeta>
      </div>

      {/* Administración del inventario (recepción de mercadería, mermas) */}
      <Tarjeta as="section" aria-labelledby="titulo-admin" className="space-y-4">
        <h2 id="titulo-admin" className="text-lg font-bold">Administración de inventario</h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-stone-600">Ajustar stock:</span>
          <AjusteStock articulo={articulo} />
          {faltante > 0 && (
            <Boton variante="secundario" onClick={() => ajustarStock(articulo.sku, faltante)}>Reponer hasta el mínimo (+{faltante})</Boton>
          )}
          <Boton variante="peligro" className="sm:ml-auto" onClick={eliminar}>Eliminar artículo</Boton>
        </div>
      </Tarjeta>
    </section>
  );
}
