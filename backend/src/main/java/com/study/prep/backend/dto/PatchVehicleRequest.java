package com.study.prep.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatchVehicleRequest {

    private String make;

    private String model;

    private String category;

    private BigDecimal price;

    private Integer quantity;
}
