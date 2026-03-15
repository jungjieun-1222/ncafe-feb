package com.new_cafe.app.backend.admin.settings.adapter.in.web.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAccountRequest {
    private String username;
    private String password;
    private String name;
}
