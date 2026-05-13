import api from './api';

const bookingService = {
  getAll: () => api.get('/bookings'),
  create: (payload) => api.post('/bookings', payload),
};

export default bookingService;
