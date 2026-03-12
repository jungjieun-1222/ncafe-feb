package com.new_cafe.app.backend.admin.dashboard.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalSales;
    private long orderCount;
    private long reservationCount;
    private String popularMenu;
}
