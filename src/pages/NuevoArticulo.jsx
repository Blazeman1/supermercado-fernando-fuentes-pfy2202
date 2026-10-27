import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TIPOS } from '../data/productos';
import { useInventario } from '../context/InventarioContext';
import { clp } from '../utils/formato';

const VACIO = { nombre: '', marca: '', tipo: '', precio: '', stock: '', stockMinimo: '' };

// Prefijo del SKU a partir del tipo: "Lácteos" → "LAC", "Frutas y verduras" → "FRU".
const prefijo = (tipo) =>
  tipo.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();

function validar(datos, articulos) {
  const err = {};
  const nombre = datos.nombre.trim();
  if (nombre.length < 3) err.nombre = 'Ingresa un nombre de al menos 3 caracteres.';
  else if (articulos.some((a) => a.nombre.toLowerCase() === nombre.toLowerCase() && a.marca.toLowerCase() === datos.marca.trim().toLowerCase()))
    err.nombre = 'Ya existe un artículo con ese nombre y esa marca.';
  if (datos.marca.trim().length < 2) err.marca = 'Ingresa la marca del artículo.';
  if (!datos.tipo) err.tipo = 'Selecciona el tipo de producto.';
  if (!(Number(datos.precio) > 0)) err.precio = 'El precio debe ser mayor a 0.';
  if (datos.stock === '' || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) err.stock = 'Ingresa un número entero, 0 o más.';
  if (datos.stockMinimo === '' || !Number.isInteger(Number(datos.stockMinimo)) || Number(datos.stockMinimo) < 0)
    err.stockMinimo = 'Ingresa un número entero, 0 o más.';
  return err;
}

// Campo con etiqueta y mensaje de error accesible. Definido fuera de la
// página para que no se vuelva a montar en cada pulsación de tecla.
function Campo({ nombre, etiqueta, error, children, ayuda }) {
  return (
    <div>
      <label htmlFor={nombre} className="etiqueta">{etiqueta}</label>
      {children}
      {error ? (
        <p id={`err-${nombre}`} className="mt-1 text-sm text-red-600">{error}</p>
      ) : (
        ayuda && <p className="mt-1 text-xs text-stone-500">{ayuda}</p>
      )}
    </div>
  );
}

