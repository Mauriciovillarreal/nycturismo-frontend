import api from './api';

const packageService = {
  getAll: () => api.get('/packages'),
  getBySlug: (slug) => api.get(`/packages/${slug}`),
  getById: (id) => api.get(`/packages/id/${id}`),
  create: (payload) => api.post('/packages', payload),
  update: (id, payload) => api.put(`/packages/${id}`, payload),
  remove: (id) => api.delete(`/packages/${id}`),
  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export default packageService;
