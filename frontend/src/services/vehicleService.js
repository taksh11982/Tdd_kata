import api from './api';

const vehicleService = {
  getAll: async (page = 0, size = 6) => {
    const response = await api.get('/vehicles', { params: { page, size } });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/vehicles/stats');
    return response.data;
  },

  search: async (params) => {
    const response = await api.get('/vehicles/search', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/vehicles/${id}`);
  },

  purchase: async (id) => {
    const response = await api.post(`/vehicles/${id}/purchase`);
    return response.data;
  },

  restock: async (id, quantity) => {
    const response = await api.post(`/vehicles/${id}/restock`, { quantity });
    return response.data;
  },
};

export default vehicleService;
