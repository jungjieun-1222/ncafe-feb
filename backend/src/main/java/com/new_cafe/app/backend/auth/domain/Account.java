package com.new_cafe.app.backend.auth.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
    private final String id;
    private final String username;
    private final String name;
    private final String nickname;
    private final String email;
    private final String phone;
    private final String password;
    private final String role;

    public static Account of(String id, String username, String name, String nickname, String email, String phone, String password, String role) {
        return new Account(id, username, name, nickname, email, phone, password, role);
    }
}
