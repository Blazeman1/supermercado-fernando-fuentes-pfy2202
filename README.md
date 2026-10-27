# Mercado Austral — Gestión de inventario

Proyecto del curso **Desarrollo Frontend II (PFY2202)** · Duoc UC · Forma B (supermercado)

**Autor:** Fernando Fuentes Allende

SPA (Single Page Application) de gestión de inventario para un supermercado, construida con **React**, **React Router v6**, estado global con **useReducer + Context API** y estilos con **Tailwind CSS v3**.

| Entrega | Actividad | Referencia en git |
|---|---|---|
| Semana 1 | Formativa 1 — Navegación con React Router | tag `entrega-s1` |
| Semana 2 | Formativa 2 — Gestión de estado y framework CSS | rama `main` |

## Semana 2 — Gestión de estado con React y Tailwind CSS

### Requisitos y cómo se cumplen

| Requisito (instrucciones específicas) | Implementación |
|---|---|
| Continuar el sitio de la actividad formativa 1 | Mismo repositorio y misma base; las rutas de la semana 1 siguen funcionando (`/producto/:sku` redirige a `/articulos/:sku`) |
| **Nuevo menú** que navegue a otras dos páginas | `src/components/MenuInventario.jsx`: menú en el encabezado con **Listado de artículos** e **Ingresar artículo** (distinto del menú inferior de la semana 1) |
| **Estado global** con la lista de artículos (nombre, marca, tipo) | `src/context/inventarioReducer.js` + `src/context/InventarioContext.jsx`: `useReducer` con acciones `AGREGAR`, `AJUSTAR_STOCK`, `ELIMINAR`, `RESTABLECER`, expuesto con Context y el hook `useInventario()` |
| **Página con formulario** para agregar artículos | `src/pages/NuevoArticulo.jsx` (`/articulos/nuevo`): formulario controlado con validación, SKU automático por tipo, marcas sugeridas desde el estado global y vista previa en vivo |
| **Página que lista en una tabla** todos los artículos | `src/pages/ListadoArticulos.jsx` (`/articulos`): tabla con nombre, marca, tipo, precio, stock y estado; búsqueda, filtros y orden por columna |
| **Framework CSS** | Tailwind CSS v3: `tailwind.config.js` (tema extendido con colores de la marca), `postcss.config.js`, `src/index.css` con `@tailwind` y componentes `@layer components` + `@apply`; todo el sitio se estiliza con clases utilitarias |

### Flujo del estado global

```
NuevoArticulo ──agregarArticulo()──► dispatch({ type: 'AGREGAR', payload })
                                          │
                                          ▼
                              inventarioReducer(estado, acción)
                                          │  devuelve un NUEVO arreglo
                                          ▼
              InventarioContext (useReducer) ──► Panel, Listado, Detalle se re-renderizan
                                          │
                                          └─ useEffect ──► localStorage (persistencia)
```

- **useReducer** concentra toda la lógica de modificación en una función pura (`inventarioReducer`).
- **Context API** comparte el estado y las funciones con cualquier componente, sin *prop drilling*.
- **useMemo** deriva datos (totales, críticos, filtros, orden) a partir del estado, sin duplicarlo.
- **useEffect** persiste el inventario en `localStorage` para que sobreviva a una recarga.

### Uso de Tailwind CSS

- **Clases utilitarias** en todos los componentes (`flex`, `grid`, `gap-4`, `rounded-xl`, `text-stone-600`…).
- **Diseño responsivo** con prefijos (`sm:`, `md:`, `lg:`): por ejemplo, el listado se muestra como tarjetas en móvil (`md:hidden`) y como tabla desde `md` (`hidden md:block`).
- **Estados** con variantes (`hover:`, `focus:`, `disabled:`, `group-hover:`).
- **Tema extendido** en `tailwind.config.js` (`marca-*`, `acento-*`), usado como `bg-marca-600`, `text-acento-700`.
- **Componentes propios** con `@apply` (`.btn-primario`, `.campo`, `.tarjeta`, `.chip`) para no repetir listas largas de clases.

## Semana 1 — Navegación con React Router

### Requisitos de la semana 1

| Requisito (instrucciones específicas) | Implementación |
|---|---|
| Sitio de gestión de inventario de supermercado con HTML, JS, CSS y React | Proyecto React (Vite); desde la semana 2, estilos con Tailwind CSS |
| Página principal (home) | `src/pages/Home.jsx`: panel con indicadores, artículos bajo stock mínimo y resumen por tipo |
| Menú **inferior** para navegar a otras dos páginas | `src/components/MenuInferior.jsx`: barra fija abajo con `NavLink` (marca la página activa) |
| Dos páginas de la lista | **Nuestras tiendas** (`/tiendas`) y **Contáctanos** (`/contacto`) |
| Implementar y configurar React Router | `BrowserRouter` en `src/main.jsx`, tabla de rutas en `src/App.jsx` |
| Repositorio `supermercado-nombre-apellido-siglaCurso` | `supermercado-fernando-fuentes-pfy2202` |

