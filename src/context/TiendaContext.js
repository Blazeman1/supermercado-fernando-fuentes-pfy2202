import { createContext } from 'react';

// Objeto de contexto compartido por el Provider y los hooks.
// Vive en su propio archivo para que cada módulo exporte una sola cosa.
export const TiendaContext = createContext(null);
