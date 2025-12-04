# Instrucciones para Configurar Supabase - Sincronización en Tiempo Real

## ¿Por qué Supabase?

Supabase permite que las órdenes se sincronicen en **tiempo real** entre todos los dispositivos (móvil, tablet, ordenador) sin necesidad de mantener un servidor propio. Las órdenes se guardan en la nube y todos los dispositivos las ven instantáneamente.

## Paso 1: Crear una cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project" o "Sign up"
3. Crea una cuenta (puedes usar GitHub, Google, o email)
4. El plan gratuito es suficiente para empezar

## Paso 2: Crear un nuevo proyecto

1. Una vez dentro de Supabase, haz clic en "New Project"
2. Completa la información:
   - **Name**: `the-voyage-cafe` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala en un lugar seguro)
   - **Region**: Elige la región más cercana a tu ubicación
3. Haz clic en "Create new project"
4. Espera 1-2 minutos mientras se crea el proyecto

## Paso 3: Crear la tabla de órdenes

1. En el panel de Supabase, ve a **SQL Editor** (en el menú lateral izquierdo)
2. Haz clic en "New query"
3. Copia y pega el siguiente SQL:

```sql
-- Crear la tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items TEXT NOT NULL, -- JSON string con los items de la orden
  total NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  customer_name TEXT NOT NULL,
  table_number TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas por timestamp
CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp DESC);

-- Habilitar Realtime para la tabla (esto permite sincronización en tiempo real)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Configurar políticas de seguridad (permite lectura y escritura para todos)
-- ⚠️ IMPORTANTE: En producción, deberías restringir esto según tus necesidades
CREATE POLICY "Enable all access for orders" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Haz clic en "Run" (o presiona Ctrl+Enter)
5. Deberías ver un mensaje de éxito

## Paso 4: Obtener las credenciales de Supabase

1. En el panel de Supabase, ve a **Settings** (⚙️) en el menú lateral
2. Haz clic en **API**
3. Encontrarás dos valores importantes:
   - **Project URL**: Algo como `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: Una clave larga que empieza con `eyJ...`

## Paso 5: Configurar las variables de entorno

1. En la raíz de tu proyecto, crea un archivo llamado `.env` (si no existe)
2. Agrega las siguientes líneas (reemplaza con tus valores reales):

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **IMPORTANTE**: 
   - Reemplaza `https://xxxxxxxxxxxxx.supabase.co` con tu **Project URL**
   - Reemplaza `eyJ...` con tu **anon public key**
   - No incluyas comillas alrededor de los valores

## Paso 6: Reiniciar el servidor de desarrollo

1. Si tienes el servidor corriendo, detenlo (Ctrl+C)
2. Reinicia el servidor:
   ```bash
   npm run dev
   ```

## Paso 7: Verificar que funciona

1. Abre la aplicación en dos dispositivos diferentes (o dos ventanas del navegador)
2. En un dispositivo, crea una orden
3. La orden debería aparecer **instantáneamente** en el otro dispositivo
4. Si cambias el estado de una orden en el panel de administración, debería actualizarse en tiempo real en todos los dispositivos

## Solución de problemas

### Las órdenes no se sincronizan

1. **Verifica las variables de entorno**:
   - Asegúrate de que el archivo `.env` existe en la raíz del proyecto
   - Verifica que los valores son correctos (sin espacios extra, sin comillas)
   - Reinicia el servidor después de cambiar `.env`

2. **Verifica la consola del navegador**:
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña "Console"
   - Busca mensajes de error relacionados con Supabase

3. **Verifica que Realtime está habilitado**:
   - En Supabase, ve a **Database** > **Replication**
   - Asegúrate de que la tabla `orders` está marcada para replicación

4. **Verifica las políticas de seguridad**:
   - En Supabase, ve a **Authentication** > **Policies**
   - Asegúrate de que hay una política que permite acceso a la tabla `orders`

### Error: "relation 'orders' does not exist"

- La tabla no se creó correctamente. Vuelve al Paso 3 y ejecuta el SQL nuevamente.

### Las órdenes se guardan solo localmente

- Esto significa que Supabase no está configurado. Verifica:
  - Que el archivo `.env` existe y tiene los valores correctos
  - Que reiniciaste el servidor después de crear `.env`
  - Que las credenciales son correctas

## Notas importantes

- **Seguridad**: Las políticas actuales permiten acceso completo a la tabla. Para producción, deberías implementar autenticación y políticas más restrictivas.
- **Backup**: Las órdenes también se guardan en `localStorage` como respaldo, pero la fuente de verdad es Supabase.
- **Plan gratuito**: El plan gratuito de Supabase incluye 500 MB de base de datos y 2 GB de ancho de banda, suficiente para empezar.

## ¿Necesitas ayuda?

Si tienes problemas, verifica:
1. La consola del navegador para errores
2. Los logs de Supabase en el panel de administración
3. Que todas las variables de entorno están configuradas correctamente

