export const TIENDAS = [
  {
    id: 'providencia',
    nombre: 'Mercado Austral Providencia',
    region: 'Metropolitana',
    direccion: 'Av. Providencia 1820, Providencia',
    telefono: '+56 2 2345 6701',
    horario: 'Lunes a domingo, 08:00 a 22:00',
    servicios: ['Estacionamiento', 'Retiro en tienda', 'Panadería propia'],
  },
  {
    id: 'maipu',
    nombre: 'Mercado Austral Maipú',
    region: 'Metropolitana',
    direccion: 'Av. Pajaritos 3150, Maipú',
    telefono: '+56 2 2345 6702',
    horario: 'Lunes a domingo, 08:30 a 22:00',
    servicios: ['Estacionamiento', 'Farmacia', 'Retiro en tienda'],
  },
  {
    id: 'vina',
    nombre: 'Mercado Austral Viña del Mar',
    region: 'Valparaíso',
    direccion: 'Av. Libertad 945, Viña del Mar',
    telefono: '+56 32 245 6703',
    horario: 'Lunes a sábado, 09:00 a 21:30 · Domingo, 10:00 a 20:00',
    servicios: ['Retiro en tienda', 'Panadería propia'],
  },
  {
    id: 'concepcion',
    nombre: 'Mercado Austral Concepción',
    region: 'Biobío',
    direccion: 'Calle Barros Arana 760, Concepción',
    telefono: '+56 41 245 6704',
    horario: 'Lunes a domingo, 09:00 a 21:00',
    servicios: ['Estacionamiento', 'Farmacia'],
  },
  {
    id: 'puerto-montt',
    nombre: 'Mercado Austral Puerto Montt',
    region: 'Los Lagos',
    direccion: 'Av. Diego Portales 1100, Puerto Montt',
    telefono: '+56 65 245 6705',
    horario: 'Lunes a domingo, 09:00 a 21:00',
    servicios: ['Estacionamiento', 'Retiro en tienda'],
  },
];

export const REGIONES = [...new Set(TIENDAS.map((t) => t.region))];
