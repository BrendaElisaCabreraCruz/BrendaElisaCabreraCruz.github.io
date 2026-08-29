# AGENTS.md — Reglas de contenido y desarrollo

Guía para cualquier agente o persona que modifique este repositorio.

## Reglas de contenido obligatorias

1. **Confidencialidad ConCEI-3:** el cartel/artículo del Congreso ConCEI-3 debe describirse exclusivamente como un trabajo académico sobre herramientas de manufactura esbelta aplicadas a una "línea de ensamblaje electrónico" genérica, sin ningún otro dato contextual.
2. **Lenguaje nominal:** los textos (landing y README) deben usar lenguaje nominal profesional: sin verbos en primera persona ("soy", "capitaneo", "produzco", "dedico", "lidero", etc.), sin pronombres personales ("mi", "mis", "me", "yo") y sin descripción en tercera persona. Usar frases nominales: "Capitanía de...", "Aplicación de...", "Trayectoria...".
3. **Privacidad:** la carpeta `QuienSoy/` es material de referencia personal y está en `.gitignore` (no debe publicarse ni trackearse). `context/` es referencia de templates, tampoco se publica. El único CV público es `Profile.pdf` (raíz), que es el que descarga el botón de la landing.
4. **Afirmaciones verificadas:** todo dato publicado (promedios, títulos, empresas, medallas, cursos) debe salir del CV / documentos en `QuienSoy/Brenda_Sobre_Mi.docx` y los PDFs de referencia. No inventar logros.

## Archivos del sitio

- `index.html` — estructura de la landing (GitHub Pages desde la rama `master`).
- `translations.js` — diccionario i18n ES/EN (objeto `TRANSLATIONS`).
- `styles.css` — estilos (tema claro/oscuro vía `data-theme`).
- `app.js` — interactividad: i18n, tema, filtros de experiencia, reveal, scrollspy, menú móvil, copiar correo.

## Verificaciones antes de commitear

1. `node --check app.js` y `node --check translations.js`
2. Paridad i18n: toda clave `data-i18n` usada en `index.html` debe existir en `TRANSLATIONS.es` y `TRANSLATIONS.en`, y viceversa (las únicas excepciones legítimas: `langToggleTitle` y `toastCopied`, usadas desde JS).
3. No subir `QuienSoy/` ni `context/` (están ignorados).

## Despliegue

- Sitio: https://BrendaElisaCabreraCruz.github.io (GitHub Pages, rama `master`, build desde `/`).
- Tras un push, GitHub Pages publica automáticamente (puede tardar 1-2 min).