import api from './api';

const vehicleService = {
  getAll: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },

  search: async (params) => {
    const response = await api.get('/vehicles/search', { params });
    return response.data;
  },

  purchase: async (id) => {
    const response = await api.post(`/vehicles/${id}/purchase`);
    return response.data;
  },
};

export default vehicleService;
