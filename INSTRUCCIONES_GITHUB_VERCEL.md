# 📋 Instrucciones: Subir a GitHub y Vercel

## ✅ PASO 1: Instalar Git (SI NO LO TIENES)

1. Ve a: https://git-scm.com/download/win
2. Descarga e instala Git para Windows
3. Durante la instalación, deja todas las opciones por defecto
4. **IMPORTANTE**: Reinicia PowerShell después de instalar

## ✅ PASO 2: Verificar que Git funciona

Abre PowerShell y ejecuta:
```powershell
git --version
```

Si ves un número de versión, ¡perfecto! Continúa al Paso 3.

## ✅ PASO 3: Configurar Git (solo la primera vez)

Ejecuta estos comandos (reemplaza con tu nombre y email):

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

## ✅ PASO 4: Inicializar el repositorio

Ejecuta estos comandos en PowerShell desde la carpeta del proyecto:

```powershell
cd "C:\Users\adrim\OneDrive\Escritorio\The Voyage Cafe"
git init
git add .
git commit -m "Initial commit - The Voyage Cafe project"
```

## ✅ PASO 5: Crear repositorio en GitHub

1. Ve a https://github.com e inicia sesión
2. Haz clic en el botón **"+"** (arriba a la derecha) → **"New repository"**
3. **Nombre del repositorio**: `the-voyage-cafe` (o el que prefieras)
4. **Descripción**: "The Voyage Cafe - Digital Menu System"
5. Elige **Público** o **Privado** (recomiendo Privado)
6. **NO marques** "Initialize with README" (ya tienes archivos)
7. Haz clic en **"Create repository"**

## ✅ PASO 6: Crear Token de Acceso Personal

1. En GitHub, ve a: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Haz clic en **"Generate new token"** → **"Generate new token (classic)"**
3. **Note**: `Voyage Cafe Project`
4. **Expiration**: Elige cuánto tiempo quieres que dure (90 días, 1 año, etc.)
5. **Selecciona los scopes**: Marca la casilla **`repo`** (esto selecciona todos los permisos de repositorio)
6. Haz clic en **"Generate token"** al final de la página
7. **⚠️ IMPORTANTE**: Copia el token inmediatamente (solo se muestra una vez). Guárdalo en un lugar seguro.

## ✅ PASO 7: Conectar tu proyecto con GitHub

Ejecuta estos comandos (reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub y `TU_TOKEN` con el token que copiaste):

```powershell
git remote add origin https://TU_TOKEN@github.com/TU_USUARIO/the-voyage-cafe.git
git branch -M main
git push -u origin main
```

**Nota**: Cuando te pida credenciales:
- **Username**: Tu nombre de usuario de GitHub
- **Password**: Pega el token (NO tu contraseña de GitHub)

## ✅ PASO 8: Conectar con Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Sign Up"** o **"Log In"**
3. Elige **"Continue with GitHub"** (esto conecta tu cuenta)
4. Autoriza a Vercel a acceder a tus repositorios
5. Haz clic en **"Add New..."** → **"Project"**
6. En la lista, busca y selecciona **`the-voyage-cafe`**
7. Haz clic en **"Import"**
8. **Configuración del proyecto**:
   - **Framework Preset**: `Vite` (debería detectarlo automáticamente)
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `npm run build` (debería estar por defecto)
   - **Output Directory**: `dist` (debería estar por defecto)
   - **Install Command**: `npm install` (debería estar por defecto)
9. Haz clic en **"Deploy"**
10. Espera 1-2 minutos mientras Vercel despliega tu proyecto
11. ¡Listo! Te dará una URL como: `https://the-voyage-cafe.vercel.app`

## ✅ PASO 9: Invitar a tu compañero

1. En GitHub, ve a tu repositorio: `https://github.com/TU_USUARIO/the-voyage-cafe`
2. Haz clic en **"Settings"** (arriba del repositorio)
3. En el menú lateral, haz clic en **"Collaborators"**
4. Haz clic en **"Add people"**
5. Escribe el nombre de usuario de GitHub de tu compañero
6. Selecciona el permiso: **Write** (para que pueda hacer cambios)
7. Haz clic en **"Add [nombre] to this repository"**
8. Tu compañero recibirá un email y debe aceptar la invitación

## ✅ PASO 10: Tu compañero clona el proyecto

Tu compañero debe ejecutar:

```powershell
git clone https://github.com/TU_USUARIO/the-voyage-cafe.git
cd the-voyage-cafe
npm install
npm run dev
```

## 🔄 Trabajo diario (hacer cambios)

Cada vez que hagas cambios:

```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel se actualizará automáticamente cuando hagas `git push` a la rama `main`.

## ❓ Problemas comunes

### "git no se reconoce"
- Git no está instalado o no está en el PATH
- Reinstala Git y reinicia PowerShell

### "Authentication failed"
- Verifica que el token sea correcto
- Asegúrate de que el token tenga permisos `repo`

### "Repository not found"
- Verifica que el nombre del repositorio sea correcto
- Verifica que el token tenga acceso al repositorio

### Vercel no detecta el framework
- Configura manualmente: Framework Preset → `Vite`

