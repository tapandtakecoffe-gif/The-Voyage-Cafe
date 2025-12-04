# Configuración de Stripe para The Voyage Cafe

Esta guía te ayudará a configurar Stripe para procesar pagos reales en tu aplicación.

## Paso 1: Crear cuenta en Stripe

1. Ve a [https://stripe.com](https://stripe.com) y crea una cuenta
2. Completa la información de tu negocio
3. Activa tu cuenta (puede tomar algunos días para verificación)

## Paso 2: Obtener las claves de API

1. Ve al [Dashboard de Stripe](https://dashboard.stripe.com)
2. Navega a **Developers** > **API keys**
3. Copia las siguientes claves:
   - **Publishable key** (empieza con `pk_test_` o `pk_live_`)
   - **Secret key** (empieza con `sk_test_` o `sk_live_`)

## Paso 3: Configurar Webhook

1. En el Dashboard de Stripe, ve a **Developers** > **Webhooks**
2. Click en **Add endpoint**
3. URL del endpoint: `https://tu-dominio.vercel.app/api/webhook`
4. Selecciona los eventos a escuchar:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copia el **Signing secret** (empieza con `whsec_`)

## Paso 4: Configurar variables de entorno en Vercel

1. Ve a tu proyecto en [Vercel](https://vercel.com)
2. Navega a **Settings** > **Environment Variables**
3. Agrega las siguientes variables:

### Variables de entorno requeridas:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

**Nota:** 
- Usa `pk_test_` y `sk_test_` para desarrollo/testing
- Usa `pk_live_` y `sk_live_` para producción
- El `SUPABASE_SERVICE_ROLE_KEY` es necesario para que el webhook pueda actualizar las órdenes

## Paso 5: Actualizar la base de datos de Supabase

Necesitas agregar las columnas de pago a tu tabla `orders`:

```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'not_required',
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
```

## Paso 6: Probar el flujo de pago

1. **Modo de prueba:**
   - Usa las tarjetas de prueba de Stripe:
     - Tarjeta exitosa: `4242 4242 4242 4242`
     - CVC: cualquier 3 dígitos
     - Fecha: cualquier fecha futura
     - ZIP: cualquier código postal

2. **Flujo completo:**
   - Agrega productos al carrito
   - Ingresa número de mesa
   - Click en "Place Order"
   - Serás redirigido a Stripe Checkout
   - Completa el pago
   - Serás redirigido de vuelta a la página de estado de orden

## Solución de problemas

### El checkout no se abre
- Verifica que `VITE_STRIPE_PUBLISHABLE_KEY` esté configurada correctamente
- Revisa la consola del navegador para errores

### El webhook no funciona
- Verifica que `STRIPE_WEBHOOK_SECRET` esté configurado
- Asegúrate de que la URL del webhook en Stripe sea correcta
- Revisa los logs de Vercel para ver errores del webhook

### El estado de pago no se actualiza
- Verifica que `SUPABASE_SERVICE_ROLE_KEY` esté configurado
- Asegúrate de que las columnas `payment_status` y `stripe_session_id` existan en la tabla `orders`
- Revisa los logs del webhook en Stripe Dashboard

## Modo de producción

Cuando estés listo para aceptar pagos reales:

1. Cambia a claves de producción en Stripe Dashboard
2. Actualiza las variables de entorno en Vercel con las claves de producción
3. Actualiza el webhook URL en Stripe a tu dominio de producción
4. Prueba con una tarjeta real de bajo valor primero

## Recursos adicionales

- [Documentación de Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

