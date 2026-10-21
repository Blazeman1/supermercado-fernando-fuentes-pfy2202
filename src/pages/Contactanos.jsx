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

  const error = (k) => errores[k] && <small id={`err-${k}`} className="error">{errores[k]}</small>;

  return (
    <section aria-labelledby="titulo-contacto" className="contacto">
      <div className="cabecera-pagina">
        <div>
          <h1 id="titulo-contacto">Contáctanos</h1>
          <p className="bajada">¿Buscas un producto, quieres ser proveedor o tienes una sugerencia? Escríbenos.</p>
        </div>
      </div>

      <div className="contacto-grilla">
        <form className="tarjeta" onSubmit={enviar} noValidate>
          <label className={errores.nombre ? 'con-error' : ''}>
            <span>Nombre</span>
            <input name="nombre" value={datos.nombre} onChange={cambiar} autoComplete="name" aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? 'err-nombre' : undefined} />
            {error('nombre')}
          </label>
          <label className={errores.correo ? 'con-error' : ''}>
            <span>Correo electrónico</span>
            <input name="correo" type="email" value={datos.correo} onChange={cambiar} autoComplete="email" aria-invalid={!!errores.correo} aria-describedby={errores.correo ? 'err-correo' : undefined} />
            {error('correo')}
          </label>
          <div className="dos-columnas">
            <label>
              <span>Motivo</span>
              <select name="motivo" value={datos.motivo} onChange={cambiar}>
                {MOTIVOS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label>
              <span>Tienda (opcional)</span>
              <select name="tienda" value={datos.tienda} onChange={cambiar}>
                <option value="">Ninguna en particular</option>
                {TIENDAS.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </label>
          </div>
          <label className={errores.mensaje ? 'con-error' : ''}>
            <span>Mensaje</span>
            <textarea name="mensaje" rows={5} value={datos.mensaje} onChange={cambiar} aria-invalid={!!errores.mensaje} aria-describedby={errores.mensaje ? 'err-mensaje' : undefined} />
            {error('mensaje')}
          </label>
          <button type="submit" className="btn btn-primario">Enviar mensaje</button>
        </form>

        <aside className="tarjeta canales" aria-label="Otros canales de atención">
          <h2>Otros canales</h2>
          <dl>
            <dt>Mesa central</dt><dd>600 123 4567</dd>
            <dt>Correo</dt><dd>contacto@mercadoaustral.cl</dd>
            <dt>Horario de atención</dt><dd>Lunes a viernes, 09:00 a 18:00</dd>
          </dl>
        </aside>
      </div>
    </section>
  );
}
