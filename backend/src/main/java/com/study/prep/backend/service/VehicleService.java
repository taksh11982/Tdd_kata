package com.study.prep.backend.service;

import com.study.prep.backend.dto.PatchVehicleRequest;
import com.study.prep.backend.dto.PagedResponse;
import com.study.prep.backend.dto.VehicleRequest;
import com.study.prep.backend.dto.VehicleResponse;
import com.study.prep.backend.dto.VehicleStatsResponse;

import java.math.BigDecimal;
import java.util.List;

public interface VehicleService {

    List<VehicleResponse> getAllVehicles();

    PagedResponse<VehicleResponse> getAllVehicles(int page, int size);

    VehicleStatsResponse getStats();

    VehicleResponse getVehicleById(Long id);

    VehicleResponse createVehicle(VehicleRequest request);

    VehicleResponse updateVehicle(Long id, VehicleRequest request);

    VehicleResponse patchVehicle(Long id, PatchVehicleRequest request);

    void deleteVehicle(Long id);

    List<VehicleResponse> searchVehicles(String make, String model, String category,
                                         BigDecimal minPrice, BigDecimal maxPrice);

    VehicleResponse purchaseVehicle(Long id);

    VehicleResponse restockVehicle(Long vehicleId, Integer quantity);
}
