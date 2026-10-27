import { useSearchParams } from 'react-router-dom';
import { REGIONES, TIENDAS } from '../data/tiendas';

export default function NuestrasTiendas() {
  // Filtro por región en la URL: /tiendas?region=Biobío
  const [params, setParams] = useSearchParams();
  const region = params.get('region') ?? '';
  const visibles = region ? TIENDAS.filter((t) => t.region === region) : TIENDAS;

  const pildora = (activa) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      activa ? 'border-marca-600 bg-marca-600 text-white' : 'border-stone-300 bg-white text-stone-700 hover:border-marca-500'
    }`;

  return (
    <section aria-labelledby="titulo-tiendas" className="space-y-5">
      <div>
        <h1 id="titulo-tiendas" className="text-2xl font-bold sm:text-3xl">Nuestras tiendas</h1>
        <p className="text-stone-600">
          {TIENDAS.length} locales en {REGIONES.length} regiones. Revisa dirección, horario y servicios de cada uno.
        </p>
      </div>

      <div role="group" aria-label="Filtrar por región" className="flex flex-wrap gap-2">
        <button type="button" className={pildora(!region)} aria-pressed={!region} onClick={() => setParams({})}>Todas</button>
        {REGIONES.map((r) => (
          <button key={r} type="button" className={pildora(region === r)} aria-pressed={region === r} onClick={() => setParams({ region: r })}>
            {r}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((t) => (
          <li key={t.id} className="tarjeta flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wider text-acento-700">Región {t.region}</p>
            <h2 className="text-lg font-bold">{t.nombre}</h2>
            <p>{t.direccion}</p>
            <p><a className="enlace" href={`tel:${t.telefono.replace(/\s/g, '')}`}>{t.telefono}</a></p>
            <p className="text-sm text-stone-500">{t.horario}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {t.servicios.map((s) => (
                <li key={s} className="chip bg-marca-50 text-marca-700">{s}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
