package com.study.prep.backend.controller;

import com.study.prep.backend.dto.PatchVehicleRequest;
import com.study.prep.backend.dto.RestockRequest;
import com.study.prep.backend.dto.VehicleRequest;
import com.study.prep.backend.dto.VehicleResponse;
import com.study.prep.backend.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.createVehicle(request));
    }

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/search")
    public ResponseEntity<List<VehicleResponse>> searchVehicles(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(vehicleService.searchVehicles(make, model, category, minPrice, maxPrice));
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<VehicleResponse> purchaseVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.purchaseVehicle(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(@PathVariable Long id,
                                                         @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<VehicleResponse> patchVehicle(@PathVariable Long id,
                                                        @RequestBody PatchVehicleRequest request) {
        return ResponseEntity.ok(vehicleService.patchVehicle(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> restockVehicle(@PathVariable Long id,
                                                          @Valid @RequestBody RestockRequest request) {
        return ResponseEntity.ok(vehicleService.restockVehicle(id, request.getQuantity()));
    }
}
