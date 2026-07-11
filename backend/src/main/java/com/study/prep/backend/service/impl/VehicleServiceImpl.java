package com.study.prep.backend.service.impl;

import com.study.prep.backend.dto.VehicleRequest;
import com.study.prep.backend.dto.VehicleResponse;
import com.study.prep.backend.service.VehicleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Override
    public List<VehicleResponse> getAllVehicles() {
        // TODO: implement
        return List.of();
    }

    @Override
    public VehicleResponse getVehicleById(Long id) {
        // TODO: implement
        return null;
    }

    @Override
    public VehicleResponse createVehicle(VehicleRequest request) {
        // TODO: implement
        return null;
    }

    @Override
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        // TODO: implement
        return null;
    }

    @Override
    public void deleteVehicle(Long id) {
        // TODO: implement
    }
}
