// Control − cantidad + reutilizado en el ajuste de stock, el detalle y el carrito.
// Es un componente "tonto" (presentacional): no conoce el estado global,
// solo recibe el valor y las funciones a ejecutar por props.
export default function SelectorCantidad({ valor, onRestar, onSumar, puedeRestar = true, puedeSumar = true, etiqueta, grande = false }) {
  const tamano = grande ? 'h-10 w-10 text-lg' : '';
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={etiqueta}>
      <button type="button" className={`paso-stock ${tamano}`} onClick={onRestar} disabled={!puedeRestar} aria-label={`Disminuir ${etiqueta}`}>
        −
      </button>
      <span className={`min-w-[3ch] text-center font-semibold tabular-nums ${grande ? 'text-lg' : ''}`} aria-live="polite">
        {valor}
      </span>
      <button type="button" className={`paso-stock ${tamano}`} onClick={onSumar} disabled={!puedeSumar} aria-label={`Aumentar ${etiqueta}`}>
        +
      </button>
    </div>
  );
}
