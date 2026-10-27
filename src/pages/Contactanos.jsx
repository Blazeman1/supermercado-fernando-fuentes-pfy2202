import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIENDAS } from '../data/tiendas';

const MOTIVOS = ['Consulta de stock', 'Sugerencia', 'Reclamo', 'Ser proveedor', 'Otro'];
const VACIO = { nombre: '', correo: '', motivo: MOTIVOS[0], tienda: '', mensaje: '' };

export default function Contactanos() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const err = {};
    if (datos.nombre.trim().length < 2) err.nombre = 'Ingresa tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) err.correo = 'Ingresa un correo válido.';
    if (datos.mensaje.trim().length < 10) err.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
    setErrores(err);
    if (Object.keys(err).length) return;

    // Redirección con estado: la ruta hija /contacto/enviado recibe los
    // datos a través de location.state, sin exponerlos en la URL.
    navigate('enviado', { state: { nombre: datos.nombre.trim(), motivo: datos.motivo } });
  };

  const error = (k) => errores[k] && <p id={`err-${k}`} className="mt-1 text-sm text-red-600">{errores[k]}</p>;
  const clase = (k) => `campo ${errores[k] ? 'campo-error' : ''}`;

  return (
    <section aria-labelledby="titulo-contacto" className="space-y-5">
      <div>
        <h1 id="titulo-contacto" className="text-2xl font-bold sm:text-3xl">Contáctanos</h1>
        <p className="text-stone-600">¿Buscas un producto, quieres ser proveedor o tienes una sugerencia? Escríbenos.</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <form onSubmit={enviar} noValidate className="tarjeta space-y-4 lg:col-span-2">
          <label className="block">
            <span className="etiqueta">Nombre</span>
            <input name="nombre" value={datos.nombre} onChange={cambiar} autoComplete="name" className={clase('nombre')} aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? 'err-nombre' : undefined} />
            {error('nombre')}
          </label>
          <label className="block">
            <span className="etiqueta">Correo electrónico</span>
            <input name="correo" type="email" value={datos.correo} onChange={cambiar} autoComplete="email" className={clase('correo')} aria-invalid={!!errores.correo} aria-describedby={errores.correo ? 'err-correo' : undefined} />
            {error('correo')}
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="etiqueta">Motivo</span>
              <select name="motivo" value={datos.motivo} onChange={cambiar} className="campo">
                {MOTIVOS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="etiqueta">Tienda (opcional)</span>
              <select name="tienda" value={datos.tienda} onChange={cambiar} className="campo">
                <option value="">Ninguna en particular</option>
                {TIENDAS.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="etiqueta">Mensaje</span>
            <textarea name="mensaje" rows={5} value={datos.mensaje} onChange={cambiar} className={clase('mensaje')} aria-invalid={!!errores.mensaje} aria-describedby={errores.mensaje ? 'err-mensaje' : undefined} />
            {error('mensaje')}
          </label>
          <button type="submit" className="btn-primario">Enviar mensaje</button>
        </form>

        <aside aria-label="Otros canales de atención" className="tarjeta">
          <h2 className="text-lg font-bold">Otros canales</h2>
          <dl className="mt-2 space-y-3">
            <div><dt className="text-sm text-stone-500">Mesa central</dt><dd className="font-semibold">600 123 4567</dd></div>
            <div><dt className="text-sm text-stone-500">Correo</dt><dd className="font-semibold">contacto@mercadoaustral.cl</dd></div>
            <div><dt className="text-sm text-stone-500">Horario de atención</dt><dd className="font-semibold">Lunes a viernes, 09:00 a 18:00</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
