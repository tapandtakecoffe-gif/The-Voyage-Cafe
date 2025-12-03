// Script para limpiar todas las órdenes del localStorage
// Ejecuta este script en la consola del navegador (F12 > Console)

// Limpiar todas las versiones de órdenes
['tap_n_take_orders_v1', 'tap_n_take_orders_v2', 'tap_n_take_orders_v3', 'tap_n_take_orders_v4', 'tap_n_take_orders_v5'].forEach(key => {
  localStorage.removeItem(key);
  console.log(`✓ Eliminado: ${key}`);
});

console.log('✓ Todas las órdenes han sido eliminadas del localStorage');
alert('Todas las órdenes han sido eliminadas. Recarga la página para ver los cambios.');

