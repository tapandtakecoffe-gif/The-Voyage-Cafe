// Generate a unique order ID using timestamp and random number
export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

export const resetOrderCounter = () => {
  // No longer needed, but kept for compatibility
};
