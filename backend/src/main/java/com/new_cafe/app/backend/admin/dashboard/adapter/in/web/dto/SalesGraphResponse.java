package com.new_cafe.app.backend.admin.dashboard.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SalesGraphResponse {
    private String time;
    private long sales;
}
