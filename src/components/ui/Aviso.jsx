// Mensaje de estado (éxito, información o alerta) anunciado a lectores de pantalla.
const ESTILOS = {
  exito: 'border-marca-100 bg-marca-50 text-marca-700',
  info: 'border-sky-100 bg-sky-50 text-sky-800',
  alerta: 'border-acento-100 bg-acento-100/60 text-acento-700',
};

export default function Aviso({ tipo = 'exito', className = '', children }) {
  return (
    <div role="status" className={`rounded-lg border px-4 py-3 font-medium ${ESTILOS[tipo]} ${className}`.trim()}>
      {children}
    </div>
  );
}
