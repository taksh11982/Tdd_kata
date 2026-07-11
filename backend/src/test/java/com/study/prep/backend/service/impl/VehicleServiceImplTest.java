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

    @Test
    void searchVehicles_byMake_shouldReturnMatchingVehicles() {
        Vehicle toyota1 = Vehicle.builder()
                .id(1L).make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000.00")).quantity(10).build();

        Vehicle toyota2 = Vehicle.builder()
                .id(2L).make("Toyota").model("Corolla").category("Sedan")
                .price(new BigDecimal("22000.00")).quantity(5).build();

        Vehicle honda = Vehicle.builder()
                .id(3L).make("Honda").model("Civic").category("Sedan")
                .price(new BigDecimal("23000.00")).quantity(8).build();

        when(vehicleRepository.findAll()).thenReturn(List.of(toyota1, toyota2, honda));

        List<VehicleResponse> results = vehicleService.searchVehicles("Toyota", null, null, null, null);

        assertThat(results).hasSize(2);
        assertThat(results).allMatch(v -> v.getMake().equals("Toyota"));
    }

    @Test
    void searchVehicles_byModel_shouldReturnMatchingVehicles() {
        Vehicle camry = Vehicle.builder()
                .id(1L).make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000.00")).quantity(10).build();

        Vehicle civic = Vehicle.builder()
                .id(2L).make("Honda").model("Civic").category("Sedan")
                .price(new BigDecimal("23000.00")).quantity(5).build();

        when(vehicleRepository.findAll()).thenReturn(List.of(camry, civic));

        List<VehicleResponse> results = vehicleService.searchVehicles(null, "Camry", null, null, null);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getModel()).isEqualTo("Camry");
    }

    @Test
    void searchVehicles_byCategory_shouldReturnMatchingVehicles() {
        Vehicle sedan = Vehicle.builder()
                .id(1L).make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000.00")).quantity(10).build();

        Vehicle suv = Vehicle.builder()
                .id(2L).make("Toyota").model("RAV4").category("SUV")
                .price(new BigDecimal("30000.00")).quantity(5).build();

        Vehicle truck = Vehicle.builder()
                .id(3L).make("Ford").model("F-150").category("Truck")
                .price(new BigDecimal("35000.00")).quantity(3).build();

        when(vehicleRepository.findAll()).thenReturn(List.of(sedan, suv, truck));

        List<VehicleResponse> results = vehicleService.searchVehicles(null, null, "Sedan", null, null);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCategory()).isEqualTo("Sedan");
    }

    @Test
    void searchVehicles_byPriceRange_shouldReturnMatchingVehicles() {
        Vehicle cheap = Vehicle.builder()
                .id(1L).make("Honda").model("Civic").category("Sedan")
                .price(new BigDecimal("20000.00")).quantity(10).build();

        Vehicle mid = Vehicle.builder()
                .id(2L).make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000.00")).quantity(5).build();

        Vehicle expensive = Vehicle.builder()
                .id(3L).make("BMW").model("X5").category("SUV")
                .price(new BigDecimal("60000.00")).quantity(2).build();

        when(vehicleRepository.findAll()).thenReturn(List.of(cheap, mid, expensive));

        List<VehicleResponse> results = vehicleService.searchVehicles(null, null, null,
                new BigDecimal("20000.00"), new BigDecimal("30000.00"));

        assertThat(results).hasSize(2);
        assertThat(results).allMatch(v ->
                v.getPrice().compareTo(new BigDecimal("20000.00")) >= 0 &&
                v.getPrice().compareTo(new BigDecimal("30000.00")) <= 0);
    }

    @Test
    void searchVehicles_withMultipleFilters_shouldReturnMatchingVehicles() {
        Vehicle toyotaCamry = Vehicle.builder()
                .id(1L).make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000.00")).quantity(10).build();

        Vehicle toyotaCorolla = Vehicle.builder()
                .id(2L).make("Toyota").model("Corolla").category("Sedan")
                .price(new BigDecimal("22000.00")).quantity(5).build();

        Vehicle hondaCivic = Vehicle.builder()
                .id(3L).make("Honda").model("Civic").category("Sedan")
                .price(new BigDecimal("23000.00")).quantity(8).build();

        when(vehicleRepository.findAll()).thenReturn(List.of(toyotaCamry, toyotaCorolla, hondaCivic));

        List<VehicleResponse> results = vehicleService.searchVehicles("Toyota", null, "Sedan",
                new BigDecimal("23000.00"), new BigDecimal("26000.00"));

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getMake()).isEqualTo("Toyota");
        assertThat(results.get(0).getModel()).isEqualTo("Camry");
    }

    @Test
    void searchVehicles_withNoFilters_shouldReturnAllVehicles() {
        Vehicle vehicle1 = Vehicle.builder()
                .id(1L).make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000.00")).quantity(10).build();

        Vehicle vehicle2 = Vehicle.builder()
                .id(2L).make("Honda").model("Civic").category("Sedan")
                .price(new BigDecimal("23000.00")).quantity(5).build();

        when(vehicleRepository.findAll()).thenReturn(List.of(vehicle1, vehicle2));

        List<VehicleResponse> results = vehicleService.searchVehicles(null, null, null, null, null);

        assertThat(results).hasSize(2);
    }

    @Test
    void searchVehicles_withNoMatches_shouldReturnEmptyList() {
        Vehicle vehicle = Vehicle.builder()
                .id(1L).make("Toyota").model("Camry").category("Sedan")
                .price(new BigDecimal("25000.00")).quantity(10).build();

        when(vehicleRepository.findAll()).thenReturn(List.of(vehicle));

        List<VehicleResponse> results = vehicleService.searchVehicles("BMW", null, null, null, null);

        assertThat(results).isEmpty();
    }

    @Test
    void purchaseVehicle_shouldPurchaseSuccessfully() {
        Long vehicleId = 1L;

        Vehicle vehicle = Vehicle.builder()
                .id(vehicleId)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(10)
                .build();

        Vehicle savedVehicle = Vehicle.builder()
                .id(vehicleId)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(9)
                .build();

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(savedVehicle);

        VehicleResponse response = vehicleService.purchaseVehicle(vehicleId);

        assertThat(response).isNotNull();
        assertThat(response.getQuantity()).isEqualTo(9);

        verify(vehicleRepository, times(1)).save(any(Vehicle.class));
    }

    @Test
    void purchaseVehicle_shouldThrowException_whenVehicleNotFound() {
        Long vehicleId = 99L;

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vehicleService.purchaseVehicle(vehicleId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Vehicle not found");

        verify(vehicleRepository, never()).save(any());
    }

    @Test
    void purchaseVehicle_shouldThrowException_whenVehicleIsOutOfStock() {
        Long vehicleId = 1L;

        Vehicle vehicle = Vehicle.builder()
                .id(vehicleId)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(0)
                .build();

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

        assertThatThrownBy(() -> vehicleService.purchaseVehicle(vehicleId))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("out of stock");

        verify(vehicleRepository, never()).save(any());
    }
}
