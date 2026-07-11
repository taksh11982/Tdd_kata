package com.study.prep.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleStatsResponse {

    private long totalVehicles;
    private long totalStock;
    private long totalValue;
    private long lowStock;
    private long outOfStock;
    private long categories;
}
