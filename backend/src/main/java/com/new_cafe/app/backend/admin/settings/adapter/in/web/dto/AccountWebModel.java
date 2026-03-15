package com.new_cafe.app.backend.admin.settings.adapter.in.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AccountWebModel {
    private String id;
    private String username;
    private String name;
    private String role;
}
