package com.new_cafe.app.backend.admin.menu.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class AdminMenuListResponse {
    private List<AdminMenuWebModel> menus;
    private long total;
}
