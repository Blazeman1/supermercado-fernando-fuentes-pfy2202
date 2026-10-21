# Mercado Austral — Gestión de inventario

Actividad formativa 1 · **Desarrollo Frontend II (PFY2202)** · Experiencia 1, Semana 1
"Utilizando tecnologías avanzadas de React en sitios web" — Forma B (supermercado)

**Autor:** Fernando Fuentes Allende — Duoc UC

SPA (Single Page Application) de gestión de inventario para un supermercado, construida con **HTML, CSS, JavaScript y React**, con navegación configurada mediante **React Router v6**.

## Requisitos de la actividad y cómo se cumplen

| Requisito (instrucciones específicas) | Implementación |
|---|---|
| Sitio de gestión de inventario de supermercado con HTML, JS, CSS y React | Proyecto React (Vite) con estilos propios en `src/index.css` |
| Página principal (home) | `src/pages/Home.jsx`: inventario con indicadores, búsqueda, filtros, ajuste de stock, alta de productos y alerta de stock crítico |
| Menú **inferior** para navegar a otras dos páginas | `src/components/MenuInferior.jsx`: barra fija abajo con `NavLink` (marca la página activa) |
| Dos páginas de la lista | **Nuestras tiendas** (`/tiendas`) y **Contáctanos** (`/contacto`) |
| Implementar y configurar React Router | `BrowserRouter` en `src/main.jsx`, tabla de rutas en `src/App.jsx` |
| Repositorio `supermercado-nombre-apellido-siglaCurso` | `supermercado-fernando-fuentes-pfy2202` |

## Uso de React Router

| Funcionalidad | Dónde |
|---|---|
| `BrowserRouter` envolviendo la app | `src/main.jsx` |
| `Routes` / `Route`, ruta índice y rutas anidadas | `src/App.jsx` |
| Ruta de diseño con `<Outlet />` (encabezado + menú comunes) | `src/components/Layout.jsx` |
| `NavLink` con estado activo y `aria-current` | `src/components/MenuInferior.jsx` |
| Ruta dinámica `/producto/:sku` con `useParams` | `src/pages/ProductoDetalle.jsx` |
| Navegación programática con `useNavigate` (redirigir tras guardar, volver con `navigate(-1)`) | `FormularioProducto.jsx`, `ProductoDetalle.jsx`, `Contactanos.jsx` |
| Paso de estado entre rutas (`location.state`) | `Contactanos.jsx` → `ContactoEnviado.jsx` |
| Filtros guardados en la URL con `useSearchParams` | `Home.jsx` (`?q=&cat=&estado=`), `NuestrasTiendas.jsx` (`?region=`) |
| Redirección declarativa con `<Navigate />` | `/inicio` → `/`; `/contacto/enviado` sin datos → `/contacto` |
| Página 404 con ruta comodín `*` | `src/pages/NoEncontrado.jsx` |
| `useLocation` para actualizar título, scroll y foco en cada cambio de ruta (accesibilidad) | `src/components/Layout.jsx` |

### Mapa de rutas

```
/                       Inventario (home)
/producto/:sku          Detalle de producto (ruta dinámica)
/tiendas                Nuestras tiendas      (?region=...)
/contacto               Contáctanos
/contacto/enviado       Confirmación del formulario (ruta anidada)
/inicio                 Redirige a /
*                       Página no encontrada (404)
```

## Estructura

```
src/
├── main.jsx                    # BrowserRouter + proveedor de inventario
├── App.jsx                     # Configuración de rutas
├── index.css                   # Estilos (responsive, mobile first)
├── components/
│   ├── Layout.jsx              # Encabezado, <Outlet />, pie y menú inferior
│   ├── MenuInferior.jsx        # Navegación inferior con NavLink
│   └── FormularioProducto.jsx  # Alta de productos con validación
├── context/
│   └── InventarioContext.jsx   # Estado global del inventario (Context API)
├── data/
│   ├── productos.js            # Datos de ejemplo del inventario
│   └── tiendas.js              # Datos de las tiendas
├── pages/
│   ├── Home.jsx
│   ├── ProductoDetalle.jsx
│   ├── NuestrasTiendas.jsx
│   ├── Contactanos.jsx
│   ├── ContactoEnviado.jsx
│   └── NoEncontrado.jsx
└── utils/
    └── formato.js              # Formato CLP y estado de stock
```

## Ejecución local

Requiere Node.js 18 o superior.

```bash
npm install
npm start        # o npm run dev  → http://localhost:5173
```

Otros comandos: `npm run build` (compila a `dist/`), `npm run preview` (sirve la compilación), `npm run lint`.

> Nota: el proyecto usa **Vite** en vez de Create React App (que la guía usa como ejemplo) porque CRA está descontinuado. El uso de React Router es idéntico; `npm start` se mantiene como alias para levantar el sitio.

Los cambios en el inventario se guardan en `localStorage` del navegador; el enlace **"Restablecer datos de ejemplo"** en el home vuelve a los datos iniciales.
