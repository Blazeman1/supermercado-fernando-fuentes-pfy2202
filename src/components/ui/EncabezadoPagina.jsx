// Título + descripción + acciones: el mismo encabezado en todas las páginas.
export default function EncabezadoPagina({ id, titulo, descripcion, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 id={id} className="text-2xl font-bold sm:text-3xl">{titulo}</h1>
        {descripcion && <p className="text-stone-600">{descripcion}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
