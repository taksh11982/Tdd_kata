import { describe, it, expect, vi, beforeEach } from 'vitest';
import vehicleService from '../services/vehicleService';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '../services/api';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('vehicleService', () => {
  const mockVehicle = {
    id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10,
  };

  describe('getAll', () => {
    it('fetches vehicles with default pagination', async () => {
      const mockResponse = {
        data: { content: [mockVehicle], page: 0, size: 6, totalElements: 1, totalPages: 1 },
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await vehicleService.getAll();

      expect(api.get).toHaveBeenCalledWith('/vehicles', { params: { page: 0, size: 6 } });
      expect(result).toEqual(mockResponse.data);
    });

    it('fetches vehicles with custom pagination', async () => {
      api.get.mockResolvedValue({ data: { content: [], page: 2, size: 10, totalElements: 0, totalPages: 0 } });

      await vehicleService.getAll(2, 10);

      expect(api.get).toHaveBeenCalledWith('/vehicles', { params: { page: 2, size: 10 } });
    });
  });

  describe('getStats', () => {
    it('fetches vehicle statistics', async () => {
      const stats = { totalVehicles: 10, totalStock: 50, totalValue: 500000, lowStock: 2, outOfStock: 1, categories: 4 };
      api.get.mockResolvedValue({ data: stats });

      const result = await vehicleService.getStats();

      expect(api.get).toHaveBeenCalledWith('/vehicles/stats');
      expect(result).toEqual(stats);
    });
  });

  describe('create', () => {
    it('creates a new vehicle', async () => {
      api.post.mockResolvedValue({ data: mockVehicle });

      const result = await vehicleService.create({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 });

      expect(api.post).toHaveBeenCalledWith('/vehicles', { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 });
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('update', () => {
    it('updates an existing vehicle', async () => {
      const updated = { ...mockVehicle, price: 27000 };
      api.put.mockResolvedValue({ data: updated });

      const result = await vehicleService.update(1, { price: 27000 });

      expect(api.put).toHaveBeenCalledWith('/vehicles/1', { price: 27000 });
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('deletes a vehicle', async () => {
      api.delete.mockResolvedValue({});

      await vehicleService.delete(1);

      expect(api.delete).toHaveBeenCalledWith('/vehicles/1');
    });
  });

  describe('purchase', () => {
    it('purchases a vehicle', async () => {
      const purchased = { ...mockVehicle, quantity: 9 };
      api.post.mockResolvedValue({ data: purchased });

      const result = await vehicleService.purchase(1);

      expect(api.post).toHaveBeenCalledWith('/vehicles/1/purchase');
      expect(result).toEqual(purchased);
    });
  });

  describe('restock', () => {
    it('restocks a vehicle', async () => {
      const restocked = { ...mockVehicle, quantity: 20 };
      api.post.mockResolvedValue({ data: restocked });

      const result = await vehicleService.restock(1, 10);

      expect(api.post).toHaveBeenCalledWith('/vehicles/1/restock', { quantity: 10 });
      expect(result).toEqual(restocked);
    });
  });

  describe('search', () => {
    it('searches vehicles with filters', async () => {
      api.get.mockResolvedValue({ data: [mockVehicle] });

      const result = await vehicleService.search({ make: 'Toyota', category: 'Sedan' });

      expect(api.get).toHaveBeenCalledWith('/vehicles/search', { params: { make: 'Toyota', category: 'Sedan' } });
      expect(result).toEqual([mockVehicle]);
    });
  });
});
