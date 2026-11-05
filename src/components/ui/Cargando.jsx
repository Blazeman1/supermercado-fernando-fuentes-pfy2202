// Indicador que muestra <Suspense> mientras descarga una página cargada con lazy().
export default function Cargando() {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-20 text-stone-500">
      <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-marca-600" />
      Cargando…
    </div>
  );
}
