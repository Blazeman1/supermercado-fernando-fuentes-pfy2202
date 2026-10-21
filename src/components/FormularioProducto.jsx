import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIAS } from '../data/productos';
import { useInventario } from '../context/InventarioContext';

const VACIO = { sku: '', nombre: '', categoria: CATEGORIAS[0], precio: '', stock: '', stockMinimo: '', proveedor: '' };

export default function FormularioProducto({ onGuardado }) {
  const { productos, agregarProducto } = useInventario();
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const validar = () => {
    const err = {};
    const sku = datos.sku.trim().toUpperCase();
    if (!/^[A-Z]{3}-\d{3}$/.test(sku)) err.sku = 'Formato esperado: AAA-000 (ej. ABA-010).';
    else if (productos.some((p) => p.sku === sku)) err.sku = 'Ya existe un producto con ese SKU.';
    if (datos.nombre.trim().length < 3) err.nombre = 'Ingresa un nombre de al menos 3 caracteres.';
    if (!(Number(datos.precio) > 0)) err.precio = 'El precio debe ser mayor a 0.';
    if (datos.stock === '' || Number(datos.stock) < 0) err.stock = 'El stock no puede ser negativo.';
    if (datos.stockMinimo === '' || Number(datos.stockMinimo) < 0) err.stockMinimo = 'Indica un stock mínimo (0 o más).';
    return err;
  };

  const enviar = (e) => {
    e.preventDefault();
    const err = validar();
    setErrores(err);
    if (Object.keys(err).length) return;

    const sku = datos.sku.trim().toUpperCase();
    agregarProducto({
      ...datos,
      sku,
      nombre: datos.nombre.trim(),
      proveedor: datos.proveedor.trim() || 'Sin proveedor',
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      stockMinimo: Number(datos.stockMinimo),
    });
    onGuardado?.();
    // Redirección programática: tras guardar, se lleva al usuario al
    // detalle del producto recién creado.
    navigate(`/producto/${sku}`, { state: { creado: true } });
  };

  const campo = (name, label, props = {}) => (
    <label className={errores[name] ? 'con-error' : ''}>
      <span>{label}</span>
      <input name={name} value={datos[name]} onChange={cambiar} aria-invalid={!!errores[name]} aria-describedby={errores[name] ? `err-${name}` : undefined} {...props} />
      {errores[name] && <small id={`err-${name}`} className="error">{errores[name]}</small>}
    </label>
  );

  return (
    <form className="tarjeta formulario-producto" onSubmit={enviar} noValidate>
      <h2>Agregar producto</h2>
      <div className="grilla-form">
        {campo('sku', 'SKU', { placeholder: 'ABA-010' })}
        {campo('nombre', 'Nombre', { placeholder: 'Azúcar (1 kg)' })}
        <label>
          <span>Categoría</span>
          <select name="categoria" value={datos.categoria} onChange={cambiar}>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        {campo('proveedor', 'Proveedor', { placeholder: 'Opcional' })}
        {campo('precio', 'Precio (CLP)', { type: 'number', min: 1, inputMode: 'numeric' })}
        {campo('stock', 'Stock actual', { type: 'number', min: 0, inputMode: 'numeric' })}
        {campo('stockMinimo', 'Stock mínimo', { type: 'number', min: 0, inputMode: 'numeric' })}
      </div>
      <button type="submit" className="btn btn-primario">Guardar producto</button>
    </form>
  );
}
