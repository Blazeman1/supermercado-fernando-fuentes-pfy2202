import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useInventario } from '../context/InventarioContext';
import { clp, estadoStock } from '../utils/formato';

export default function ProductoDetalle() {
  // useParams entrega el segmento dinámico definido en la ruta "producto/:sku".
  const { sku } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { productos, ajustarStock, eliminarProducto } = useInventario();
  const producto = productos.find((p) => p.sku === sku);

  if (!producto) {
    return (
      <section className="tarjeta centrado">
        <h1>Producto no encontrado</h1>
        <p>No existe un producto con el SKU <code>{sku}</code>.</p>
        <Link className="btn btn-primario" to="/">Volver al inventario</Link>
      </section>
    );
  }

  const est = estadoStock(producto);
  const faltante = Math.max(0, producto.stockMinimo - producto.stock);
  const porcentaje = Math.min(100, Math.round((producto.stock / Math.max(producto.stockMinimo * 2, 1)) * 100));

  const eliminar = () => {
    eliminarProducto(producto.sku);
    navigate('/', { replace: true });
  };

  return (
    <section aria-labelledby="titulo-detalle">
      {/* navigate(-1) vuelve a la entrada anterior del historial, conservando los filtros del Home */}
      <button type="button" className="enlace volver" onClick={() => navigate(-1)}>← Volver</button>

      {state?.creado && <p className="aviso exito" role="status">Producto creado correctamente.</p>}

      <article className="tarjeta detalle">
        <header>
          <p className="mono">{producto.sku}</p>
          <h1 id="titulo-detalle">{producto.nombre}</h1>
          <span className={`chip chip-${est.clave}`}>{est.texto}</span>
        </header>

        <dl className="ficha">
          <div><dt>Categoría</dt><dd><Link to={`/?cat=${encodeURIComponent(producto.categoria)}`}>{producto.categoria}</Link></dd></div>
          <div><dt>Proveedor</dt><dd>{producto.proveedor}</dd></div>
          <div><dt>Precio unitario</dt><dd>{clp(producto.precio)}</dd></div>
          <div><dt>Valor en stock</dt><dd>{clp(producto.precio * producto.stock)}</dd></div>
          <div><dt>Stock mínimo</dt><dd>{producto.stockMinimo} un.</dd></div>
          <div><dt>Unidades a reponer</dt><dd>{faltante > 0 ? `${faltante} un.` : 'No requiere'}</dd></div>
        </dl>

        <div className="barra-stock" role="img" aria-label={`Stock actual ${producto.stock} de un mínimo de ${producto.stockMinimo}`}>
          <div className={`relleno relleno-${est.clave}`} style={{ width: `${porcentaje}%` }} />
          <span className="marca-minimo" style={{ left: '50%' }} title="Stock mínimo" />
        </div>

        <div className="acciones-detalle">
          <div className="ajuste grande">
            <button type="button" onClick={() => ajustarStock(producto.sku, -1)} disabled={producto.stock === 0} aria-label="Restar una unidad">−</button>
            <span>{producto.stock} un.</span>
            <button type="button" onClick={() => ajustarStock(producto.sku, 1)} aria-label="Sumar una unidad">+</button>
          </div>
          {faltante > 0 && (
            <button type="button" className="btn btn-primario" onClick={() => ajustarStock(producto.sku, faltante)}>
              Reponer hasta el mínimo (+{faltante})
            </button>
          )}
          <button type="button" className="btn btn-peligro" onClick={eliminar}>Eliminar producto</button>
        </div>
      </article>
    </section>
  );
}
