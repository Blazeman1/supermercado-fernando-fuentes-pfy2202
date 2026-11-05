import Tarjeta from './Tarjeta';

// Pantalla para listas sin elementos (carrito vacío, filtros sin resultados...).
export default function EstadoVacio({ icono = '∅', titulo, descripcion, children }) {
  return (
    <Tarjeta className="mx-auto max-w-lg space-y-3 py-10 text-center">
      <p aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-stone-100 text-2xl text-stone-500">
        {icono}
      </p>
      <h2 className="text-xl font-bold">{titulo}</h2>
      {descripcion && <p className="text-stone-600">{descripcion}</p>}
      {children && <div className="flex flex-wrap justify-center gap-2 pt-2">{children}</div>}
    </Tarjeta>
  );
}
