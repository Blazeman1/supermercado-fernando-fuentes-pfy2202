import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { TIPOS } from '../data/productos';
import { useCarrito, useInventario } from '../context/hooks';
import { contarPorCategoria, filtrarArticulos, ordenarArticulos } from '../utils/inventario';
import EncabezadoPagina from '../components/ui/EncabezadoPagina';
import Boton from '../components/ui/Boton';
import Aviso from '../components/ui/Aviso';
import EstadoVacio from '../components/ui/EstadoVacio';
import FiltroCategorias from '../components/inventario/FiltroCategorias';
import TablaArticulos from '../components/inventario/TablaArticulos';

// PÁGINA DE LISTADO: muestra el inventario completo y permite filtrarlo
// por categoría (además de búsqueda, estado y orden).
export default function ListadoArticulos() {
  const { articulos, restablecer } = useInventario();
  const { cantidadDe } = useCarrito();
  const { state } = useLocation(); // { nuevoSku } al llegar desde el formulario

  // ESTADO DEL FILTRO: vive en la URL (?categoria=Lácteos&q=...) mediante
  // useSearchParams. Al cambiarlo, React vuelve a renderizar la página y
  // recalcula la lista visible. El inventario global no se toca.
  const [params, setParams] = useSearchParams();
  const filtros = {
    texto: params.get('q') ?? '',
    categoria: params.get('categoria') ?? '',
    estado: params.get('estado') ?? '',
  };
  const orden = params.get('orden') ?? 'nombre';
  const dir = params.get('dir') === 'desc' ? 'desc' : 'asc';

  const actualizar = (cambios) => {
    const siguiente = new URLSearchParams(params);
    Object.entries(cambios).forEach(([k, v]) => (v ? siguiente.set(k, v) : siguiente.delete(k)));
    setParams(siguiente, { replace: true, state }); // replace: no llena el historial
  };

  // Lista VISIBLE derivada: se calcula a partir de "articulos" (original) y
  // los filtros. filtrarArticulos/ordenarArticulos devuelven arreglos nuevos.
  const visibles = useMemo(
    () => ordenarArticulos(filtrarArticulos(articulos, filtros), orden, dir),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [articulos, filtros.texto, filtros.categoria, filtros.estado, orden, dir]
  );
  const conteo = useMemo(() => contarPorCategoria(articulos), [articulos]);

  const hayFiltros = filtros.texto || filtros.categoria || filtros.estado;
  const limpiar = () => actualizar({ q: '', categoria: '', estado: '' });

  return (
    <section aria-labelledby="titulo-listado" className="space-y-5">
      <EncabezadoPagina id="titulo-listado" titulo="Listado de artículos" descripcion="Selecciona un artículo para ver su detalle y agregarlo al carrito.">
        <Boton to="/articulos/nuevo">+ Ingresar artículo</Boton>
      </EncabezadoPagina>

      {state?.nuevoSku && <Aviso>Artículo {state.nuevoSku} agregado al inventario. Aparece destacado en la lista.</Aviso>}

      <div className="space-y-2">
        <p className="etiqueta">Categoría</p>
        <FiltroCategorias
          categorias={TIPOS}
          conteo={conteo}
          total={articulos.length}
          seleccionada={filtros.categoria}
          onSeleccionar={(categoria) => actualizar({ categoria })}
        />
      </div>

      <div role="search" className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <label>
          <span className="etiqueta">Buscar</span>
          <input type="search" className="campo" placeholder="Nombre, marca o SKU" value={filtros.texto} onChange={(e) => actualizar({ q: e.target.value })} />
        </label>
        <label>
          <span className="etiqueta">Estado de stock</span>
          <select className="campo" value={filtros.estado} onChange={(e) => actualizar({ estado: e.target.value })}>
            <option value="">Todos</option>
            <option value="ok">Disponible</option>
            <option value="critico">Stock crítico</option>
            <option value="agotado">Agotado</option>
          </select>
        </label>
        {hayFiltros && <Boton variante="secundario" onClick={limpiar}>Limpiar filtros</Boton>}
      </div>

      <p className="text-sm text-stone-500" aria-live="polite">
        Mostrando <strong className="text-stone-800">{visibles.length}</strong> de {articulos.length} artículos
        {filtros.categoria && <> en <strong className="text-stone-800">{filtros.categoria}</strong></>}
      </p>

      {visibles.length === 0 ? (
        <EstadoVacio titulo="Sin resultados" descripcion="Ningún artículo coincide con los filtros seleccionados.">
          <Boton variante="secundario" onClick={limpiar}>Limpiar filtros</Boton>
        </EstadoVacio>
      ) : (
        <TablaArticulos
          articulos={visibles}
          cantidadEnCarrito={cantidadDe}
          destacado={state?.nuevoSku}
          orden={orden}
          dir={dir}
          onOrdenar={(col) => actualizar({ orden: col, dir: orden === col && dir === 'asc' ? 'desc' : 'asc' })}
        />
      )}

      <div className="text-right">
        <button type="button" className="text-sm text-stone-500 underline hover:text-stone-700" onClick={restablecer}>
          Restablecer datos de ejemplo
        </button>
      </div>
    </section>
  );
}
