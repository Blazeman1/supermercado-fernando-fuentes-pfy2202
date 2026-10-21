import { useSearchParams } from 'react-router-dom';
import { REGIONES, TIENDAS } from '../data/tiendas';

export default function NuestrasTiendas() {
  // Filtro por región en la URL: /tiendas?region=Biobío
  const [params, setParams] = useSearchParams();
  const region = params.get('region') ?? '';
  const visibles = region ? TIENDAS.filter((t) => t.region === region) : TIENDAS;

  return (
    <section aria-labelledby="titulo-tiendas">
      <div className="cabecera-pagina">
        <div>
          <h1 id="titulo-tiendas">Nuestras tiendas</h1>
          <p className="bajada">{TIENDAS.length} locales en {REGIONES.length} regiones. Revisa dirección, horario y servicios de cada uno.</p>
        </div>
      </div>

      <div className="pildoras" role="group" aria-label="Filtrar por región">
        <button type="button" className={!region ? 'activa' : ''} aria-pressed={!region} onClick={() => setParams({})}>Todas</button>
        {REGIONES.map((r) => (
          <button key={r} type="button" className={region === r ? 'activa' : ''} aria-pressed={region === r} onClick={() => setParams({ region: r })}>
            {r}
          </button>
        ))}
      </div>

      <ul className="grilla-tiendas">
        {visibles.map((t) => (
          <li key={t.id} className="tarjeta tienda">
            <p className="etiqueta">Región {t.region}</p>
            <h2>{t.nombre}</h2>
            <p>{t.direccion}</p>
            <p><a href={`tel:${t.telefono.replace(/\s/g, '')}`}>{t.telefono}</a></p>
            <p className="horario">{t.horario}</p>
            <ul className="servicios">
              {t.servicios.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
