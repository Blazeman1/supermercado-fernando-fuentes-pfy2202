// Filtro por categoría: un botón por categoría con la cantidad de artículos.
// Los conteos se calculan sobre el inventario COMPLETO, así se ve que
// filtrar solo cambia la vista y no los datos originales.
export default function FiltroCategorias({ categorias, conteo, total, seleccionada, onSeleccionar }) {
  const opciones = [{ valor: '', texto: 'Todas', cantidad: total }, ...categorias.map((c) => ({ valor: c, texto: c, cantidad: conteo[c] ?? 0 }))];

  return (
    <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
      {opciones.map(({ valor, texto, cantidad }) => {
        const activa = seleccionada === valor;
        return (
          <button
            key={texto}
            type="button"
            aria-pressed={activa}
            onClick={() => onSeleccionar(valor)}
            disabled={cantidad === 0 && !activa}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              activa ? 'border-marca-600 bg-marca-600 text-white' : 'border-stone-300 bg-white text-stone-700 hover:border-marca-500 hover:text-marca-700'
            }`}
          >
            {texto}
            <span className={`rounded-full px-1.5 text-xs tabular-nums ${activa ? 'bg-white/20' : 'bg-stone-100 text-stone-500'}`}>{cantidad}</span>
          </button>
        );
      })}
    </div>
  );
}
