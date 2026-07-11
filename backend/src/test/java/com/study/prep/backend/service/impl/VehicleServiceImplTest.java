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

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
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
}
