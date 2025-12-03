# Instrucciones para cambiar el favicon

## Dónde poner el archivo

1. **Carpeta:** `public/`
2. **Nombre del archivo:** `favicon.ico`
3. **Ruta completa:** `public/favicon.ico`

## Qué archivo usar del ZIP

Si tienes varios tamaños en el ZIP, usa el **más grande** (típicamente):
- `favicon-32x32.ico` o `favicon-64x64.ico` 
- O simplemente `favicon.ico` si solo hay uno

## Pasos:

1. **Extrae el archivo .ico del ZIP**
2. **Renómbralo a `favicon.ico`** (si tiene otro nombre)
3. **Cópialo a la carpeta `public/`** (reemplaza el que está ahí)
4. **Reconstruye la aplicación:**
   ```bash
   npm run build
   ```

## Nota importante:

- El archivo debe estar en `public/favicon.ico`
- Vite automáticamente lo copia a `dist/` cuando haces `npm run build`
- Si estás en desarrollo (`npm run dev`), también se servirá automáticamente desde `public/`

## Verificar que funciona:

1. Después de hacer `npm run build`, verifica que existe `dist/favicon.ico`
2. Abre la aplicación en el navegador
3. Deberías ver el nuevo favicon en la pestaña del navegador

