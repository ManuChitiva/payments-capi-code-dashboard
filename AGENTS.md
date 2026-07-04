<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Diseño (paleta Apple)

UI con tokens de marca en `src/lib/brand-theme.ts` y variables en `src/app/globals.css`. No usar `slate-*`, `text-white` ni acentos dorados fijos en páginas con tema claro/oscuro. Detalle completo: `.cursor/rules/apple-color-palette.mdc`.
