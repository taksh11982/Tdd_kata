package com.study.prep.backend.service.impl;

import com.study.prep.backend.dto.PatchVehicleRequest;
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
import java.util.Optional;

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
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        return toResponse(vehicle);
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
    public VehicleResponse patchVehicle(Long id, PatchVehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (request.getMake() != null) vehicle.setMake(request.getMake());
        if (request.getModel() != null) vehicle.setModel(request.getModel());
        if (request.getCategory() != null) vehicle.setCategory(request.getCategory());
        if (request.getPrice() != null) vehicle.setPrice(request.getPrice());
        if (request.getQuantity() != null) vehicle.setQuantity(request.getQuantity());

        Vehicle patched = vehicleRepository.save(vehicle);
        return toResponse(patched);
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

    @Override
    public VehicleResponse purchaseVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (vehicle.getQuantity() == 0) {
            throw new IllegalStateException("Vehicle is out of stock: " + id);
        }

        vehicle.setQuantity(vehicle.getQuantity() - 1);
        Vehicle saved = vehicleRepository.save(vehicle);
        return toResponse(saved);
    }

    @Override
    public VehicleResponse restockVehicle(Long vehicleId, Integer quantity) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));

        if (quantity <= 0) {
            throw new IllegalArgumentException("Restock quantity must be greater than zero");
        }

        vehicle.setQuantity(vehicle.getQuantity() + quantity);
        Vehicle saved = vehicleRepository.save(vehicle);
        return toResponse(saved);
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
