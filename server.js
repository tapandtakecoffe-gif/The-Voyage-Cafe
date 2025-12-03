import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const ORDERS_FILE = join(__dirname, 'orders.json');

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// Helper functions for orders
const loadOrders = () => {
  try {
    if (existsSync(ORDERS_FILE)) {
      const data = readFileSync(ORDERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.map(order => ({
        ...order,
        timestamp: new Date(order.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
  return [];
};

const saveOrders = (orders) => {
  try {
    const serialized = JSON.stringify(orders.map(order => ({
      ...order,
      timestamp: order.timestamp instanceof Date ? order.timestamp.toISOString() : order.timestamp
    })), null, 2);
    writeFileSync(ORDERS_FILE, serialized, 'utf-8');
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

// Broadcast to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(data));
    }
  });
};

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send current orders to new client
  const orders = loadOrders();
  ws.send(JSON.stringify({ type: 'orders', data: orders }));
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// REST API endpoints
app.get('/api/orders', (req, res) => {
  const orders = loadOrders();
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const order = req.body;
  const orders = loadOrders();
  const newOrders = [order, ...orders];
  saveOrders(newOrders);
  broadcast({ type: 'new_order', data: order });
  res.json({ success: true, order });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orders = loadOrders();
  const updatedOrders = orders.map(order =>
    order.id === id ? { ...order, status } : order
  );
  saveOrders(updatedOrders);
  const updatedOrder = updatedOrders.find(o => o.id === id);
  broadcast({ type: 'order_updated', data: updatedOrder });
  res.json({ success: true, order: updatedOrder });
});

app.delete('/api/orders', (req, res) => {
  saveOrders([]);
  broadcast({ type: 'orders_cleared', data: null });
  res.json({ success: true });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`WebSocket server ready for connections`);
  console.log(`Access from other devices on your network using your local IP`);
});

