# Cómo hacer el favicon más grande y visible

## Opción 1: Usar el logo PNG existente (RECOMENDADO)

Si tienes el logo de la cafetería en PNG, puedes usarlo como favicon más grande:

1. **Copia el logo PNG** a la carpeta `public/` con estos nombres:
   - `favicon-192x192.png` (192x192 píxeles)
   - `apple-touch-icon.png` (180x180 píxeles - para iOS/Android)

2. **Si el logo es más grande**, puedes redimensionarlo a estos tamaños con cualquier editor de imágenes.

3. **El favicon.ico original** se mantiene para compatibilidad con navegadores antiguos.

## Opción 2: Crear múltiples tamaños desde el ICO

Si solo tienes el .ico, puedes:

1. **Abrir el .ico** en un editor de imágenes (Photoshop, GIMP, o herramientas online)
2. **Exportar en PNG** en estos tamaños:
   - `favicon-32x32.png` (32x32)
   - `favicon-96x96.png` (96x96)
   - `favicon-192x192.png` (192x192)
   - `apple-touch-icon.png` (180x180)

3. **Colocar todos los archivos** en la carpeta `public/`

## Herramientas online para crear favicons:

- https://realfavicongenerator.net/ (sube tu imagen y genera todos los tamaños)
- https://favicon.io/ (genera favicons desde texto o imagen)

## Después de añadir los archivos:

```bash
npm run build
```

## Nota importante:

- El `favicon.ico` original se mantiene para compatibilidad
- Los PNG más grandes se usan en dispositivos modernos
- El `apple-touch-icon.png` se usa cuando alguien añade tu sitio a la pantalla de inicio en móviles

