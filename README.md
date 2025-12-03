# The Voyage Cafe - Digital Menu System

Sistema de menú digital para cafetería con panel de administración y sincronización en tiempo real.

## 🚀 Características

- Menú digital interactivo con categorías y filtros
- Carrito de compras
- Panel de administración para gestionar pedidos
- Sincronización en tiempo real mediante WebSockets
- Diseño responsive (móvil, tablet, desktop)
- Sistema de pedidos por número de mesa

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn-ui + Tailwind CSS
- **Estado**: Zustand
- **Backend**: Express.js + WebSockets (ws)
- **Routing**: React Router DOM

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor con WebSocket
npm start
```

## 🌐 Despliegue

### Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy automático en cada push a `main`

### Servidor Local

Para usar la sincronización en tiempo real:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 📱 Uso

1. Los clientes escanean un QR code que los lleva al menú
2. Seleccionan productos y agregan al carrito
3. Ingresan número de mesa
4. Realizan el pedido
5. Los pedidos aparecen en tiempo real en el panel de administración

## 👥 Colaboración

Este proyecto está en GitHub. Para colaborar:

1. Clona el repositorio
2. Crea una rama para tus cambios
3. Realiza tus modificaciones
4. Haz commit y push
5. Crea un Pull Request

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm start` - Iniciar servidor con WebSocket
- `npm run server` - Solo servidor (sin build)

## 🔧 Configuración

El proyecto usa variables de entorno para configuración. Crea un archivo `.env` si necesitas configuraciones personalizadas.
