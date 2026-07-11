import api from './api';

const vehicleService = {
  getAll: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },
};

export default vehicleService;
