package com.study.prep.backend.service.impl;

import com.study.prep.backend.dto.VehicleRequest;
import com.study.prep.backend.dto.VehicleResponse;
import com.study.prep.backend.entity.Vehicle;
import com.study.prep.backend.exception.ResourceNotFoundException;
import com.study.prep.backend.repository.VehicleRepository;
import com.study.prep.backend.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Override
    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public VehicleResponse getVehicleById(Long id) {
        // TODO: implement
        return null;
    }

    @Override
    public VehicleResponse createVehicle(VehicleRequest request) {
        Vehicle vehicle = Vehicle.builder()
                .make(request.getMake())
                .model(request.getModel())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        return toResponse(saved);
    }

    @Override
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setCategory(request.getCategory());
        vehicle.setPrice(request.getPrice());
        vehicle.setQuantity(request.getQuantity());

        Vehicle updated = vehicleRepository.save(vehicle);
        return toResponse(updated);
    }

    @Override
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        vehicleRepository.deleteById(id);
    }

    @Override
    public List<VehicleResponse> searchVehicles(String make, String model, String category,
                                                 BigDecimal minPrice, BigDecimal maxPrice) {
        return vehicleRepository.findAll().stream()
                .filter(v -> make == null || v.getMake().equalsIgnoreCase(make))
                .filter(v -> model == null || v.getModel().equalsIgnoreCase(model))
                .filter(v -> category == null || v.getCategory().equalsIgnoreCase(category))
                .filter(v -> minPrice == null || v.getPrice().compareTo(minPrice) >= 0)
                .filter(v -> maxPrice == null || v.getPrice().compareTo(maxPrice) <= 0)
                .map(this::toResponse)
                .toList();
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getCategory(),
                vehicle.getPrice(),
                vehicle.getQuantity()
        );
    }
}
