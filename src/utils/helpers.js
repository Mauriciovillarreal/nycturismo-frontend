export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' }).format(value);
};

export const createWhatsAppLink = (text) => {
  const message = encodeURIComponent(text);
  return `https://wa.me/5491123456789?text=${message}`;
};
