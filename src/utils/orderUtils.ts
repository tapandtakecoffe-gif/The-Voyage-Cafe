let orderCounter = 1;

export const generateOrderId = (): string => {
  const id = orderCounter;
  orderCounter++;
  return id.toString().padStart(3, '0');
};

export const resetOrderCounter = () => {
  orderCounter = 1;
};
