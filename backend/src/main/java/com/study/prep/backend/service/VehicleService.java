package com.study.prep.backend.service;

import com.study.prep.backend.dto.VehicleRequest;
import com.study.prep.backend.dto.VehicleResponse;

import java.util.List;

public interface VehicleService {

    List<VehicleResponse> getAllVehicles();

    VehicleResponse getVehicleById(Long id);

    VehicleResponse createVehicle(VehicleRequest request);

    VehicleResponse updateVehicle(Long id, VehicleRequest request);

    void deleteVehicle(Long id);
}