// PÁGINA DE INGRESO (semana 2): formulario controlado que agrega un
// artículo al estado global mediante la acción AGREGAR del reducer.
export default function NuevoArticulo() {
  const { articulos, agregarArticulo } = useInventario();
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  // Marcas existentes (derivadas del estado global) para autocompletar.
  const marcas = useMemo(() => [...new Set(articulos.map((a) => a.marca))].sort((a, b) => a.localeCompare(b, 'es')), [articulos]);

  // SKU correlativo según el tipo: el mayor número usado con ese prefijo + 1.
  const skuSugerido = useMemo(() => {
    if (!datos.tipo) return '';
    const pre = prefijo(datos.tipo);
    const max = articulos
      .filter((a) => a.sku.startsWith(`${pre}-`))
      .reduce((m, a) => Math.max(m, Number(a.sku.split('-')[1]) || 0), 0);
    return `${pre}-${String(max + 1).padStart(3, '0')}`;
  }, [datos.tipo, articulos]);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const enviar = (e) => {
    e.preventDefault();
    const err = validar(datos, articulos);
    setErrores(err);
    if (Object.keys(err).length) {
      document.getElementById(Object.keys(err)[0])?.focus();
      return;
    }
    agregarArticulo({
      sku: skuSugerido,
      nombre: datos.nombre.trim(),
      marca: datos.marca.trim(),
      tipo: datos.tipo,
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      stockMinimo: Number(datos.stockMinimo),
    });
    // Redirige a la tabla y le indica (vía state) qué fila destacar.
    navigate('/articulos', { state: { nuevoSku: skuSugerido } });
  };

  const props = (nombre) => ({
    id: nombre,
    name: nombre,
    value: datos[nombre],
    onChange: cambiar,
    'aria-invalid': !!errores[nombre],
    'aria-describedby': errores[nombre] ? `err-${nombre}` : undefined,
    className: `campo ${errores[nombre] ? 'campo-error' : ''}`,
  });

  return (
    <section aria-labelledby="titulo-nuevo" className="space-y-5">
      <div>
        <h1 id="titulo-nuevo" className="text-2xl font-bold sm:text-3xl">Ingresar artículo</h1>
        <p className="text-stone-600">Completa los datos para agregar un nuevo artículo al inventario.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={enviar} noValidate className="tarjeta space-y-5 lg:col-span-2">
          <fieldset className="space-y-4">
            <legend className="mb-2 text-lg font-bold">Datos del artículo</legend>
            <Campo nombre="nombre" etiqueta="Nombre" error={errores.nombre}>
              <input {...props('nombre')} placeholder="Ej.: Azúcar granulada (1 kg)" autoComplete="off" />
            </Campo>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo nombre="marca" etiqueta="Marca" error={errores.marca} ayuda="Elige una existente o escribe una nueva.">
                <input {...props('marca')} list="lista-marcas" placeholder="Ej.: Campo Sur" autoComplete="off" />
                <datalist id="lista-marcas">
                  {marcas.map((m) => <option key={m} value={m} />)}
                </datalist>
              </Campo>
              <Campo nombre="tipo" etiqueta="Tipo de producto" error={errores.tipo}>
                <select {...props('tipo')}>
                  <option value="">Selecciona…</option>
                  {TIPOS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Campo>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-2 text-lg font-bold">Precio y stock</legend>
            <div className="grid gap-4 sm:grid-cols-3">
              <Campo nombre="precio" etiqueta="Precio (CLP)" error={errores.precio}>
                <input {...props('precio')} type="number" min="1" inputMode="numeric" placeholder="1290" />
              </Campo>
              <Campo nombre="stock" etiqueta="Stock inicial" error={errores.stock}>
                <input {...props('stock')} type="number" min="0" step="1" inputMode="numeric" placeholder="50" />
              </Campo>
              <Campo nombre="stockMinimo" etiqueta="Stock mínimo" error={errores.stockMinimo}>
                <input {...props('stockMinimo')} type="number" min="0" step="1" inputMode="numeric" placeholder="20" />
              </Campo>
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-3 border-t border-stone-100 pt-5">
            <button type="submit" className="btn-primario">Guardar artículo</button>
            <button type="button" className="btn-secundario" onClick={() => { setDatos(VACIO); setErrores({}); }}>Limpiar</button>
            <Link to="/articulos" className="btn px-2 text-stone-600 hover:underline">Cancelar</Link>
          </div>
        </form>

        {/* Vista previa: se actualiza en vivo porque el formulario es controlado */}
        <aside aria-label="Vista previa del artículo" className="tarjeta h-fit space-y-3 border-dashed bg-stone-50">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Vista previa</p>
          <p className="font-mono text-sm text-stone-500">{skuSugerido || 'SKU se asigna según el tipo'}</p>
          <p className="text-lg font-bold">{datos.nombre.trim() || 'Nombre del artículo'}</p>
          <p className="text-stone-600">{datos.marca.trim() || 'Marca'} · {datos.tipo || 'Tipo'}</p>
          <dl className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-lg bg-white p-2"><dt className="text-stone-500">Precio</dt><dd className="font-semibold">{Number(datos.precio) > 0 ? clp(Number(datos.precio)) : '—'}</dd></div>
            <div className="rounded-lg bg-white p-2"><dt className="text-stone-500">Stock</dt><dd className="font-semibold">{datos.stock || '—'}</dd></div>
            <div className="rounded-lg bg-white p-2"><dt className="text-stone-500">Mínimo</dt><dd className="font-semibold">{datos.stockMinimo || '—'}</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
