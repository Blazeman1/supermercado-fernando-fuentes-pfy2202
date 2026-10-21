import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CATEGORIAS } from '../data/productos';
import { useInventario } from '../context/InventarioContext';
import { clp, estadoStock } from '../utils/formato';
import FormularioProducto from '../components/FormularioProducto';

export default function Home() {
  const { productos, ajustarStock, restablecer } = useInventario();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Los filtros se guardan en la query string (?q=...&cat=...&estado=...)
  // con useSearchParams: así la vista filtrada tiene una URL propia que
  // se puede compartir y sobrevive al botón "Atrás" del navegador.
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cat = params.get('cat') ?? '';
  const estado = params.get('estado') ?? '';

  const actualizarFiltro = (clave, valor) => {
    const siguiente = new URLSearchParams(params);
    if (valor) siguiente.set(clave, valor);
    else siguiente.delete(clave);
    setParams(siguiente, { replace: true });
  };

  const filtrados = useMemo(() => {
    const texto = q.trim().toLowerCase();
    return productos.filter(
      (p) =>
        (!texto || p.nombre.toLowerCase().includes(texto) || p.sku.toLowerCase().includes(texto)) &&
        (!cat || p.categoria === cat) &&
        (!estado || estadoStock(p).clave === estado)
    );
  }, [productos, q, cat, estado]);

  const resumen = useMemo(
    () => ({
      productos: productos.length,
      unidades: productos.reduce((s, p) => s + p.stock, 0),
      alertas: productos.filter((p) => p.stock < p.stockMinimo).length,
      valor: productos.reduce((s, p) => s + p.stock * p.precio, 0),
    }),
    [productos]
  );

  return (
    <section aria-labelledby="titulo-home">
      <div className="cabecera-pagina">
        <div>
          <h1 id="titulo-home">Inventario general</h1>
          <p className="bajada">Controla el stock de la cadena y detecta a tiempo los productos bajo su mínimo.</p>
        </div>
        <button type="button" className="btn btn-primario" onClick={() => setMostrarFormulario((v) => !v)} aria-expanded={mostrarFormulario}>
          {mostrarFormulario ? 'Cerrar formulario' : '+ Nuevo producto'}
        </button>
      </div>

      <ul className="indicadores">
        <li><span>Productos</span><strong>{resumen.productos}</strong></li>
        <li><span>Unidades en stock</span><strong>{resumen.unidades.toLocaleString('es-CL')}</strong></li>
        <li className={resumen.alertas ? 'alerta' : ''}>
          <span>Bajo stock mínimo</span>
          <strong>{resumen.alertas}</strong>
          {resumen.alertas > 0 && (
            <button type="button" className="enlace" onClick={() => actualizarFiltro('estado', 'critico')}>Ver críticos</button>
          )}
        </li>
        <li><span>Valor del inventario</span><strong>{clp(resumen.valor)}</strong></li>
      </ul>

      {mostrarFormulario && <FormularioProducto onGuardado={() => setMostrarFormulario(false)} />}

      <div className="filtros" role="search">
        <label>
          <span>Buscar</span>
          <input type="search" placeholder="Nombre o SKU" value={q} onChange={(e) => actualizarFiltro('q', e.target.value)} />
        </label>
        <label>
          <span>Categoría</span>
          <select value={cat} onChange={(e) => actualizarFiltro('cat', e.target.value)}>
            <option value="">Todas</option>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>
          <span>Estado</span>
          <select value={estado} onChange={(e) => actualizarFiltro('estado', e.target.value)}>
            <option value="">Todos</option>
            <option value="ok">Disponible</option>
            <option value="critico">Stock crítico</option>
            <option value="agotado">Agotado</option>
          </select>
        </label>
        {(q || cat || estado) && (
          <button type="button" className="btn btn-secundario" onClick={() => setParams({}, { replace: true })}>Limpiar filtros</button>
        )}
      </div>

      <p className="conteo" aria-live="polite">{filtrados.length} de {productos.length} productos</p>

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th scope="col">SKU</th>
              <th scope="col">Producto</th>
              <th scope="col">Categoría</th>
              <th scope="col" className="num">Precio</th>
              <th scope="col" className="num">Stock</th>
              <th scope="col">Estado</th>
              <th scope="col"><span className="sr">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p) => {
              const est = estadoStock(p);
              return (
                <tr key={p.sku}>
                  <td data-label="SKU" className="mono">{p.sku}</td>
                  <td data-label="Producto">
                    {/* Link a la ruta dinámica /producto/:sku */}
                    <Link to={`/producto/${p.sku}`}>{p.nombre}</Link>
                  </td>
                  <td data-label="Categoría">{p.categoria}</td>
                  <td data-label="Precio" className="num">{clp(p.precio)}</td>
                  <td data-label="Stock" className="num">
                    <div className="ajuste">
                      <button type="button" onClick={() => ajustarStock(p.sku, -1)} disabled={p.stock === 0} aria-label={`Restar una unidad de ${p.nombre}`}>−</button>
                      <span>{p.stock}</span>
                      <button type="button" onClick={() => ajustarStock(p.sku, 1)} aria-label={`Sumar una unidad de ${p.nombre}`}>+</button>
                    </div>
                  </td>
                  <td data-label="Estado"><span className={`chip chip-${est.clave}`}>{est.texto}</span></td>
                  <td><Link className="enlace" to={`/producto/${p.sku}`}>Ver detalle</Link></td>
                </tr>
              );
            })}
            {filtrados.length === 0 && (
              <tr><td colSpan={7} className="vacio">No hay productos que coincidan con los filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <button type="button" className="enlace restablecer" onClick={restablecer}>Restablecer datos de ejemplo</button>
    </section>
  );
}
