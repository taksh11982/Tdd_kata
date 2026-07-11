package com.study.prep.backend.service.impl;

import com.study.prep.backend.dto.VehicleRequest;
import com.study.prep.backend.dto.VehicleResponse;
import com.study.prep.backend.entity.Vehicle;
import com.study.prep.backend.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.study.prep.backend.exception.ResourceNotFoundException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceImplTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    @Test
    void createVehicle_shouldReturnVehicleResponse() {
        VehicleRequest request = new VehicleRequest("Toyota", "Camry", "Sedan", new BigDecimal("25000.00"), 10);

        Vehicle savedVehicle = Vehicle.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(10)
                .build();

        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(savedVehicle);

        VehicleResponse response = vehicleService.createVehicle(request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getMake()).isEqualTo("Toyota");
        assertThat(response.getModel()).isEqualTo("Camry");
        assertThat(response.getCategory()).isEqualTo("Sedan");
        assertThat(response.getPrice()).isEqualByComparingTo(new BigDecimal("25000.00"));
        assertThat(response.getQuantity()).isEqualTo(10);

        verify(vehicleRepository, times(1)).save(any(Vehicle.class));
    }

    @Test
    void getAllVehicles_shouldReturnAllVehicles() {
        Vehicle vehicle1 = Vehicle.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(10)
                .build();

        Vehicle vehicle2 = Vehicle.builder()
                .id(2L)
                .make("Honda")
                .model("Civic")
                .category("Sedan")
                .price(new BigDecimal("23000.00"))
                .quantity(5)
                .build();

        when(vehicleRepository.findAll()).thenReturn(List.of(vehicle1, vehicle2));

        List<VehicleResponse> responses = vehicleService.getAllVehicles();

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getMake()).isEqualTo("Toyota");
        assertThat(responses.get(1).getMake()).isEqualTo("Honda");

        verify(vehicleRepository, times(1)).findAll();
    }

    @Test
    void updateVehicle_shouldUpdateExistingVehicle() {
        Long vehicleId = 1L;
        VehicleRequest request = new VehicleRequest("Toyota", "Corolla", "Sedan", new BigDecimal("22000.00"), 15);

        Vehicle existingVehicle = Vehicle.builder()
                .id(vehicleId)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(10)
                .build();

        Vehicle updatedVehicle = Vehicle.builder()
                .id(vehicleId)
                .make("Toyota")
                .model("Corolla")
                .category("Sedan")
                .price(new BigDecimal("22000.00"))
                .quantity(15)
                .build();

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(existingVehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(updatedVehicle);

        VehicleResponse response = vehicleService.updateVehicle(vehicleId, request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(vehicleId);
        assertThat(response.getModel()).isEqualTo("Corolla");
        assertThat(response.getPrice()).isEqualByComparingTo(new BigDecimal("22000.00"));
        assertThat(response.getQuantity()).isEqualTo(15);

        verify(vehicleRepository, times(1)).findById(vehicleId);
        verify(vehicleRepository, times(1)).save(any(Vehicle.class));
    }

    @Test
    void updateVehicle_shouldThrowResourceNotFoundException_whenVehicleDoesNotExist() {
        Long vehicleId = 99L;
        VehicleRequest request = new VehicleRequest("Toyota", "Corolla", "Sedan", new BigDecimal("22000.00"), 15);

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vehicleService.updateVehicle(vehicleId, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Vehicle not found");

        verify(vehicleRepository, times(1)).findById(vehicleId);
        verify(vehicleRepository, never()).save(any());
    }

    @Test
    void deleteVehicle_shouldDeleteExistingVehicle() {
        Long vehicleId = 1L;

        Vehicle existingVehicle = Vehicle.builder()
                .id(vehicleId)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(10)
                .build();

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(existingVehicle));

        vehicleService.deleteVehicle(vehicleId);

        verify(vehicleRepository, times(1)).findById(vehicleId);
        verify(vehicleRepository, times(1)).deleteById(vehicleId);
    }

    @Test
    void deleteVehicle_shouldThrowResourceNotFoundException_whenVehicleDoesNotExist() {
        Long vehicleId = 99L;

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vehicleService.deleteVehicle(vehicleId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Vehicle not found");

        verify(vehicleRepository, times(1)).findById(vehicleId);
        verify(vehicleRepository, never()).deleteById(any());
    }
}
