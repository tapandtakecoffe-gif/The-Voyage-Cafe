# Instrucciones para Sincronización en Red Local

## Cómo funciona

El sistema ahora sincroniza las órdenes en tiempo real entre todos los dispositivos conectados a la misma red WiFi usando WebSockets.

## Pasos para usar:

### 1. Instalar dependencias (si no lo has hecho)
```bash
npm install
```

### 2. Construir la aplicación
```bash
npm run build
```

### 3. Iniciar el servidor
```bash
npm run server
```

O usar el comando que hace ambas cosas:
```bash
npm start
```

### 4. Obtener tu IP local

**En Windows:**
- Abre PowerShell o CMD
- Ejecuta: `ipconfig`
- Busca "IPv4 Address" (ejemplo: 192.168.1.100)

**En Mac/Linux:**
- Abre Terminal
- Ejecuta: `ifconfig` o `ip addr`
- Busca tu IP local (ejemplo: 192.168.1.100)

### 5. Acceder desde otros dispositivos

Una vez que el servidor esté corriendo, verás algo como:
```
Server running on http://0.0.0.0:3000
```

**Desde el ordenador local:**
- Abre: `http://localhost:3000`

**Desde el móvil/tablet en la misma WiFi:**
- Abre: `http://TU_IP_LOCAL:3000`
- Ejemplo: `http://192.168.1.100:3000`

### 6. Funcionamiento

- Cuando alguien hace un pedido desde el móvil, aparece automáticamente en el admin panel del ordenador
- Cuando cambias el estado de un pedido en el admin, se actualiza en tiempo real en todos los dispositivos
- Las órdenes se guardan en `orders.json` en el servidor
- Si el servidor se cae, las órdenes se mantienen en localStorage de cada dispositivo como respaldo

## Notas importantes

- Todos los dispositivos deben estar en la misma red WiFi
- El servidor debe estar corriendo en el ordenador principal
- El puerto 3000 debe estar disponible (si no, cambia `PORT` en `server.js`)
- Para producción, asegúrate de que el firewall permita conexiones en el puerto 3000

## Solución de problemas

**No se conectan los dispositivos:**
- Verifica que todos estén en la misma WiFi
- Verifica que el firewall permita conexiones en el puerto 3000
- Asegúrate de usar la IP correcta (no localhost desde otros dispositivos)

**Las órdenes no se sincronizan:**
- Revisa la consola del navegador para ver errores de WebSocket
- Verifica que el servidor esté corriendo
- Intenta recargar la página

