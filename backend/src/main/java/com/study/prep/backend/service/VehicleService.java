package com.study.prep.backend.service;

import com.study.prep.backend.dto.VehicleRequest;
import com.study.prep.backend.dto.VehicleResponse;

import java.math.BigDecimal;
import java.util.List;

public interface VehicleService {

    List<VehicleResponse> getAllVehicles();

    VehicleResponse getVehicleById(Long id);

    VehicleResponse createVehicle(VehicleRequest request);

    VehicleResponse updateVehicle(Long id, VehicleRequest request);

    void deleteVehicle(Long id);

    List<VehicleResponse> searchVehicles(String make, String model, String category,
                                         BigDecimal minPrice, BigDecimal maxPrice);

    VehicleResponse purchaseVehicle(Long id);

    VehicleResponse restockVehicle(Long vehicleId, Integer quantity);
}