### Uso de React Router

| Funcionalidad | Dónde |
|---|---|
| `BrowserRouter` envolviendo la app | `src/main.jsx` |
| `Routes` / `Route`, rutas índice y anidadas | `src/App.jsx` |
| Ruta de diseño con `<Outlet />` (encabezado + menús comunes) | `src/components/Layout.jsx` |
| `NavLink` con estado activo y `aria-current` | `MenuInferior.jsx`, `MenuInventario.jsx` |
| Ruta dinámica `/articulos/:sku` con `useParams` | `src/pages/DetalleArticulo.jsx` |
| Navegación programática con `useNavigate` (redirigir tras guardar, volver con `navigate(-1)`) | `NuevoArticulo.jsx`, `DetalleArticulo.jsx`, `Contactanos.jsx` |
| Paso de estado entre rutas (`location.state`) | `NuevoArticulo.jsx` → `ListadoArticulos.jsx`; `Contactanos.jsx` → `ContactoEnviado.jsx` |
| Filtros y orden guardados en la URL con `useSearchParams` | `ListadoArticulos.jsx` (`?q=&tipo=&estado=&orden=&dir=`), `NuestrasTiendas.jsx` (`?region=`) |
| Redirección declarativa con `<Navigate />` | `/inicio` → `/`; `/producto/:sku` → `/articulos/:sku`; `/contacto/enviado` sin datos → `/contacto` |
| Página 404 con ruta comodín `*` | `src/pages/NoEncontrado.jsx` |
| `useLocation` para actualizar título, scroll y foco en cada cambio de ruta (accesibilidad) | `src/components/Layout.jsx` |

## Mapa de rutas

```
/                       Panel de inventario (home)          ← menú inferior
/articulos              Listado de artículos (tabla)        ← menú de inventario
/articulos/nuevo        Ingresar artículo (formulario)      ← menú de inventario
/articulos/:sku         Detalle de artículo (ruta dinámica)
/producto/:sku          Redirige a /articulos/:sku (enlaces de la semana 1)
/tiendas                Nuestras tiendas      (?region=...) ← menú inferior
/contacto               Contáctanos                         ← menú inferior
/contacto/enviado       Confirmación del formulario (ruta anidada)
/inicio                 Redirige a /
*                       Página no encontrada (404)
```

## Estructura

```
├── tailwind.config.js          # Configuración de Tailwind (content + tema extendido)
├── postcss.config.js           # Tailwind + Autoprefixer en el build de Vite
└── src/
    ├── main.jsx                # BrowserRouter + InventarioProvider
    ├── App.jsx                 # Configuración de rutas
    ├── index.css               # Directivas @tailwind y componentes @layer
    ├── components/
    │   ├── Layout.jsx          # Encabezado, <Outlet />, pie y menús
    │   ├── MenuInventario.jsx  # Nuevo menú (semana 2): listado / ingreso
    │   ├── MenuInferior.jsx    # Menú inferior (semana 1)
    │   ├── AjusteStock.jsx     # Botones − / + que despachan AJUSTAR_STOCK
    │   └── EstadoStock.jsx     # Chip de estado (disponible / crítico / agotado)
    ├── context/
    │   ├── inventarioReducer.js   # ACCIONES, reducer e inicializador
    │   └── InventarioContext.jsx  # Provider con useReducer + hook useInventario
    ├── data/
    │   ├── productos.js        # Artículos iniciales y tipos de producto
    │   └── tiendas.js          # Datos de las tiendas
    ├── pages/
    │   ├── Home.jsx            # Panel de inventario
    │   ├── ListadoArticulos.jsx
    │   ├── NuevoArticulo.jsx
    │   ├── DetalleArticulo.jsx
    │   ├── NuestrasTiendas.jsx
    │   ├── Contactanos.jsx
    │   ├── ContactoEnviado.jsx
    │   └── NoEncontrado.jsx
    └── utils/
        └── formato.js          # Formato CLP, estado de stock y sus clases
```

## Ejecución local

Requiere Node.js 18 o superior.

```bash
npm install      # instala también tailwindcss, postcss y autoprefixer
npm start        # o npm run dev  → http://localhost:5173
```

Otros comandos: `npm run build` (compila a `dist/`), `npm run preview` (sirve la compilación), `npm run lint`.

> Nota: el proyecto usa **Vite** en vez de Create React App (que la guía usa como ejemplo) porque CRA está descontinuado. React Router, `useReducer`, Context y Tailwind se usan igual; la única diferencia en Tailwind es que la configuración se exporta con `export default` (módulos ES) en vez de `module.exports`. `npm start` se mantiene como alias para levantar el sitio.

El inventario se guarda en `localStorage` del navegador; el enlace **"Restablecer datos de ejemplo"** en el listado vuelve a los datos iniciales.
