# Landing Page - Entorno de Desarrollo

Esta es una copia de tu landing page principal para que puedas trabajar en ella de forma independiente sin afectar la versión en producción.

## Estructura

```
landing-dev/
├── app/
│   ├── page.tsx          # Componente principal de la landing
│   ├── layout.tsx        # Layout de Next.js
│   ├── globals.css       # Estilos globales
│   └── data/             # Datos de proyectos
├── components/
│   ├── ui/               # Componentes UI (shadcn/ui)
│   ├── Footer.tsx
│   ├── AnimatedButton.tsx
│   ├── ContactFormModal.tsx
│   └── GeometricFlowCard.tsx
├── lib/
│   ├── i18n/            # Contexto de idiomas
│   ├── theme/           # Contexto de tema
│   └── utils.ts         # Utilidades
└── config files         # Archivos de configuración

```

## Archivos copiados

- ✅ Componente principal (page.tsx)
- ✅ Layout y estilos globales
- ✅ Todos los componentes utilizados
- ✅ Componentes UI de shadcn/ui
- ✅ Contextos (idioma y tema)
- ✅ Datos de proyectos
- ✅ Archivos de configuración

## Cómo usar

### Desarrollo local
Para trabajar en esta versión:

1. Los archivos están listos para editar directamente
2. Los cambios que hagas aquí NO afectarán la versión principal
3. Cuando termines y estés conforme, puedes copiar los archivos de vuelta al proyecto principal

### Copiar cambios al proyecto principal
Cuando estés listo para aplicar tus cambios:

```bash
# Copiar página principal
cp landing-dev/app/page.tsx app/page.tsx

# Copiar componentes modificados
cp landing-dev/components/*.tsx components/

# Copiar estilos si los modificaste
cp landing-dev/app/globals.css app/globals.css
```

## Notas importantes

- Este directorio NO tiene node_modules, usa los del proyecto principal
- Las rutas de importación funcionan porque apuntan a las mismas ubicaciones
- Puedes probar tus cambios reemplazando temporalmente los archivos en el proyecto principal
- Los assets en /public se comparten con el proyecto principal

## Archivos principales para editar

- **app/page.tsx** - Estructura principal de la landing
- **app/globals.css** - Estilos globales y personalizados
- **components/** - Componentes individuales
- **app/data/projects.ts** - Datos de proyectos
